import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useGame } from '@/lib/store';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Gamepad2, Star, Zap, Trophy, LogIn, UserPlus } from 'lucide-react';

const floatingItems = [
  { emoji: '🏴‍☠️', x: '10%', delay: 0, size: 'text-4xl' },
  { emoji: '⚓', x: '85%', delay: 0.5, size: 'text-3xl' },
  { emoji: '💎', x: '20%', delay: 1, size: 'text-3xl' },
  { emoji: '🗺️', x: '75%', delay: 1.5, size: 'text-4xl' },
  { emoji: '⚔️', x: '5%', delay: 2, size: 'text-2xl' },
  { emoji: '🌊', x: '90%', delay: 0.8, size: 'text-3xl' },
  { emoji: '🔮', x: '45%', delay: 2.5, size: 'text-2xl' },
  { emoji: '🪙', x: '60%', delay: 1.2, size: 'text-3xl' },
  { emoji: '🌟', x: '30%', delay: 0.3, size: 'text-2xl' },
  { emoji: '🚀', x: '70%', delay: 1.8, size: 'text-3xl' },
];

const stats = [
  { icon: Star, label: 'Quests', value: '100+' },
  { icon: Zap, label: 'Focus XP', value: '∞' },
  { icon: Trophy, label: 'Characters', value: '14' },
];

export function Landing() {
  const [, setLocation] = useLocation();
  const { isHydrated, userName } = useGame();

  if (!isHydrated) return null;

  const handleStart = () => {
    if (userName) {
      setLocation('/map');
    } else {
      setLocation('/setup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Floating decorations */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          className={`fixed ${item.size} pointer-events-none z-0 select-none`}
          style={{ left: item.x, top: `${15 + (i * 7) % 70}%` }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 3 + (i % 3),
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
      
      {/* Main content */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="text-center z-10 relative"
      >
        {/* Logo badge */}
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full border border-white/40 text-white font-bold text-sm mb-6"
        >
          🎮 Gamified Learning Platform
        </motion.div>

        {/* Main title */}
        <div className="relative inline-block mb-4">
          <h1 className="text-7xl md:text-9xl font-display font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]" style={{ textShadow: '0 0 40px rgba(46,196,255,0.6), 0 4px 0 rgba(0,0,0,0.3)' }}>
            Focus<span className="text-yellow-300 drop-shadow-[0_0_20px_rgba(255,220,50,0.8)]">Quest</span>
          </h1>
          <motion.div 
            className="absolute -top-4 -right-6 text-5xl"
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            ⚔️
          </motion.div>
          <motion.div 
            className="absolute -bottom-2 -left-6 text-4xl"
            animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
          >
            🏆
          </motion.div>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="text-2xl md:text-3xl text-white font-bold max-w-md mx-auto mb-4 drop-shadow-md"
        >
          Turn Focus Into Adventure
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/80 text-lg mb-10 max-w-sm mx-auto"
        >
          Complete quests, earn XP, unlock legendary characters!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
        >
          {userName ? (
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="game-button game-button-primary text-xl px-12 py-5 inline-flex items-center gap-3"
            >
              <Gamepad2 className="w-6 h-6" />
              Continue Adventure
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={() => setLocation('/setup')}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="game-button game-button-primary text-xl px-10 py-5 inline-flex items-center gap-3"
              >
                <UserPlus className="w-6 h-6" />
                Login / Sign Up
              </motion.button>
              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="game-button text-xl px-8 py-5 bg-white/20 backdrop-blur text-white border-2 border-white/40 inline-flex items-center gap-3"
              >
                <Gamepad2 className="w-5 h-5" />
                Play as Guest
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 1 }}
          className="flex justify-center gap-6"
        >
          {stats.map(({ icon: Icon, label, value }, i) => (
            <div key={i} className="text-center bg-white/15 backdrop-blur px-5 py-3 rounded-2xl border border-white/30">
              <div className="flex items-center justify-center gap-1.5 text-white/90 text-sm font-bold mb-1">
                <Icon className="w-4 h-4" />
                {label}
              </div>
              <div className="text-2xl font-display font-bold text-yellow-300">{value}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Animated mascot at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-6 right-6 z-20 flex items-end gap-3"
      >
        <motion.div
          className="bg-white/20 backdrop-blur border border-white/40 text-white px-5 py-4 rounded-2xl rounded-br-none text-base font-bold max-w-56 shadow-xl"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🦜 Hello Explorer! Welcome to FocusQuest! Ready to level up your focus?
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-4xl border-4 border-white/50 shadow-2xl"
        >
          🦜
        </motion.div>
      </motion.div>
    </div>
  );
}
