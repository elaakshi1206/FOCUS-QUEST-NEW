import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, AlertCircle, CheckCircle2 } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
/** Minimum Web Speech API confidence score (0–1) to accept a transcript. */
const CONFIDENCE_THRESHOLD = 0.7;
/** Silence window in ms after speech stops before auto-submitting. */
const SILENCE_DEBOUNCE_MS = 1500;
/** If confidence is below threshold, retry once silently before showing error. */
const MAX_STT_RETRIES = 1;

export interface VoiceInputProps {
  /** Called with the accepted transcript text ONLY after confidence gate passes. */
  onTranscriptComplete: (text: string) => void;
  /** Unique ID for logging — maps to the current question or audio input session. */
  audioInputId?: string;
  disabled?: boolean;
}

// Ensure TypeScript knows about window.SpeechRecognition and webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// ─── Structured logger ────────────────────────────────────────────────────────
function logSTT(audioInputId: string, transcript: string, confidence: number, decision: string) {
  console.group(`[STT] audioInputId=${audioInputId}`);
  console.log('Transcript  :', transcript);
  console.log('Confidence  :', confidence.toFixed(3));
  console.log('Decision    :', decision);
  console.groupEnd();
}

export function VoiceInput({ onTranscriptComplete, audioInputId = 'unknown', disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [displayTranscript, setDisplayTranscript] = useState('');
  /** Null = no error. STT errors always shadow any downstream validation messages. */
  const [sttError, setSttError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const recognitionRef   = useRef<any>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * We capture the latest transcript + confidence inside a ref so that the
   * onend handler (which is a stale closure) can safely read them without
   * causing double-commit via a useEffect dependency.
   */
  const bestTranscriptRef  = useRef('');
  const bestConfidenceRef  = useRef(0);
  /** Prevents the manual toggleListen path AND the onend auto path from both committing. */
  const commitFiredRef     = useRef(false);

  // ── Core commit gate ────────────────────────────────────────────────────────
  /**
   * The single exit point for a recognised utterance.
   * Enforces: non-empty check → confidence gate → onTranscriptComplete.
   * Never fires more than once per recording session.
   */
  const commitTranscript = (text: string, confidence: number) => {
    if (commitFiredRef.current) return; // guard against double-commit
    commitFiredRef.current = true;

    const trimmed = text.trim();

    if (trimmed.length === 0) {
      logSTT(audioInputId, trimmed, confidence, 'REJECTED – empty transcript');
      setSttError('No speech detected. Please tap the mic and speak clearly.');
      return;
    }

    if (confidence < CONFIDENCE_THRESHOLD) {
      logSTT(audioInputId, trimmed, confidence, `REJECTED – confidence ${confidence.toFixed(2)} < ${CONFIDENCE_THRESHOLD}`);
      // Retry silently once before surfacing the error
      if (retryCount < MAX_STT_RETRIES) {
        setRetryCount(r => r + 1);
        setSttError(`I had trouble hearing that clearly. Please speak again. (attempt ${retryCount + 2})`);
        // Reset commit guard so the next attempt can commit
        commitFiredRef.current = false;
        return;
      }
      setSttError("I still couldn't hear you clearly. Try speaking louder or closer to the mic.");
      return;
    }

    logSTT(audioInputId, trimmed, confidence, `ACCEPTED – confidence ${confidence.toFixed(2)}`);
    // Clear any lingering STT error before handing off to validation
    setSttError(null);
    onTranscriptComplete(trimmed);
  };

  // ── Recognition lifecycle ───────────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSttError('Voice recognition is not supported in this browser. Use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous    = true;
    recognition.interimResults = true;
    recognition.lang           = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSttError(null);
      setDisplayTranscript('');
      bestTranscriptRef.current = '';
      bestConfidenceRef.current = 0;
      commitFiredRef.current    = false;
    };

    recognition.onresult = (event: any) => {
      let currentText = '';
      let bestConf    = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        currentText += result[0].transcript;
        // Use max confidence across all results this browser provides
        if (result[0].confidence > bestConf) bestConf = result[0].confidence;
      }

      // Some browsers always return 0 for interimResults; default to 1.0 so
      // we don't block on a 0-confidence interim result.
      if (bestConf === 0) bestConf = 1.0;

      setDisplayTranscript(currentText);
      bestTranscriptRef.current = currentText;
      bestConfidenceRef.current = bestConf;

      // Reset silence debounce
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (currentText.trim().length > 0) {
        debounceTimerRef.current = setTimeout(() => {
          // Auto-stop after 1.5 s of silence; onend will handle commit
          recognition.stop();
        }, SILENCE_DEBOUNCE_MS);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('[STT] Recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setSttError('Microphone access denied. Please allow microphone usage in your browser.');
        setIsListening(false);
      } else if (event.error === 'no-speech') {
        // no-speech fires during silence in continuous mode; only surface if nothing was heard
        if (bestTranscriptRef.current.length === 0) {
          setSttError('No speech detected. Please speak clearly.');
        }
      } else {
        setSttError(`Recognition error: ${event.error}. Please try again.`);
        setIsListening(false);
      }
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      // Auto-path commit (1.5 s timeout triggered recognition.stop())
      commitTranscript(bestTranscriptRef.current, bestConfidenceRef.current);
    };

    recognitionRef.current = recognition;

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      try { recognitionRef.current?.stop(); } catch { /* ignore */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]); // Re-initialise recognition on retry so onstart resets state cleanly

  // ── Manual toggle ───────────────────────────────────────────────────────────
  const toggleListen = () => {
    if (disabled) return;
    if (isListening) {
      // Manual stop – mark commit guard so onend doesn't double-fire
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      recognitionRef.current?.stop();
      setIsListening(false);
      // Let onend handle the commit (it always fires after stop())
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error('[STT] Failed to start recognition:', e);
        setSttError('Could not start voice recognition. Refresh and try again.');
      }
    }
  };

  // ── Manual re-submit (if user wants to reuse the current transcript) ─────────
  const overrideSubmit = () => {
    if (displayTranscript.trim().length > 0 && !isListening) {
      commitFiredRef.current = false; // allow re-submit
      commitTranscript(displayTranscript, bestConfidenceRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4 mt-6">

      {/* Visual Feedback – STT errors take full priority over any other text */}
      <div className="min-h-[3rem] w-full text-center px-4">
        {sttError ? (
          <p className="text-red-400 font-medium text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" /> {sttError}
          </p>
        ) : displayTranscript ? (
          <p className="text-white text-xl font-bold italic opacity-90 transition-all">"{displayTranscript}"</p>
        ) : isListening ? (
          <p className="text-white/60 animate-pulse text-sm">Listening… Speak now</p>
        ) : (
          <p className="text-white/50 text-sm">Tap the microphone and say your answer.</p>
        )}
      </div>

      <div className="flex gap-4">
        {/* Record button */}
        <motion.button
          onClick={toggleListen}
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          className={`
            relative flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-colors
            ${disabled ? 'bg-gray-600 cursor-not-allowed opacity-50' : isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
          `}
        >
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-400 opacity-50"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {isListening
            ? <Square className="w-8 h-8 text-white fill-current" />
            : <Mic    className="w-8 h-8 text-white" />}
        </motion.button>

        {/* Manual submit — visible when recording has stopped and there is a transcript */}
        {!isListening && displayTranscript.trim().length > 0 && !disabled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center w-20 h-20 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white"
            onClick={overrideSubmit}
          >
            <CheckCircle2 className="w-8 h-8" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
