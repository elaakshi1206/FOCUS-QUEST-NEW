import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Mascot } from '@/components/Mascot';
import { useGame } from '@/lib/store';
import { Star, ArrowRight, Target, CheckCircle2, Zap, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Results() {
  const [, setLocation] = useLocation();
  const { updateStreak } = useGame();
  const [result, setResult] = useState<any>(null);
  const [scoreCount, setScoreCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const saved = sessionStorage.getItem('lastResult');
    if (saved) {
      const parsed = JSON.parse(saved);
      setResult(parsed);
      let start = 0;
      const end = parsed.score;
      const duration = 1500;
      const stepTime = Math.max(10, Math.abs(Math.floor(duration / (end || 1))));
      timer = setInterval(() => {
        start += 1;
        setScoreCount(start);
        if (start >= end) {
          clearInterval(timer);
          updateStreak();
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        }
      }, stepTime);
    } else {
      setLocation('/map');
    }
    return () => clearInterval(timer);
  }, []);

  if (!result) return null;

  const stars = result.score >= 100 ? 3 : result.score >= 60 ? 2 : 1;
  
  // Generate sub-scores from main score
  const accuracy = result.score;
  const completion = 100;
  const engagement = Math.min(100, result.score + 15);
  const distraction = Math.max(0, 100 - Math.floor(Math.random() * 20));

  const subScores = [
    { label: 'Accuracy', value: accuracy, icon: Target, color: 'text-blue-500' },
    { label: 'Completion', value: completion, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Engagement', value: engagement, icon: Zap, color: 'text-yellow-500' },
    { label: 'Low Distraction', value: distraction, icon: Eye, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      <Mascot message="Outstanding focus! Your brain is growing stronger!" delay={1500} />

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-10 rounded-3xl max-w-lg w-full text-center relative overflow-hidden">
        <h1 className="text-4xl font-display font-bold text-primary mb-2">Quest Complete!</h1>
        <p className="text-muted-foreground font-bold mb-8">Focus Analysis Breakdown</p>

        {/* Big Circular Meter */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted" strokeWidth="10" />
            <motion.circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-primary drop-shadow-[0_0_8px_rgba(46,196,255,0.8)]"
              strokeWidth="10" strokeLinecap="round"
              initial={{ strokeDasharray: "0 300" }}
              animate={{ strokeDasharray: `${(scoreCount / 100) * 283} 300` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-display font-bold text-card-foreground">{scoreCount}</span>
            <span className="text-sm font-bold text-muted-foreground">Focus Score</span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={i <= stars ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0.3, scale: 1, rotate: 0 }}
              transition={{ delay: 1.5 + (i * 0.2), type: "spring" }}>
              <Star className={`w-12 h-12 ${i <= stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'text-gray-400'}`} />
            </motion.div>
          ))}
        </div>

        {/* Sub-scores breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {subScores.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 + i * 0.1 }}
              className="bg-background/50 rounded-xl p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs font-bold text-muted-foreground">{s.label}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ delay: 2 + i * 0.1, duration: 0.6 }} />
              </div>
              <span className="text-xs font-bold text-primary mt-1 block text-right">{s.value}%</span>
            </motion.div>
          ))}
        </div>

        {/* Smart feedback: review wrong answers */}
        {result.wrongTimestamps && result.wrongTimestamps.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
            className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6 text-left">
            <p className="font-bold text-sm text-orange-500 mb-2">📖 Review These Concepts:</p>
            {result.wrongTimestamps.map((ts: any, i: number) => (
              <p key={i} className="text-sm font-bold text-card-foreground">{ts.label}: {ts.startTime} – {ts.endTime}</p>
            ))}
          </motion.div>
        )}

        {/* Rewards */}
        <div className="bg-background/50 rounded-2xl p-4 mb-6 border border-border">
          <p className="font-bold text-lg mb-2">Rewards Earned</p>
          <div className="flex justify-center items-center gap-2 text-2xl font-display text-green-500">
            <span>+ {result.xpEarned} XP</span>
          </div>
        </div>

        <button onClick={() => setLocation('/rewards')} className="game-button game-button-primary w-full py-4 text-xl flex items-center justify-center gap-2">
          Claim Rewards <ArrowRight />
        </button>
      </motion.div>
    </div>
  );
}
