import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useGame } from '@/lib/store';
import { CHARACTERS } from '@/lib/data';
import { Map } from 'lucide-react';
import confetti from 'canvas-confetti';

const XP_MILESTONES = [0, 500, 1200, 2500, 5000];

export function Rewards() {
  const [, setLocation] = useLocation();
  const { xp, level, streak } = useGame();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newUnlocks, setNewUnlocks] = useState<typeof CHARACTERS>([]);

  useEffect(() => {
    // Celebration confetti
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#2EC4FF', '#FF8A5B', '#3ED598'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#2EC4FF', '#FF8A5B', '#3ED598'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Check for newly unlocked characters
    const unlocked = CHARACTERS.filter(c => c.requiredXp > 0 && xp >= c.requiredXp && xp - 150 < c.requiredXp + 150);
    setNewUnlocks(unlocked);
    setTimeout(() => setShowLevelUp(true), 500);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <AnimatedBackground />

      <div className="z-10 text-center w-full max-w-2xl">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
          <div className="text-8xl mb-6">🎁</div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-8">Epic Loot!</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-3xl">
            <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mb-2">Total XP</p>
            <p className="text-4xl font-display font-bold text-primary">{xp}</p>
          </motion.div>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="glass-panel p-6 rounded-3xl">
            <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mb-2">Level</p>
            <p className="text-4xl font-display font-bold text-accent">⭐ {level}</p>
          </motion.div>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="glass-panel p-6 rounded-3xl">
            <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mb-2">Streak</p>
            <p className="text-4xl font-display font-bold text-orange-500">{streak} 🔥</p>
          </motion.div>
        </div>

        {/* XP Milestones */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-panel p-5 rounded-3xl mb-8">
          <p className="font-display font-bold text-sm text-muted-foreground mb-3">Character Unlock Progress</p>
          <div className="flex items-center gap-1">
            {XP_MILESTONES.map((m, i) => {
              const reached = xp >= m;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${reached ? 'bg-primary text-white border-primary' : 'bg-muted text-muted-foreground border-border'}`}>
                    {reached ? '✓' : i + 1}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{m} XP</span>
                  {i < XP_MILESTONES.length - 1 && (
                    <div className={`absolute h-0.5 ${reached ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* New character unlocks */}
        {newUnlocks.length > 0 && (
          <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.8, type: "spring" }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-3xl shadow-2xl mb-8 border-4 border-white/50">
            <h2 className="text-2xl font-display font-bold mb-3">🎉 New Character Unlocked!</h2>
            <div className="flex justify-center gap-4">
              {newUnlocks.map(c => (
                <div key={c.id} className="text-center character-unlock">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mx-auto mb-2">
                    <img src={`${import.meta.env.BASE_URL}${c.imagePath.replace(/^\//, '')}`} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-bold text-sm">{c.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {showLevelUp && (
          <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-3xl shadow-2xl mb-8 border-4 border-white/50">
            <h2 className="text-3xl font-display font-bold mb-2">Level Up!</h2>
            <p className="text-xl font-bold">You are now Level {level}</p>
            <p className="mt-2 text-sm opacity-80">Check the crew page for new characters!</p>
          </motion.div>
        )}

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setLocation('/map')}
          className="game-button game-button-primary px-12 py-5 text-xl inline-flex items-center gap-3 mx-auto">
          <Map /> Return to Map
        </motion.button>
      </div>
    </div>
  );
}
