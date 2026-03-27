import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/store';

interface FocusQuestVideoStepProps {
  videoId: string;
  questId: string;
  stepId: string;
  stepTitle?: string;
  onComplete?: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

// ─── AstroBot SVG Mascot ───────────────────────────────────────────────────────
function AstroBotSVG() {
  return (
    <svg viewBox="0 0 120 140" width="96" height="112" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna left */}
      <line x1="42" y1="18" x2="35" y2="4" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="35" cy="3" r="4" fill="#f43f5e"/>
      {/* Antenna right */}
      <line x1="78" y1="18" x2="85" y2="4" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="85" cy="3" r="4" fill="#f43f5e"/>
      {/* Head */}
      <rect x="25" y="18" width="70" height="54" rx="20" ry="20" fill="#e2e8f0"/>
      {/* Visor */}
      <rect x="33" y="28" width="54" height="28" rx="10" ry="10" fill="#1e3a5f"/>
      {/* Eyes */}
      <rect x="40" y="34" width="16" height="16" rx="4" fill="#38bdf8"/>
      <rect x="64" y="34" width="16" height="16" rx="4" fill="#38bdf8"/>
      {/* Eye shine */}
      <circle cx="44" cy="38" r="3" fill="white" opacity="0.7"/>
      <circle cx="68" cy="38" r="3" fill="white" opacity="0.7"/>
      {/* Mouth */}
      <rect x="48" y="60" width="24" height="6" rx="3" fill="#94a3b8"/>
      {/* Body */}
      <rect x="30" y="76" width="60" height="48" rx="14" ry="14" fill="#f1f5f9"/>
      {/* Chest panel */}
      <rect x="42" y="86" width="36" height="22" rx="7" fill="#1e3a5f"/>
      <circle cx="52" cy="97" r="5" fill="#38bdf8" opacity="0.9"/>
      <circle cx="68" cy="97" r="5" fill="#f43f5e" opacity="0.9"/>
      {/* Left arm */}
      <rect x="10" y="78" width="18" height="36" rx="9" fill="#e2e8f0"/>
      {/* Right arm */}
      <rect x="92" y="78" width="18" height="36" rx="9" fill="#e2e8f0"/>
      {/* Ear left */}
      <rect x="20" y="30" width="8" height="24" rx="4" fill="#f43f5e"/>
      {/* Ear right */}
      <rect x="92" y="30" width="8" height="24" rx="4" fill="#f43f5e"/>
    </svg>
  );
}

// ─── Tab-Switch Warning Modal ─────────────────────────────────────────────────
function VideoTabWarningModal({
  penaltyCount,
  onDismiss,
}: {
  penaltyCount: number;
  theme: 'ocean' | 'space' | 'future';
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        initial={{ scale: 0.55, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.55, y: 40 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="relative max-w-sm w-full text-center"
        style={{
          background: 'linear-gradient(160deg, #1c1c2e 0%, #16213e 100%)',
          borderRadius: '28px',
          padding: '36px 32px 32px',
          boxShadow: '0 0 60px rgba(139,92,246,0.25), 0 20px 60px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Robot mascot */}
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 8, 0] }}
          transition={{ duration: 0.7, repeat: 1 }}
          className="flex justify-center mb-4"
        >
          <AstroBotSVG />
        </motion.div>

        {/* Title */}
        <h3 style={{ color: '#f43f5e', fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.5px' }}>
          Hey! No Peeking! 👀
        </h3>

        {/* Subtitle */}
        <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
          AstroBot caught you switching tabs!
        </p>

        {/* Details */}
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '28px', lineHeight: 1.6 }}>
          Your video has been paused.
          <br />
          Penalty:{' '}
          <span style={{ color: '#f43f5e', fontWeight: 700 }}>-5 Focus Score</span>
          {penaltyCount > 1 && <span style={{ color: '#94a3b8' }}> (×{penaltyCount} this session)</span>}
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDismiss}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '1.1rem',
            background: 'linear-gradient(90deg, #7c3aed 0%, #9333ea 50%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(139,92,246,0.45)',
            letterSpacing: '0.2px',
          }}
        >
          I'll Stay Focused! 🎯
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const FocusQuestVideoStep: React.FC<FocusQuestVideoStepProps> = ({
  videoId,
  questId,
  stepId,
  stepTitle = 'Video Lesson',
  onComplete,
}) => {
  const { theme } = useGame();

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Loading player...');
  const [progress, setProgress] = useState(0);

  // Tab-switch modal state
  const [showTabModal, setShowTabModal] = useState(false);
  const [tabPenaltyCount, setTabPenaltyCount] = useState(0);

  const lastKnownTimeRef = useRef<number>(0);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false); // stable ref for visibility handler

  const ALLOWED_SKIP_BUFFER = 1.5;
  const TRACKING_INTERVAL = 800;

  const showWarning = (msg: string) => {
    setWarningMessage(msg);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    warningTimeoutRef.current = setTimeout(() => setWarningMessage(null), 4000);
  };

  const handleVideoComplete = useCallback(() => {
    setIsCompleted(true);
    setStatusMessage('✅ Video completed!');
    setProgress(100);
  }, []);

  const handlePlayerStateChange = useCallback(
    (event: any) => {
      if (!window.YT) return;
      if (event.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        isPlayingRef.current = true;
        setStatusMessage('Watching... Stay focused ✨');
        startTracking();
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
        stopTracking();
        if (event.data === window.YT.PlayerState.PAUSED && !isCompleted) {
          setStatusMessage('Video paused. Please resume to continue.');
        } else if (event.data === window.YT.PlayerState.ENDED) {
          handleVideoComplete();
        } else if (event.data === window.YT.PlayerState.BUFFERING) {
          setStatusMessage('Buffering...');
        }
      }
    },
    [isCompleted, handleVideoComplete]
  );

  const trackProgress = useCallback(() => {
    if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;
    const currentTime = playerRef.current.getCurrentTime();
    const duration = playerRef.current.getDuration();
    if (currentTime > lastKnownTimeRef.current + ALLOWED_SKIP_BUFFER) {
      playerRef.current.seekTo(lastKnownTimeRef.current, true);
      showWarning('🚫 Skip detected! Returning to previous position. Stay focused for full rewards.');
    } else {
      lastKnownTimeRef.current = currentTime;
    }
    if (duration > 0) {
      setProgress((lastKnownTimeRef.current / duration) * 100);
    }
  }, []);

  const startTracking = () => {
    if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    trackingIntervalRef.current = setInterval(trackProgress, TRACKING_INTERVAL);
  };

  const stopTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
  };

  // Right-click prevention
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const container = playerContainerRef.current;
    if (container) container.addEventListener('contextmenu', preventContextMenu);
    return () => { if (container) container.removeEventListener('contextmenu', preventContextMenu); };
  }, []);

  // Tab-switch detection → show modal instead of toast
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlayingRef.current && playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
        setTabPenaltyCount(prev => prev + 1);
        setShowTabModal(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      if (!playerContainerRef.current) return;
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          controls: 0, disablekb: 1, modestbranding: 1, rel: 0,
          fs: 0, iv_load_policy: 3, playsinline: 1, autoplay: 1,
          enablejsapi: 1, origin: window.location.origin,
        },
        events: {
          onReady: () => { setIsReady(true); setStatusMessage('Ready! Playing...'); },
          onStateChange: handlePlayerStateChange,
        },
      });
    }

    return () => {
      stopTracking();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId, handlePlayerStateChange]);

  const handleDismissTabModal = () => {
    setShowTabModal(false);
    // Resume video after user acknowledges
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  };

  const handleCompleteClick = async () => {
    if (!isCompleted) return;
    try {
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Failed to complete step:', error);
      showWarning('Error saving progress. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-[#0f0f0f] rounded-xl shadow-2xl text-white font-sans">

      {/* ── Tab-Switch Modal ── */}
      <AnimatePresence>
        {showTabModal && (
          <VideoTabWarningModal
            penaltyCount={tabPenaltyCount}
            theme={theme}
            onDismiss={handleDismissTabModal}
          />
        )}
      </AnimatePresence>

      {/* Header / Status */}
      <div className="mb-4 flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 text-center">{stepTitle}</h2>
        <div className="text-sm mt-2 text-gray-400 font-medium">{statusMessage}</div>
      </div>

      {/* Video Container */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden ring-1 ring-gray-800 shadow-inner group">
        {/* Focus badge */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-black/5 group-hover:bg-black/20 transition-colors duration-300">
          <div className="absolute top-4 w-full flex justify-center">
            <span className="bg-black/80 text-white/70 text-xs px-4 py-1.5 rounded-full backdrop-blur-md font-semibold select-none shadow-lg border border-white/10">
              Focus Mode Active • No Skipping • Full watch required
            </span>
          </div>
        </div>

        {/* Skip-detection toast */}
        {warningMessage && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-red-600/95 text-white px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md animate-bounce text-center max-w-[85%] border border-red-400/30">
            <p className="font-bold text-sm md:text-base">{warningMessage}</p>
          </div>
        )}

        {/* YouTube player */}
        <div ref={playerContainerRef} className="w-full h-full" />
      </div>

      {/* Progress & Complete button */}
      <div className="mt-8 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-gray-800 h-2 rounded-full overflow-hidden mb-8 shadow-inner">
          <div
            className="bg-indigo-500 h-full transition-all duration-300 ease-linear rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={handleCompleteClick}
          disabled={!isCompleted}
          className={`px-8 py-3.5 rounded-full font-bold text-lg md:text-xl transition-all duration-500 transform
            ${isCompleted
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)] cursor-pointer'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-70'}`}
        >
          {isCompleted ? 'Mark Step as Complete ✅' : 'Watch Full Video to Unlock'}
        </button>
      </div>
    </div>
  );
};
