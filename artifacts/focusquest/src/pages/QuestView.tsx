import { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTS } from '@/lib/data';
import { useGame } from '@/lib/store';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Play, Check, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function QuestView() {
  const [, params] = useRoute('/quest/:subjectId/:questId');
  const [, setLocation] = useLocation();
  const { completeQuest } = useGame();
  
  const questId = params?.questId;
  const quest = QUESTS.find(q => q.id === questId);

  const [step, setStep] = useState<'video' | 'notes' | 'quiz'>('video');
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [currentQ, setCurrentQ] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15s per question

  useEffect(() => {
    if (isPlaying && step === 'video') {
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 2; // Simulate 5s video for demo (2% every 100ms)
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, step]);

  useEffect(() => {
    if (step === 'quiz' && !isAnswered && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Timeout
    }
  }, [step, isAnswered, timeLeft]);

  if (!quest) return <div>Quest not found</div>;

  const handleVideoComplete = () => {
    setStep('notes');
  };

  const handleNotesComplete = () => {
    setStep('quiz');
    setTimeLeft(15);
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    const correct = index === quest.quiz[currentQ].correctIndex;
    if (correct) {
      setQuizScore(prev => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#2EC4FF', '#FF8A5B', '#3ED598'] });
    } else {
      setShowHint(true);
    }

    setTimeout(() => {
      if (currentQ < quest.quiz.length - 1) {
        setCurrentQ(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowHint(false);
        setTimeLeft(15);
      } else {
        finishQuest(correct ? quizScore + 1 : quizScore);
      }
    }, correct ? 1500 : 3000); // More time to read hint if wrong
  };

  const finishQuest = (finalScore: number) => {
    const accuracy = (finalScore / quest.quiz.length) * 100;
    // Store temporarily for results page
    sessionStorage.setItem('lastResult', JSON.stringify({
      questId: quest.id,
      score: accuracy,
      xpEarned: quest.xpReward,
      subjectId: quest.subjectId
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
          <h2 className="font-display font-bold text-2xl text-primary">{quest.title}</h2>
          <div className="flex gap-2">
            <Badge active={step === 'video' || step === 'notes' || step === 'quiz'} label="1. Watch" />
            <Badge active={step === 'notes' || step === 'quiz'} label="2. Learn" />
            <Badge active={step === 'quiz'} label="3. Quiz" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'video' && (
            <motion.div key="video" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel p-8 rounded-3xl">
              <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center border-4 border-border">
                {!isPlaying && videoProgress === 0 ? (
                  <button onClick={() => setIsPlaying(true)} className="game-button game-button-primary rounded-full w-20 h-20 flex items-center justify-center pl-2">
                    <Play className="w-10 h-10" />
                  </button>
                ) : (
                  <div className="w-full h-full p-8 flex flex-col justify-end pb-12 bg-gradient-to-t from-primary/20 to-transparent">
                    <div className="text-center mb-8">
                      <h3 className="text-white text-2xl font-bold mb-2">Simulated Educational Video</h3>
                      <p className="text-white/70">Paying attention adds to your focus score!</p>
                    </div>
                    <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-100" style={{ width: `${videoProgress}%` }} />
                    </div>
                  </div>
                )}
                {videoProgress >= 100 && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-white text-2xl font-bold mb-6">Video Complete!</h3>
                    <button onClick={handleVideoComplete} className="game-button game-button-primary px-8 py-3 text-lg">Continue to Notes</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel p-8 rounded-3xl">
              <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                <span className="p-2 bg-primary/20 rounded-lg">📝</span> Key Takeaways
              </h3>
              <ul className="space-y-4 mb-8">
                {quest.notes.map((note, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                    className="flex items-start gap-3 p-4 bg-background/50 rounded-xl border border-border"
                  >
                    <Check className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-lg">{note}</span>
                  </motion.li>
                ))}
              </ul>
              <button onClick={handleNotesComplete} className="game-button game-button-primary w-full py-4 text-xl">I'm Ready for the Quiz!</button>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-8 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-muted-foreground uppercase tracking-wider">Question {currentQ + 1} of {quest.quiz.length}</span>
                <div className={`font-bold px-3 py-1 rounded-full ${timeLeft < 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/20 text-primary'}`}>
                  ⏳ {timeLeft}s
                </div>
              </div>
              
              <h3 className="text-2xl font-display font-bold mb-8 text-card-foreground">
                {quest.quiz[currentQ].question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {quest.quiz[currentQ].options.map((opt, i) => {
                  let btnClass = "bg-background border-border hover:border-primary/50 text-foreground";
                  if (isAnswered) {
                    if (i === quest.quiz[currentQ].correctIndex) {
                      btnClass = "bg-green-500 border-green-600 text-white scale-105 shadow-lg shadow-green-500/50";
                    } else if (i === selectedAnswer) {
                      btnClass = "bg-red-500 border-red-600 text-white opacity-80";
                    } else {
                      btnClass = "opacity-50 grayscale";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(i)}
                      className={`p-5 rounded-2xl border-2 font-bold text-lg transition-all duration-300 ${btnClass} ${!isAnswered ? 'active:scale-95' : ''}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-4 bg-orange-500/20 border border-orange-500 rounded-xl flex gap-3 text-orange-700 dark:text-orange-400 font-bold">
                    <AlertCircle className="shrink-0" />
                    <p>Hint: {quest.quiz[currentQ].hint}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Badge({ active, label }: { active: boolean, label: string }) {
  return (
    <div className={`px-3 py-1 rounded-full font-bold text-sm ${active ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}`}>
      {label}
    </div>
  );
}
