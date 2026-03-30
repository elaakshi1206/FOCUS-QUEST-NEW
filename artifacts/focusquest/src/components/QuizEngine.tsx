/**
 * QuizEngine.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium anti-gravity quiz orchestrator.
 *
 * Anti-gravity physics:
 *  - Hover: buttons lift (translateY -8px) + spring scale + subtle 3D rotate
 *  - Mouse proximity repulsion: options gently drift away from cursor
 *  - Correct: sparkle burst + float-rise animation
 *  - Wrong: red shake + floating timestamp feedback card
 *  - Match/Sequence: Framer Motion drag with spring snap
 *
 * Architecture:
 *  QuizEngine
 *   ├── FloatingProgress       (Q 3 of 6 pill)
 *   ├── CountdownTimer
 *   ├── McqQuestion            (includes ImageQuestion variant)
 *   ├── TrueFalseQuestion
 *   ├── FillBlankQuestion
 *   ├── MatchPairQuestion
 *   ├── SequenceQuestion
 *   ├── FeedbackOverlay        (correct/wrong anim + sparkles)
 *   ├── TimestampCard          (wrong answer → seek video)
 *   └── AntiCheatModal
 */

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useQuiz } from '@/hooks/useQuiz';
import { getMascotThemeProps, VIDEO_TIMESTAMPS } from '@/lib/data';
import { useGame } from '@/lib/store';
import { Rewind, CheckCircle2, XCircle, ChevronRight, Youtube } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  questId: string;
  focusLevel?: number;
  onComplete: (score: number, total: number, wrongIds: string[]) => void;
}

// ─── Sparkle component ────────────────────────────────────────────────────────
function Sparkle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      className="pointer-events-none fixed z-50 w-3 h-3 rounded-full"
      style={{ left: x, top: y, backgroundColor: color }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0], y: [0, -60 - Math.random() * 40], x: [(Math.random() - 0.5) * 80] }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    />
  );
}

// ─── Floating progress pill ───────────────────────────────────────────────────
function FloatingProgress({ current, total }: { current: number; total: number }) {
  return (
    <motion.div
      key={current}
      initial={{ y: -20, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex items-center gap-3 mb-6"
    >
      <div className="flex gap-1.5 flex-1">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="h-2 flex-1 rounded-full"
            animate={{
              backgroundColor: i < current ? 'hsl(var(--primary))' : i === current ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--muted))',
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="glass-panel px-3 py-1 rounded-full font-display font-bold text-sm text-primary whitespace-nowrap"
      >
        ✨ {current + 1} / {total}
      </motion.span>
    </motion.div>
  );
}

// ─── Countdown timer ──────────────────────────────────────────────────────────
function CountdownTimer({ seconds, max = 18 }: { seconds: number; max?: number }) {
  const pct = (seconds / max) * 100;
  const isUrgent = seconds <= 5;
  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-display font-bold text-sm ${isUrgent ? 'bg-red-500 text-white' : 'bg-primary/15 text-primary'}`}
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
    >
      <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <motion.circle
          cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"
          strokeDasharray="62.8"
          animate={{ strokeDashoffset: 62.8 - (pct / 100) * 62.8 }}
          transition={{ duration: 0.5 }}
          strokeLinecap="round"
        />
      </svg>
      {seconds}s
    </motion.div>
  );
}

// ─── Anti-gravity MCQ button ──────────────────────────────────────────────────
function AntiGravityButton({
  label, index, onClick, state: btnState, disabled, mouseX, mouseY
}: {
  label: string;
  index: number;
  onClick: () => void;
  state: 'default' | 'correct' | 'wrong' | 'dim';
  disabled: boolean;
  mouseX: number;
  mouseY: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const repelX = useMotionValue(0);
  const repelY = useMotionValue(0);
  const springX = useSpring(repelX, { stiffness: 120, damping: 15 });
  const springY = useSpring(repelY, { stiffness: 120, damping: 15 });

  // Repulsion effect — button drifts away from cursor
  React.useEffect(() => {
    if (disabled || !ref.current) return;
    const btn = ref.current.getBoundingClientRect();
    const cx = btn.left + btn.width / 2;
    const cy = btn.top + btn.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 120;
    if (dist < radius) {
      const strength = (1 - dist / radius) * 18;
      repelX.set((-dx / dist) * strength);
      repelY.set((-dy / dist) * strength);
    } else {
      repelX.set(0);
      repelY.set(0);
    }
  }, [mouseX, mouseY, disabled]);

  const bgColor = btnState === 'correct' ? 'bg-green-400/90 border-green-500 text-white scale-105 shadow-2xl shadow-green-400/40'
    : btnState === 'wrong'   ? 'bg-red-400/90 border-red-500 text-white'
    : btnState === 'dim'     ? 'opacity-40 grayscale border-border'
    : 'bg-card/80 border-border hover:border-primary text-card-foreground';

  const labels = ['A', 'B', 'C', 'D'];

  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      style={{ x: springX, y: springY, perspective: 600 }}
      whileHover={!disabled ? { y: -8, scale: 1.04, rotateX: 4, rotateY: (index % 2 === 0 ? -4 : 4) } : {}}
      whileTap={!disabled ? { scale: 0.97, y: -2 } : {}}
      animate={btnState === 'wrong' ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative p-5 rounded-2xl border-2 font-bold text-lg transition-colors duration-200 text-left cursor-pointer select-none ${bgColor}`}
    >
      <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-display font-bold text-primary">
        {labels[index] ?? index + 1}
      </span>
      <span className="ml-8 block">{label}</span>
    </motion.button>
  );
}

// ─── MCQ / Image Question ─────────────────────────────────────────────────────
function McqQuestion({ question, onAnswer, isAnswered, selectedIdx, mouseX, mouseY }: {
  question: import('@/hooks/useQuiz').ShuffledQuestion;
  onAnswer: (idx: number) => void;
  isAnswered: boolean;
  selectedIdx: number | null;
  mouseX: number;
  mouseY: number;
}) {
  return (
    <div className="space-y-3">
      {question.type === 'image' && (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-8xl text-center py-4 select-none"
        >
          {question.imageEmoji}
        </motion.div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.displayOptions.map((opt, i) => {
          const st = !isAnswered ? 'default'
            : i === question.mappedCorrectIndex ? 'correct'
            : i === (selectedIdx ?? -1) ? 'wrong'
            : 'dim';
          return (
            <AntiGravityButton
              key={i} index={i} label={opt} onClick={() => onAnswer(i)}
              state={st} disabled={isAnswered} mouseX={mouseX} mouseY={mouseY}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── True / False Question ────────────────────────────────────────────────────
function TrueFalseQuestion({ question, onAnswer, isAnswered, selectedIdx, mouseX, mouseY }: {
  question: import('@/hooks/useQuiz').ShuffledQuestion;
  onAnswer: (idx: number) => void;
  isAnswered: boolean;
  selectedIdx: number | null;
  mouseX: number;
  mouseY: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {['True', 'False'].map((label, i) => {
        const st = !isAnswered ? 'default'
          : i === question.mappedCorrectIndex ? 'correct'
          : i === (selectedIdx ?? -1) ? 'wrong'
          : 'dim';
        return (
          <AntiGravityButton
            key={label} index={i} label={`${i === 0 ? '✅' : '❌'} ${label}`}
            onClick={() => onAnswer(i)} state={st} disabled={isAnswered}
            mouseX={mouseX} mouseY={mouseY}
          />
        );
      })}
    </div>
  );
}

// ─── Fill in the Blank ────────────────────────────────────────────────────────
function FillBlankQuestion({ question, value, onChange, onSubmit, isAnswered, isCorrect }: {
  question: import('@/hooks/useQuiz').ShuffledQuestion;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
}) {
  return (
    <div className="space-y-4">
      <motion.div className="relative">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isAnswered && onSubmit()}
          disabled={isAnswered}
          placeholder="Type your answer here…"
          className={`w-full px-5 py-4 rounded-2xl border-2 font-bold text-xl bg-card/80 text-card-foreground outline-none transition-all ${
            isAnswered
              ? isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
              : 'border-border focus:border-primary'
          }`}
        />
        {/* Animated underline bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value.length > 0 ? 1 : 0 }}
          style={{ originX: 0 }}
        />
      </motion.div>
      {!isAnswered && (
        <motion.button
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
          className="game-button game-button-primary w-full py-4 text-xl"
        >
          Submit Answer ✏️
        </motion.button>
      )}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl font-bold text-center text-lg ${isCorrect ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'}`}
        >
          {isCorrect ? '✅ Correct!' : `❌ Correct answer: "${question.answer}"`}
        </motion.div>
      )}
    </div>
  );
}

// ─── Match the Pair Question ──────────────────────────────────────────────────
function MatchPairQuestion({ question, selections, onSelect, onSubmit, isAnswered, isCorrect }: {
  question: import('@/hooks/useQuiz').ShuffledQuestion;
  selections: Record<string, string>;
  onSelect: (left: string, right: string) => void;
  onSubmit: () => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
}) {
  const [activePair, setActivePair] = useState<string | null>(null);
  const pairs = question.pairs ?? [];
  const rights = question.shuffledRights ?? pairs.map(p => p.right);

  const handleLeftClick = (left: string) => {
    if (isAnswered) return;
    setActivePair(left);
  };
  const handleRightClick = (right: string) => {
    if (isAnswered || !activePair) return;
    onSelect(activePair, right);
    setActivePair(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center mb-3">Concepts</p>
          {pairs.map(p => (
            <motion.button
              key={p.left}
              onClick={() => handleLeftClick(p.left)}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full p-3 rounded-xl border-2 font-bold text-sm text-left transition-all ${
                activePair === p.left
                  ? 'border-primary bg-primary/15 text-primary'
                  : selections[p.left]
                  ? (isAnswered && !isCorrect
                      ? selections[p.left] === p.right ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
                      : 'border-primary/50 bg-primary/10')
                  : 'border-border bg-card/80'
              }`}
            >
              {p.left}
            </motion.button>
          ))}
        </div>
        {/* Right column */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center mb-3">Matches</p>
          {rights.map(r => (
            <motion.button
              key={r}
              onClick={() => handleRightClick(r)}
              whileHover={activePair ? { x: -4, scale: 1.02 } : {}}
              whileTap={{ scale: 0.97 }}
              className={`w-full p-3 rounded-xl border-2 font-bold text-sm text-left transition-all ${
                activePair
                  ? 'border-accent bg-accent/10 text-accent-foreground cursor-pointer'
                  : Object.values(selections).includes(r)
                  ? 'border-primary/50 bg-primary/10 opacity-60'
                  : 'border-border bg-card/80'
              }`}
            >
              {r}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Show current pairings */}
      {Object.keys(selections).length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          {Object.entries(selections).map(([l, r]) => `${l} → ${r}`).join(' · ')}
        </div>
      )}

      {!isAnswered && Object.keys(selections).length === pairs.length && (
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
          className="game-button game-button-primary w-full py-4 text-xl"
        >
          Check My Matches 🔗
        </motion.button>
      )}
    </div>
  );
}

// ─── Sequence / Ordering Question ─────────────────────────────────────────────
function SequenceQuestion({ question, order, onMove, onSubmit, isAnswered, isCorrect }: {
  question: import('@/hooks/useQuiz').ShuffledQuestion;
  order: string[];
  onMove: (from: number, to: number) => void;
  onSubmit: () => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
}) {
  const [dragging, setDragging] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted-foreground text-center">Drag items into the correct order ↕️</p>
      <div className="space-y-2">
        {order.map((item, i) => (
          <motion.div
            key={item}
            drag="y"
            dragConstraints={{ top: -60, bottom: 60 }}
            dragElastic={0.2}
            onDragStart={() => setDragging(i)}
            onDragEnd={(_, info) => {
              setDragging(null);
              const moved = Math.round(info.offset.y / 60);
              if (moved !== 0) {
                const to = Math.max(0, Math.min(order.length - 1, i + moved));
                onMove(i, to);
              }
            }}
            whileDrag={{ scale: 1.05, zIndex: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 font-bold cursor-grab active:cursor-grabbing select-none ${
              isAnswered
                ? isCorrect ? 'border-green-500 bg-green-500/10' : 'border-border bg-card/80 opacity-80'
                : dragging === i
                ? 'border-primary bg-primary/15'
                : 'border-border bg-card/80 hover:border-primary/50'
            }`}
          >
            <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {i + 1}
            </span>
            <span className="flex-1">{item}</span>
            <span className="text-muted-foreground text-xl">⠿</span>
          </motion.div>
        ))}
      </div>
      {!isAnswered && (
        <motion.button
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
          className="game-button game-button-primary w-full py-4 text-xl"
        >
          Lock In Order 🔒
        </motion.button>
      )}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl font-bold text-center ${isCorrect ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'}`}
        >
          {isCorrect ? '🏆 Perfect Order!' : `Correct order: ${question.sequence?.join(' → ')}`}
        </motion.div>
      )}
    </div>
  );
}

// ─── Anti-cheat modal ─────────────────────────────────────────────────────────
function AntiCheatModal({ penaltyCount, theme, onDismiss }: {
  penaltyCount: number;
  theme: 'ocean' | 'space' | 'future';
  onDismiss: () => void;
}) {
  const { emoji, name } = getMascotThemeProps(theme);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.5 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="glass-panel p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl border-2 border-red-500/60"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.6, repeat: 2 }}
          className="text-7xl mb-4"
        >
          {emoji}
        </motion.div>
        <h3 className="font-display text-2xl font-bold text-red-400 mb-2">Hey! No Peeking! 👀</h3>
        <p className="font-bold text-muted-foreground mb-1">
          {name} caught you switching tabs!
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          The questions have been reshuffled.<br />
          Penalty: <span className="text-red-400 font-bold">-5 Focus Score</span>
          {penaltyCount > 1 && <> (×{penaltyCount} this session)</>}
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDismiss}
          className="game-button game-button-primary w-full py-3 text-lg"
        >
          I'll Stay Focused! 🎯
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Timestamp feedback card ───────────────────────────────────────────────────
function TimestampCard({ questionId }: { questionId: string }) {
  const ts = VIDEO_TIMESTAMPS.find(v => v.questionId === questionId);
  if (!ts) return null;

  const seekVideo = () => {
    // If it has a videoId, open YouTube at that exact time
    if (ts.videoId) {
      const [m, s] = ts.startTime.split(':').map(Number);
      const seconds = m * 60 + s;
      window.open(`https://youtu.be/${ts.videoId}?t=${seconds}`, '_blank');
      return;
    }

    // Fallback for non-YouTube quests
    const [m, s] = ts.startTime.split(':').map(Number);
    const seconds = m * 60 + s;
    window.dispatchEvent(new CustomEvent('quiz-seek-video', { detail: { seconds, questId: questionId } }));
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={seekVideo}
      className="w-full p-4 bg-primary/10 border-2 border-primary/50 rounded-2xl flex items-center gap-3 font-bold text-sm text-left hover:border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] transition-all animate-pulse-glow"
    >
      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
        {ts.videoId ? <Youtube className="w-5 h-5 text-primary" /> : <Rewind className="w-5 h-5 text-primary" />}
      </div>
      <div className="flex-1">
        <p className="text-primary text-xs uppercase tracking-wider font-bold mb-0.5">
          {ts.videoId ? '📺 Re-watch this part on YouTube' : '📺 Review in video'}
        </p>
        <p className="text-card-foreground font-semibold">Topic taught: {ts.label}</p>
        <p className="text-muted-foreground text-xs mt-0.5">⏱ {ts.startTime} – {ts.endTime}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-primary shrink-0" />
    </motion.button>
  );
}

// ─── Main QuizEngine ──────────────────────────────────────────────────────────
export function QuizEngine({ questId, focusLevel = 50, onComplete }: Props) {
  const { theme } = useGame();
  const { emoji: mascotEmoji, name: mascotName } = getMascotThemeProps(theme);

  const { state, current, actions } = useQuiz(questId, focusLevel, onComplete);

  // Mouse position for repulsion effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Sparkles state
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const sparkleColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#22D3EE'];

  const triggerSparkles = useCallback(() => {
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.6,
      color: sparkleColors[i % sparkleColors.length],
    }));
    setSparkles(prev => [...prev, ...newSparkles]);
    setTimeout(() => setSparkles(prev => prev.filter(s => !newSparkles.find(n => n.id === s.id))), 1200);
  }, []);

  // Detect correct answer for sparkles
  const wasCorrect = state.isAnswered &&
    (() => {
      if (!current) return false;
      if (current.type === 'fillblank') return state.fillInput.trim().toLowerCase() === (current.answer ?? '').trim().toLowerCase();
      if (current.type === 'match') return (current.pairs ?? []).every(p => state.matchSelections[p.left] === p.right);
      if (current.type === 'sequence') return JSON.stringify(state.sequenceOrder) === JSON.stringify(current.sequence);
      const idx = parseInt(state.selectedAnswer ?? '-1');
      return idx === current.mappedCorrectIndex;
    })();

  // Fire confetti + sparkles on correct
  React.useEffect(() => {
    if (wasCorrect) {
      triggerSparkles();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.75 }, colors: ['#2EC4FF', '#FFD700', '#3ED598'] });
    }
  }, [state.isAnswered, state.currentIndex]);

  if (!current) return null;

  const selectedIdx = state.selectedAnswer !== null ? parseInt(state.selectedAnswer) : null;

  // Type label for display
  const typeLabel: Record<string, string> = {
    mcq: '🎯 Multiple Choice',
    truefalse: '✅ True or False',
    fillblank: '✏️ Fill in the Blank',
    match: '🔗 Match the Pair',
    sequence: '🔢 Put in Order',
    image: '🖼️ Image Question',
  };

  return (
    <motion.div
      onMouseMove={onMouseMove}
      className="relative"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      {/* Fixed sparkles layer */}
      <AnimatePresence>
        {sparkles.map(s => <Sparkle key={s.id} x={s.x} y={s.y} color={s.color} />)}
      </AnimatePresence>

      {/* Anti-cheat modal */}
      <AnimatePresence>
        {state.antiCheatTriggered && (
          <AntiCheatModal penaltyCount={state.penaltyCount} theme={theme} onDismiss={actions.dismissAntiCheat} />
        )}
      </AnimatePresence>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <motion.span
            key={current.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-bold text-muted-foreground"
          >
            {typeLabel[current.type]}
          </motion.span>
          <CountdownTimer seconds={state.timeLeft} />
        </div>

        {/* Floating progress */}
        <FloatingProgress current={state.currentIndex} total={state.questions.length} />

        {/* Question text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${state.currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            {/* Difficulty badge */}
            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: current.difficulty }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  className="text-yellow-400 text-lg"
                >
                  ⭐
                </motion.span>
              ))}
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-card-foreground leading-snug">
              {current.question}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Question type renderer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`qa-${state.currentIndex}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            {(current.type === 'mcq' || current.type === 'image') && (
              <McqQuestion
                question={current}
                onAnswer={actions.selectMcq}
                isAnswered={state.isAnswered}
                selectedIdx={selectedIdx}
                mouseX={mousePos.x}
                mouseY={mousePos.y}
              />
            )}
            {current.type === 'truefalse' && (
              <TrueFalseQuestion
                question={current}
                onAnswer={actions.selectMcq}
                isAnswered={state.isAnswered}
                selectedIdx={selectedIdx}
                mouseX={mousePos.x}
                mouseY={mousePos.y}
              />
            )}
            {current.type === 'fillblank' && (
              <FillBlankQuestion
                question={current}
                value={state.fillInput}
                onChange={actions.setFillInput}
                onSubmit={actions.submitFill}
                isAnswered={state.isAnswered}
                isCorrect={state.isAnswered ? wasCorrect : null}
              />
            )}
            {current.type === 'match' && (
              <MatchPairQuestion
                question={current}
                selections={state.matchSelections}
                onSelect={actions.setMatchSelection}
                onSubmit={actions.submitMatch}
                isAnswered={state.isAnswered}
                isCorrect={state.isAnswered ? wasCorrect : null}
              />
            )}
            {current.type === 'sequence' && (
              <SequenceQuestion
                question={current}
                order={state.sequenceOrder}
                onMove={actions.moveSequenceItem}
                onSubmit={actions.submitSequence}
                isAnswered={state.isAnswered}
                isCorrect={state.isAnswered ? wasCorrect : null}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Feedback section */}
        <AnimatePresence>
          {state.isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-3 overflow-hidden"
            >
              {/* Correct / wrong banner */}
              <motion.div
                animate={wasCorrect ? { y: [0, -6, 0] } : {}}
                transition={{ repeat: wasCorrect ? Infinity : 0, duration: 2 }}
                className={`p-4 rounded-2xl flex items-center gap-3 font-bold ${wasCorrect ? 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/40' : 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/40'}`}
              >
                {wasCorrect ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
                <div>
                  {wasCorrect
                    ? <p>🎉 Brilliant! Well done, {mascotName} is proud!</p>
                    : <p>💪 Not quite! {mascotName} says: {current.hint}</p>
                  }
                </div>
              </motion.div>

              {/* Video timestamp card for wrong answers */}
              {!wasCorrect && <TimestampCard questionId={current.id} />}

              {/* Mascot reaction */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-3 glass-panel rounded-2xl"
              >
                <motion.span
                  animate={{ rotate: wasCorrect ? [0, 20, -20, 0] : [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl"
                >
                  {mascotEmoji}
                </motion.span>
                <p className="text-sm font-bold text-muted-foreground">
                  {wasCorrect
                    ? `${mascotName}: "Excellent work! Keep going! 🚀"`
                    : `${mascotName}: "Note the timestamp below! Re-watch the lesson at that time to understand why. 📚"`
                  }
                </p>
              </motion.div>

              {/* Manual next button (shown before auto-advance) */}
              {state.currentIndex < state.questions.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={actions.nextQuestion}
                  className="game-button game-button-secondary w-full py-3 text-lg flex items-center justify-center gap-2"
                >
                  Next Question <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
              {state.currentIndex === state.questions.length - 1 && (
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-center text-sm font-bold text-muted-foreground"
                >
                  🏁 Calculating your score…
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
