import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTS } from '@/lib/data';
import { useGame } from '@/lib/store';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { QuizEngine } from '@/components/QuizEngine';
import { FocusQuestVideoStep } from '@/components/FocusQuestVideoStep';
import { Play, Check, Clock, Youtube } from 'lucide-react';

const DIFFICULTY_LABELS = ['', 'Easy', 'Medium', 'Hard'];
const DIFFICULTY_COLORS = ['', 'bg-green-500', 'bg-orange-500', 'bg-red-500'];

export function QuestView() {
  const [, params] = useRoute('/quest/:subjectId/:questId');
  const [, setLocation] = useLocation();
  const { completeQuest, userName, isHydrated } = useGame();

  const questId = params?.questId ?? '';
  const quest = QUESTS.find(q => q.id === questId);

  const [step, setStep] = useState<'video' | 'notes' | 'quiz'>('video');
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Focus level: starts at 50, increases as video + notes are completed
  const [focusLevel, setFocusLevel] = useState(50);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && step === 'video') {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setIsPlaying(false); return 100; }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, step]);

  // Auth guard
  useEffect(() => {
    if (isHydrated && !userName) setLocation('/');
  }, [isHydrated, userName, setLocation]);

  if (!isHydrated || !userName) return null;
  if (!quest) return <div>Quest not found</div>;

  const handleVideoComplete = () => {
    setFocusLevel(f => Math.min(100, f + 15)); // reward for watching
    setStep('notes');
  };

  const handleNotesComplete = () => {
    setFocusLevel(f => Math.min(100, f + 10)); // reward for reading notes
    setStep('quiz');
  };

  // Called by QuizEngine when quiz finishes
  const handleQuizComplete = (score: number, wrongIds: string[]) => {
    const total = 10; // QuizEngine uses count of 6, score is count correct
    const accuracy = Math.round((score / 6) * 100);
    sessionStorage.setItem('lastResult', JSON.stringify({
      questId: quest.id,
      score: accuracy,
      xpEarned: quest.xpReward,
      subjectId: quest.subjectId,
      wrongTimestamps: [],
    }));
    completeQuest(quest.id, accuracy, quest.xpReward, quest.subjectId);
    setLocation('/results');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />

      <div className="w-full max-w-3xl z-10">
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-6 glass-panel px-6 py-4 rounded-2xl">
          <div>
            <h2 className="font-display font-bold text-2xl text-primary">{quest.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[quest.difficulty]}`}>
                {DIFFICULTY_LABELS[quest.difficulty]}
              </span>
              <span className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />{quest.timeMins} min
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge active={step === 'video' || step === 'notes' || step === 'quiz'} label="1. Watch" />
            <Badge active={step === 'notes' || step === 'quiz'} label="2. Learn" />
            <Badge active={step === 'quiz'} label="3. Quiz" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── VIDEO STEP ── */}
          {step === 'video' && (
            <motion.div key="video" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-8 rounded-3xl space-y-6">

              {/* Title row */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-card-foreground">{quest.title} — Lesson Video</h3>
                  <p className="text-sm text-muted-foreground font-bold">Watch the video to boost your Focus Score before the quiz!</p>
                </div>
              </div>

              {quest.videoId ? (
                /* ── Real YouTube embed with Anti-Skip ── */
                <div className="flex flex-col gap-6 w-full relative">
                  <FocusQuestVideoStep
                    videoId={quest.videoId}
                    questId={quest.id}
                    stepId="video"
                    stepTitle={quest.title}
                    onComplete={handleVideoComplete}
                  />


                </div>
              ) : (
                /* ── Fallback simulated player ── */
                <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center border-4 border-border">
                  {!isPlaying && videoProgress === 0 ? (
                    <div className="flex flex-col items-center gap-4">
                      <button onClick={() => setIsPlaying(true)} className="game-button game-button-primary rounded-full w-20 h-20 flex items-center justify-center pl-2">
                        <Play className="w-10 h-10" />
                      </button>
                      <p className="text-white/60 font-bold text-sm">Tap to start the lesson</p>
                    </div>
                  ) : (
                    <div className="w-full h-full p-8 flex flex-col justify-end pb-12 bg-gradient-to-t from-primary/20 to-transparent">
                      <div className="text-center mb-8">
                        <div className="text-6xl mb-4 animate-float">📺</div>
                        <h3 className="text-white text-2xl font-bold mb-2">{quest.title}</h3>
                        <p className="text-white/70">Video cannot be skipped — paying attention boosts your Focus Score!</p>
                      </div>
                      <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 rounded-full relative xp-bar-shine" style={{ width: `${videoProgress}%` }} />
                      </div>
                      <p className="text-center text-white/60 text-sm mt-2 font-bold">{Math.round(videoProgress)}% complete</p>
                    </div>
                  )}
                  {videoProgress >= 100 && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-white text-2xl font-bold mb-6">Video Complete!</h3>
                      <p className="text-white/60 mb-6 font-bold">Notes & Quiz are now unlocked</p>
                      <button onClick={handleVideoComplete} className="game-button game-button-primary px-8 py-3 text-lg">Continue to Notes</button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ── NOTES STEP ── */}
          {step === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-8 rounded-3xl">
              <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                <span className="p-2 bg-primary/20 rounded-lg">📝</span> Key Takeaways
              </h3>
              <ul className="space-y-4 mb-8">
                {quest.notes.map((note, i) => (
                  <motion.li key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-3 p-4 bg-background/50 rounded-xl border border-border">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-lg">{note}</span>
                  </motion.li>
                ))}
              </ul>
              <button onClick={handleNotesComplete} className="game-button game-button-primary w-full py-4 text-xl">I'm Ready for the Quiz!</button>
            </motion.div>
          )}

          {/* ── QUIZ STEP — delegated to QuizEngine ── */}
          {step === 'quiz' && (
            <QuizEngine
              key={`quiz-${questId}`}
              questId={questId}
              focusLevel={focusLevel}
              onComplete={handleQuizComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`px-3 py-1 rounded-full font-bold text-sm transition-all ${active ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}`}>
      {label}
    </div>
  );
}
