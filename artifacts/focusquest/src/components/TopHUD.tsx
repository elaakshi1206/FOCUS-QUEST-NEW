import { useState } from 'react';
import { useGame } from '@/lib/store';
import { CHARACTERS } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Menu, X, ChartBar, Map, Settings, User, LogOut, Radar, Trophy, Shield } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { MascotLogo } from './MascotLogo';

export function TopHUD() {
  const { userName, level, xp, streak, avatarId, logout } = useGame();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSwitchUser = () => {
    setMenuOpen(false);
    logout();
    setLocation('/');
  };
  
  const currentAvatar = CHARACTERS.find(c => c.id === avatarId) || CHARACTERS[0];
  
  // Calculate progress to next level
  let currentLevelRequired = 100;
  let totalBase = 0;
  for (let i = 1; i < level; i++) {
    totalBase += currentLevelRequired;
    currentLevelRequired += 100;
  }
  const xpIntoLevel = xp - totalBase;
  const progressPercent = Math.min(100, Math.max(0, (xpIntoLevel / currentLevelRequired) * 100));

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 pointer-events-auto">
        
        {/* Profile Info */}
        <Link href="/customize" className="flex items-center gap-3 bg-background/80 backdrop-blur-md rounded-full pr-4 p-1 shadow-lg border border-border/50 hover:scale-105 transition-transform cursor-pointer">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-muted">
            <img 
              src={`${import.meta.env.BASE_URL}${currentAvatar.imagePath.replace(/^\//, '')}`} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="hidden sm:block">
            <h3 className="font-display font-bold text-sm leading-tight">{userName || "Adventurer"}</h3>
            <p className="text-xs text-muted-foreground font-bold">Lvl {level}</p>
          </div>
        </Link>

        {/* XP Bar */}
        <div className="flex-1 max-w-xs bg-background/80 backdrop-blur-md rounded-full p-2 px-4 shadow-lg border border-border/50 hidden md:block">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-primary flex items-center"><Star className="w-3 h-3 mr-1 fill-primary" /> XP</span>
            <span>{xpIntoLevel} / {currentLevelRequired}</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <MascotLogo className="w-12 h-12" />
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border/50">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="font-display font-bold">{streak}</span>
          </div>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-12 h-12 flex items-center justify-center bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-20 right-4 w-64 bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden pointer-events-auto"
          >
            <div className="p-4 bg-primary/10 border-b border-border/50">
              <h4 className="font-display font-bold text-lg">Menu</h4>
            </div>
            <div className="p-2 flex flex-col gap-1">
              <MenuLink href="/map" icon={<Map />} label="World Map" onClick={() => setMenuOpen(false)} />
              <MenuLink href="/customize" icon={<User />} label="Crew / Avatar" onClick={() => setMenuOpen(false)} />
              <MenuLink href="/analytics" icon={<ChartBar />} label="Focus Stats" onClick={() => setMenuOpen(false)} />
              {/* ── Antigravity Social Module ── */}
              <div className="mx-3 my-1 h-px bg-border/40" />
              <p className="px-3 py-1 text-[10px] font-bold text-primary/70 uppercase tracking-widest">⚡ Antigravity</p>
              <MenuLink href="/team" icon={<Shield />} label="My Team" onClick={() => setMenuOpen(false)} />
              <MenuLink href="/matchmaking" icon={<Radar />} label="Find Study Squad" onClick={() => setMenuOpen(false)} />
              <MenuLink href="/leaderboard" icon={<Trophy />} label="Leaderboard" onClick={() => setMenuOpen(false)} />
              <div className="mx-3 my-1 h-px bg-border/40" />
              <MenuLink href="/setup" icon={<Settings />} label="Settings" onClick={() => setMenuOpen(false)} />
              <button
                onClick={handleSwitchUser}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 font-bold transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Switch User
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ href, icon, label, onClick }: { href: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-bold transition-colors">
      <div className="text-primary">{icon}</div>
      {label}
    </Link>
  );
}
