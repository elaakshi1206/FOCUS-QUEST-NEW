import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { useGame } from '@/lib/store';
import { SUBJECTS } from '@/lib/data';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { TopHUD } from '@/components/TopHUD';
import { Mascot } from '@/components/Mascot';
import { Bell } from 'lucide-react';
import { useState } from 'react';

const islandPositions = [
  { top: '18%', left: '18%', size: 'w-28 h-28', glow: 'shadow-blue-400/60' },
  { top: '22%', left: '65%', size: 'w-32 h-32', glow: 'shadow-green-400/60' },
  { top: '55%', left: '25%', size: 'w-28 h-28', glow: 'shadow-purple-400/60' },
  { top: '68%', left: '68%', size: 'w-28 h-28', glow: 'shadow-orange-400/60' },
  { top: '42%', left: '48%', size: 'w-32 h-32', glow: 'shadow-pink-400/60' },
];

const pathData = "M 18% 18% Q 42% 15% 65% 22% T 48% 42% T 25% 55% T 68% 68%";

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const notifications = [
    { icon: '🔥', text: "Don't break your 3-day streak!", type: 'warning' },
    { icon: '⭐', text: 'New quest unlocked: Geometry Shapes!', type: 'success' },
    { icon: '🎯', text: 'Daily Quest: Complete 1 Math quest', type: 'info' },
    { icon: '🏆', text: 'Only 350 XP to unlock Navigator Boy!', type: 'info' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute top-16 right-0 w-80 glass-panel rounded-2xl p-4 z-50 border border-white/20 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display font-bold text-lg">Notifications</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">×</button>
      </div>
      <div className="space-y-2">
        {notifications.map((n, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${n.type === 'warning' ? 'bg-orange-500/10 border border-orange-500/30' : n.type === 'success' ? 'bg-green-500/10 border border-green-500/30' : 'bg-primary/10 border border-primary/30'}`}>
            <span className="text-xl">{n.icon}</span>
            <p className="text-sm font-bold">{n.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function Map() {
  const { theme, xp, streak, userName } = useGame();
  const [, setLocation] = useLocation();
  const [showNotif, setShowNotif] = useState(false);

  const mascotMsg = theme === 'ocean'
    ? `⚓ Welcome back${userName ? `, ${userName}` : ''}! Click an island to begin your quest!`
    : theme === 'space'
    ? `🚀 Mission Control ready${userName ? `, ${userName}` : ''}! Choose a planet to explore!`
    : `🤖 System online${userName ? `, ${userName}` : ''}! Select a zone to initialize quest!`;

  const mapLabel = theme === 'ocean' ? '🗺️ Treasure Seas Map' : theme === 'space' ? '🌌 Galaxy Map' : '⚡ Cyber Grid Map';

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TopHUD />
      <AnimatedBackground />
      <Mascot message={mascotMsg} delay={800} />

      {/* Map area */}
      <div className="absolute inset-0 pt-20 pb-4 px-4 flex flex-col items-center overflow-hidden">
        {/* Map title + notification */}
        <div className="relative flex items-center justify-between w-full max-w-4xl mb-4 mt-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel px-5 py-2.5 rounded-2xl font-display font-bold text-lg"
          >
            {mapLabel}
          </motion.div>

          <div className="relative">
            <motion.button
              onClick={() => setShowNotif(!showNotif)}
              whileTap={{ scale: 0.9 }}
              className="glass-panel p-3 rounded-2xl border border-white/20 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">4</span>
            </motion.button>
            {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
          </div>
        </div>

        {/* Map canvas */}
        <div className="relative w-full max-w-4xl flex-1 min-h-[500px]">
          {/* Path lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" style={{ zIndex: 0 }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Connecting dotted paths */}
            <path 
              d="M 18,18 Q 40,20 65,22" 
              fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 6" 
              filter="url(#glow)"
              vectorEffect="non-scaling-stroke"
            />
            <path 
              d="M 65,22 Q 60,32 50,42" 
              fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 6"
              filter="url(#glow)"
              vectorEffect="non-scaling-stroke"
            />
            <path 
              d="M 50,42 Q 35,48 25,55" 
              fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 6"
              filter="url(#glow)"
              vectorEffect="non-scaling-stroke"
            />
            <path 
              d="M 50,42 Q 60,55 68,68" 
              fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 6"
              filter="url(#glow)"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Subject nodes */}
          {SUBJECTS.map((subject, i) => {
            const pos = islandPositions[i % islandPositions.length];
            return (
              <Link
                key={subject.id}
                href={`/quests/${subject.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                style={{ top: pos.top, left: pos.left }}
              >
                <motion.div
                  whileHover={{ scale: 1.12, y: -5 }}
                  whileTap={{ scale: 0.93 }}
                  initial={{ y: 30, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
                  className="relative flex flex-col items-center cursor-pointer"
                >
                  {/* Glow ring */}
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${subject.color} scale-125`} />
                  
                  {/* Island node */}
                  <div 
                    className={`${pos.size} rounded-full bg-gradient-to-br ${subject.color} shadow-2xl ${pos.glow} flex items-center justify-center border-4 border-white/60 relative overflow-hidden animate-float map-node-active`}
                    style={{ animationDelay: `${i * 0.6}s`, boxShadow: `0 0 30px 5px rgba(255,255,255,0.15)` }}
                  >
                    <span className="text-4xl sm:text-5xl relative z-10 drop-shadow-lg">{subject.icon}</span>
                    {/* Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Label */}
                  <motion.div 
                    className="mt-3 bg-card/90 backdrop-blur px-4 py-2 rounded-2xl shadow-xl border border-white/30 text-center"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12 + 0.2 }}
                  >
                    <span className="font-display font-bold text-card-foreground whitespace-nowrap text-sm sm:text-base">{subject.title}</span>
                  </motion.div>

                  {/* XP badge */}
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-display font-bold px-2 py-0.5 rounded-full shadow-lg border border-yellow-300">
                    +XP
                  </div>
                </motion.div>
              </Link>
            );
          })}

          {/* Floating theme decorations */}
          {theme === 'ocean' && (
            <>
              <motion.div className="absolute bottom-10 left-5 text-3xl opacity-60 pointer-events-none" animate={{ y: [0,-8,0], rotate: [0,5,-5,0] }} transition={{ repeat: Infinity, duration: 3 }}>🐚</motion.div>
              <motion.div className="absolute top-5 right-10 text-3xl opacity-60 pointer-events-none" animate={{ y: [0,-10,0] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }}>⚓</motion.div>
              <motion.div className="absolute bottom-20 right-5 text-3xl opacity-60 pointer-events-none" animate={{ y: [0,-6,0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}>🦀</motion.div>
              <motion.div className="absolute top-20 left-5 text-3xl opacity-60 pointer-events-none" animate={{ y: [0,-12,0] }} transition={{ repeat: Infinity, duration: 3.5 }}>🌊</motion.div>
            </>
          )}
          {theme === 'space' && (
            <>
              <motion.div className="absolute bottom-10 left-5 text-3xl opacity-60 pointer-events-none" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}>🪐</motion.div>
              <motion.div className="absolute top-5 right-10 text-3xl opacity-60 pointer-events-none" animate={{ y: [0,-15,0] }} transition={{ repeat: Infinity, duration: 5 }}>☄️</motion.div>
              <motion.div className="absolute bottom-20 right-5 text-3xl opacity-60 pointer-events-none" animate={{ rotate: [-5,5,-5] }} transition={{ repeat: Infinity, duration: 2 }}>🛸</motion.div>
            </>
          )}
          {theme === 'future' && (
            <>
              <motion.div className="absolute bottom-10 left-5 text-3xl opacity-60 pointer-events-none" animate={{ scale: [1,1.2,1] }} transition={{ repeat: Infinity, duration: 2 }}>⚡</motion.div>
              <motion.div className="absolute top-5 right-10 text-3xl opacity-60 pointer-events-none" animate={{ rotate: [0,360] }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}>🔬</motion.div>
              <motion.div className="absolute bottom-20 right-5 text-3xl opacity-60 pointer-events-none" animate={{ scale: [1,1.3,1] }} transition={{ repeat: Infinity, duration: 1.5 }}>💡</motion.div>
            </>
          )}
        </div>

        {/* Quick actions bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 mt-4 pb-2"
        >
          <button
            onClick={() => setLocation('/customize')}
            className="game-button bg-white/15 backdrop-blur text-white border border-white/30 px-4 py-2 text-sm flex items-center gap-2"
          >
            🧑‍🎨 Characters
          </button>
          <button
            onClick={() => setLocation('/analytics')}
            className="game-button bg-white/15 backdrop-blur text-white border border-white/30 px-4 py-2 text-sm flex items-center gap-2"
          >
            📊 Analytics
          </button>
          <div className="glass-panel px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2">
            🔥 {streak} day streak
          </div>
        </motion.div>
      </div>
    </div>
  );
}
