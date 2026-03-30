import { VOICE_QUIZ_MASTER_PROMPT } from './voiceQuizPrompt';

const GEMINI_FALLBACK_KEYS: string[] = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3,
].filter(Boolean);

export interface VoiceEvaluation {
  status: 'CORRECT' | 'PARTIAL' | 'INCORRECT';
  feedback: string;
  /** Internal flag — prevents the UI from layering a second error on top of this one. */
  isSttError?: boolean;
}

// ─── Logging helper ───────────────────────────────────────────────────────────
function logEval(
  audioInputId: string,
  transcript: string,
  confidence: number,
  result: VoiceEvaluation
) {
  console.group(`[VoiceEval] audioInputId=${audioInputId}`);
  console.log('Transcript :', transcript);
  console.log('Confidence :', confidence.toFixed(3));
  console.log('Status     :', result.status);
  console.log('Feedback   :', result.feedback);
  console.groupEnd();
}

/**
 * Pre-validation: checks structural rules on the transcript before the AI call.
 * Returns an INCORRECT VoiceEvaluation if the rule is violated, or null if OK.
 *
 * Keyword guard: ONLY checks for a required word if the expectedText
 * explicitly contains it AND the transcript is for a sentence-formation
 * exercise (i.e. the question uses "make a sentence using the word ...").
 */
function preValidate(transcript: string, expectedText?: string, questionText?: string): VoiceEvaluation | null {
  const lower = transcript.toLowerCase();
  const questionLower = (questionText ?? '').toLowerCase();

  // Only enforce keyword check for "make a sentence using X" type questions
  const isSentenceQuestion = /make a sentence using (the word )?/i.test(questionLower);

  if (isSentenceQuestion && expectedText) {
    // Extract required keyword from expectedText (e.g. "because")
    const requiredKeyword = expectedText.trim().toLowerCase();
    if (requiredKeyword.length > 0 && !lower.includes(requiredKeyword)) {
      return {
        status: 'INCORRECT',
        feedback: `Make sure to include the word "${expectedText}" in your sentence and try again.`,
      };
    }
  }

  return null; // pre-validation passed
}

/**
 * Evaluates the student's transcribed voice snippet using the Gemini AI
 * guided by the Voice-Based Quiz Master Prompt.
 *
 * Pipeline:
 *  1. Guard: reject empty transcript immediately (STT error, not validation error)
 *  2. Pre-validate: check required keywords before calling AI
 *  3. Gemini AI evaluation with fallback keys + models
 *  4. Single fallback error message if all API calls fail
 */
export async function evaluateVoiceAnswer(
  questionText: string,
  studentAnswer: string,
  attemptNumber: number,
  expectedText?: string,
  audioInputId = 'unknown',
  confidence = 1.0,
): Promise<VoiceEvaluation> {

  // ── 1. STT Guard ────────────────────────────────────────────────────────────
  // Only reaches here if VoiceInput already passed the confidence gate.
  // Belt-and-suspenders: reject completely empty transcripts immediately.
  if (!studentAnswer || studentAnswer.trim().length === 0) {
    const sttResult: VoiceEvaluation = {
      status: 'PARTIAL',
      feedback: "I had trouble hearing that. Please speak clearly and try again.",
      isSttError: true,
    };
    logEval(audioInputId, studentAnswer, confidence, sttResult);
    return sttResult;
  }

  // ── 2. Pre-validation (keyword check) ───────────────────────────────────────
  // Run BEFORE the AI call so only ONE error message surfaces at a time.
  const preValidationError = preValidate(studentAnswer, expectedText, questionText);
  if (preValidationError) {
    logEval(audioInputId, studentAnswer, confidence, preValidationError);
    return preValidationError;
  }

  // ── 3. Gemini AI Evaluation ─────────────────────────────────────────────────
  const payload = {
    question: questionText,
    studentAnswer,
    attemptNumber,
    ...(expectedText ? { expectedAnswer: expectedText } : {})
  };

  const userMessage = JSON.stringify(payload);

  for (const apiKey of GEMINI_FALLBACK_KEYS) {
    for (const model of ['gemini-2.5-flash', 'gemini-1.5-flash']) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: VOICE_QUIZ_MASTER_PROMPT }] },
              contents: [{ role: 'user', parts: [{ text: userMessage }] }],
              generationConfig: {
                temperature: 0.2,           // Low temperature for deterministic evaluation
                responseMimeType: 'application/json'
              },
            }),
          }
        );

        if (!res.ok) {
          console.warn(`[VoiceEval] Gemini API error: ${res.status}`);
          continue;
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          try {
            const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            const evalResult = JSON.parse(cleanText) as VoiceEvaluation;

            if (!['CORRECT', 'PARTIAL', 'INCORRECT'].includes(evalResult.status)) {
              evalResult.status = 'PARTIAL';
            }
            logEval(audioInputId, studentAnswer, confidence, evalResult);
            return evalResult;
          } catch (parseErr) {
            console.warn(`[VoiceEval] Parse error on payload:`, text, parseErr);
            const isCorrect = /"status"\s*:\s*"CORRECT"/i.test(text);
            const isPartial = /"status"\s*:\s*"PARTIAL"/i.test(text);
            const fallback: VoiceEvaluation = {
              status: isCorrect ? 'CORRECT' : (isPartial ? 'PARTIAL' : 'INCORRECT'),
              feedback: 'Processed with fallback. Try again.',
            };
            logEval(audioInputId, studentAnswer, confidence, fallback);
            return fallback;
          }
        }
      } catch (err) {
        console.warn(`[VoiceEval] Network or unhandled error:`, err);
        continue;
      }
    }
  }

  // ── 4. Last-resort fallback ─────────────────────────────────────────────────
  // All API keys exhausted. Return a single, clear message — NOT two overlapping ones.
  const lastResort: VoiceEvaluation = {
    status: 'PARTIAL',
    feedback: GEMINI_FALLBACK_KEYS.length === 0
      ? "API keys missing. Check your environment variables."
      : "Couldn't reach the evaluation server. Check your connection and try again.",
    isSttError: GEMINI_FALLBACK_KEYS.length > 0, // treat network failure like STT error for UI priority
  };
  logEval(audioInputId, studentAnswer, confidence, lastResort);
  return lastResort;
}
