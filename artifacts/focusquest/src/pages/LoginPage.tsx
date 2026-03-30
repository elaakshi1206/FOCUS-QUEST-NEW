import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Gamepad2, Sparkles } from 'lucide-react';
import { useGame } from '@/lib/store';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { LoginForm } from '@/components/login/LoginForm';

// Floating decorative emojis
const FLOATERS = ['🗺️', '⭐', '🏆', '🎮', '🧩', '💎', '🚀', '🌟', '⚔️', '🪄'];

export function LoginPage() {
  const [, setLocation] = useLocation();
  const { isHydrated, userName, logout } = useGame();

  // Clear any active session when this page mounts
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If already logged in, redirect to map
  useEffect(() => {
    if (isHydrated && userName) {
      setLocation('/map');
    }
  }, [isHydrated, userName, setLocation]);

  if (!isHydrated) return null;

  const handleLoginSuccess = (identifier: string, isNewUser: boolean) => {
    // Derive a hero name: take the part before '@' if it's an email, otherwise use as-is
    const name =
      identifier.includes('@')
        ? identifier.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim() || 'Explorer'
        : identifier.trim();

    localStorage.setItem('focusquest_active_user', name);

    if (isNewUser) {
      // Brand new account → always go through setup
      sessionStorage.setItem('pending_new_user', name);
      setLocation('/setup');
      return;
    }

    // Returning user: check if a saved profile exists → map, else setup
    const raw = localStorage.getItem('focusquest_profiles_v2');
    if (raw) {
      try {
        const map = JSON.parse(raw);
        if (map[name.toLowerCase()]) {
          window.location.href = '/map';
          return;
        }
      } catch { /* ignore */ }
    }
    sessionStorage.setItem('pending_new_user', name);
    setLocation('/setup');
  };

  const handleGuest = () => {
    const guestName = `Guest_${Date.now().toString(36).slice(-4).toUpperCase()}`;
    sessionStorage.setItem('pending_new_user', guestName);
    localStorage.setItem('focusquest_active_user', guestName);
    setLocation('/setup');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated gradient background */}
      <AnimatedBackground />

      {/* Floating emoji decorations */}
      {FLOATERS.map((emoji, i) => (
        <motion.div
          key={i}
          className="fixed text-2xl sm:text-3xl pointer-events-none z-0 select-none"
          style={{ left: `${(i * 9 + 4) % 92}%`, top: `${12 + (i * 7) % 72}%` }}
          animate={{
            y: [0, -16, 0],
            rotate: [0, 8, -8, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + (i % 3) * 0.8,
            delay: i * 0.25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Main card container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
        className="w-full max-w-md z-10"
      >
        {/* ── Header ── */}
        <div className="text-center mb-7">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full border border-white/30 text-white/80 font-semibold text-xs mb-4 tracking-wide"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            Gamified Learning Platform
          </motion.div>

          {/* App name */}
          <div className="flex justify-center mb-2">
            <img 
              src="/background/bg_logo-removebg-preview.png" 
              alt="Focus Quest" 
              className="h-40 sm:h-48 w-auto object-contain drop-shadow-[0_0_30px_rgba(46,196,255,0.4)]" 
            />
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-base font-semibold flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Begin Your Focus Journey
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.p>
        </div>

        {/* ── Login Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl p-6 sm:p-7 shadow-2xl"
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' }}
        >
          {/* Card title */}
          <div className="mb-5">
            <h2 className="text-white font-black text-xl">Welcome, Explorer! 🎮</h2>
            <p className="text-white/50 text-sm font-medium mt-0.5">Sign in or create a new account to begin</p>
          </div>

          <LoginForm onSuccess={handleLoginSuccess} onGuest={handleGuest} />
        </motion.div>

        {/* ── Mascot bubble ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-5 flex items-center gap-3"
        >
          <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-2xl border-4 border-white/40 shadow-xl flex-shrink-0">
            🦜
          </div>
          <div className="bg-white/12 backdrop-blur border border-white/25 text-white/80 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm font-semibold shadow-lg">
            Ready for today&apos;s quest? Let's go! 🗺️
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
