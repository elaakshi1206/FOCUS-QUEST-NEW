import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useGame, getAllProfiles, UserProfile } from '@/lib/store';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Gamepad2, LogIn, UserPlus, ArrowRight, Users } from 'lucide-react';
import { MascotLogo } from '@/components/MascotLogo';


// Emoji avatars for user cards when no real avatar is stored
const THEME_EMOJIS: Record<string, string> = {
  ocean: '🏴‍☠️',
  space: '🚀',
  future: '🤖',
};

function UserCard({ profile, onClick }: { profile: UserProfile; onClick: () => void }) {
  const emoji = THEME_EMOJIS[profile.theme] ?? '🎮';
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.96 }}
      className="flex items-center gap-4 w-full bg-white/15 hover:bg-white/25 backdrop-blur border-2 border-white/30 hover:border-white/60 rounded-2xl px-5 py-4 transition-all text-left"
    >
      <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl flex-shrink-0">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-lg truncate">{profile.userName}</p>
        <p className="text-white/70 text-sm font-bold">
          Lvl {profile.level} · {profile.xp} XP · {profile.completedQuests.length} quests done
        </p>
      </div>
      <ArrowRight className="w-5 h-5 text-white/60 flex-shrink-0" />
    </motion.button>
  );
}

export function Landing() {
  const [, setLocation] = useLocation();
  const { isHydrated, userName, logout } = useGame();

  const [inputName, setInputName] = useState('');
  const [existingProfiles, setExistingProfiles] = useState<UserProfile[]>([]);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load existing profiles from localStorage
  useEffect(() => {
    setExistingProfiles(getAllProfiles());
  }, []);

  // If already logged in, go straight to map
  useEffect(() => {
    if (isHydrated && userName) {
      setLocation('/map');
    }
  }, [isHydrated, userName, setLocation]);

  // Ensure logged out when landing page mounts (e.g. after "Switch User")
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isHydrated) return null;

  const handleLoginExisting = (profile: UserProfile) => {
    // Load the profile by setting active user in localStorage and reloading
    localStorage.setItem('focusquest_active_user', profile.userName);
    window.location.href = '/map';
  };

  const handleNewLogin = () => {
    const name = inputName.trim();
    if (!name) {
      setError('Please enter your name!');
      inputRef.current?.focus();
      return;
    }

    // Check if this name already exists
    const lname = name.toLowerCase();
    const existing = existingProfiles.find(p => p.userName.toLowerCase() === lname);
    if (existing) {
      // Log in as existing user
      handleLoginExisting(existing);
    } else {
      // New user: store name in session then go to setup
      sessionStorage.setItem('pending_new_user', name);
      localStorage.setItem('focusquest_active_user', name);
      setLocation('/setup');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNewLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <AnimatedBackground />

      {/* Floating decorations */}
      {['🏴‍☠️', '⚓', '💎', '🗺️', '⚔️', '🌊', '🔮', '🪙', '🌟', '🚀'].map((emoji, i) => (
        <motion.div
          key={i}
          className="fixed text-3xl pointer-events-none z-0 select-none"
          style={{ left: `${(i * 9 + 5) % 90}%`, top: `${15 + (i * 7) % 70}%` }}
          animate={{ y: [0, -18, 0], rotate: [0, 10, -10, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3 + (i % 3), delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full border border-white/40 text-white font-bold text-sm mb-4"
          >
            <Gamepad2 className="w-4 h-4" /> Gamified Learning Platform
          </motion.div>
          <div className="flex flex-col items-center">
            <MascotLogo className="w-24 h-24 mb-6 shadow-2xl scale-125" />
            <h1
              className="text-6xl font-bold text-white mb-2"
              style={{ textShadow: '0 0 40px rgba(46,196,255,0.6), 0 4px 0 rgba(0,0,0,0.3)', fontFamily: "'Fredoka', sans-serif" }}
            >
              Focus<span className="text-yellow-300">Quest</span>
            </h1>
          </div>
          <p className="text-white/80 font-bold text-lg">Who's playing today?</p>
        </div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-2xl"
        >
          {/* Name input */}
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-bold mb-2">Enter your hero name</label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputName}
                onChange={e => { setInputName(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Captain Alex"
                className="flex-1 bg-white/20 border-2 border-white/30 focus:border-white/70 text-white placeholder-white/40 rounded-xl px-4 py-3 font-bold text-base outline-none transition-all"
              />
              <motion.button
                onClick={handleNewLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black rounded-xl px-5 py-3 flex items-center gap-2 transition-colors shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                Go!
              </motion.button>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-300 text-sm font-bold mt-2"
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-white/50 text-xs mt-2 font-bold">
              New name = new adventure · Existing name = continue your journey
            </p>
          </div>

          {/* Existing users */}
          {existingProfiles.length > 0 && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-white/60 text-xs font-bold flex items-center gap-1"><Users className="w-3 h-3" /> Returning Heroes</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {existingProfiles.map(p => (
                  <UserCard key={p.userName} profile={p} onClick={() => handleLoginExisting(p)} />
                ))}
              </div>
            </>
          )}

          {existingProfiles.length === 0 && (
            <div className="flex items-center justify-center gap-2 mt-2 text-white/50 text-sm font-bold">
              <UserPlus className="w-4 h-4" />
              <span>No heroes yet — be the first!</span>
            </div>
          )}
        </motion.div>

        {/* Mascot bubble */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex items-center gap-3"
        >
          <MascotLogo className="w-14 h-14" />
          <div className="bg-white/15 backdrop-blur border border-white/30 text-white px-4 py-2.5 rounded-2xl rounded-tl-none text-sm font-bold shadow-lg">
            Hello Explorer! Type your name to start your quest! 🗺️
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
