import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useGame } from '@/lib/store';
import { Map } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Rewards() {
  const [, setLocation] = useLocation();
  const { xp, level, streak } = useGame();
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    // Continuous confetti for rewards screen
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2EC4FF', '#FF8A5B', '#3ED598']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2EC4FF', '#FF8A5B', '#3ED598']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // In a real app we'd check if previous level < current level, but for demo we just show it
    setTimeout(() => setShowLevelUp(true), 500);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <AnimatedBackground />

      <div className="z-10 text-center w-full max-w-2xl">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="text-8xl mb-6">🎁</div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-8">
            Epic Loot!
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div 
            initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-3xl"
          >
            <p className="text-muted-foreground font-bold uppercase tracking-wider mb-2">Total XP</p>
            <p className="text-5xl font-display font-bold text-primary">{xp}</p>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="glass-panel p-6 rounded-3xl"
          >
            <p className="text-muted-foreground font-bold uppercase tracking-wider mb-2">Focus Streak</p>
            <p className="text-5xl font-display font-bold text-orange-500">{streak} 🔥</p>
          </motion.div>
        </div>

        {showLevelUp && (
          <motion.div 
            initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-3xl shadow-2xl mb-12 border-4 border-white/50"
          >
            <h2 className="text-3xl font-display font-bold mb-2">Level Up!</h2>
            <p className="text-xl font-bold">You are now Level {level}</p>
            <p className="mt-2 text-sm">Check the crew page to see if you unlocked anyone new!</p>
          </motion.div>
        )}

        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setLocation('/map')}
          className="game-button game-button-primary px-12 py-5 text-xl inline-flex items-center gap-3 mx-auto"
        >
          <Map /> Return to Map
        </motion.button>
      </div>
    </div>
  );
}
