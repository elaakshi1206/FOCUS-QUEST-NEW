import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/store';
import { CHARACTERS, EQUIPMENT } from '@/lib/data';
import { TopHUD } from '@/components/TopHUD';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Lock, UserCheck, Shirt, Rocket, Gem } from 'lucide-react';
import confetti from 'canvas-confetti';

type Tab = 'characters' | 'outfit' | 'vehicle' | 'accessory';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'characters', label: 'Heroes', icon: <UserCheck className="w-4 h-4" /> },
  { id: 'outfit', label: 'Outfits', icon: <Shirt className="w-4 h-4" /> },
  { id: 'vehicle', label: 'Vehicles', icon: <Rocket className="w-4 h-4" /> },
  { id: 'accessory', label: 'Accessories', icon: <Gem className="w-4 h-4" /> },
];

export function Customize() {
  const { xp, avatarId, setAvatar, theme, equipment, setEquipment } = useGame();
  const [tab, setTab] = useState<Tab>('characters');
  
  const handleSelectChar = (id: string, reqXp: number) => {
    if (xp >= reqXp) {
      setAvatar(id);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    }
  };

  const handleSelectEquip = (id: string, reqXp: number, category: string) => {
    if (xp >= reqXp) {
      setEquipment({ [category]: id });
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
    }
  };

  const themeEquipment = EQUIPMENT.filter(e => e.theme === theme);

  return (
    <div className="min-h-screen relative">
      <TopHUD />
      <AnimatedBackground />

      <div className="pt-28 pb-12 px-4 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-white drop-shadow-md mb-3">Customize Your Hero</h1>
          <p className="text-white/80 font-bold text-lg">Unlock items by earning XP through quests!</p>
        </div>

        {/* Current Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl mb-8 flex flex-col sm:flex-row items-center gap-6 max-w-xl mx-auto">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/30 shrink-0">
            <img src={`${import.meta.env.BASE_URL}${(CHARACTERS.find(c => c.id === avatarId) || CHARACTERS[0]).imagePath.replace(/^\//, '')}`}
              alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="font-display font-bold text-xl text-card-foreground">{CHARACTERS.find(c => c.id === avatarId)?.name}</h3>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              {(['outfit', 'vehicle', 'accessory'] as const).map(cat => {
                const item = EQUIPMENT.find(e => e.id === (equipment as any)[cat]);
                return item ? (
                  <span key={cat} className="bg-primary/10 border border-primary/30 text-sm font-bold px-3 py-1 rounded-full">
                    {item.emoji} {item.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${tab === t.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Characters grid */}
        {tab === 'characters' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {CHARACTERS.filter(c => c.theme === theme).map((char, i) => {
              const isUnlocked = xp >= char.requiredXp;
              const isSelected = avatarId === char.id;
              return (
                <motion.div key={char.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                  onClick={() => handleSelectChar(char.id, char.requiredXp)}
                  className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-primary scale-105 shadow-[0_0_30px_rgba(46,196,255,0.6)]' : isUnlocked ? 'hover:scale-105 hover:ring-2 ring-white/50' : 'opacity-75 grayscale-[0.8]'}`}>
                  <div className="aspect-[3/4] relative">
                    <img src={`${import.meta.env.BASE_URL}${char.imagePath.replace(/^\//, '')}`} alt={char.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                      <h3 className="text-white font-display font-bold text-sm leading-tight">{char.name}</h3>
                      {!isUnlocked && <p className="text-primary font-bold text-xs mt-1 flex items-center gap-1"><Lock className="w-3 h-3" /> {char.requiredXp} XP</p>}
                    </div>
                    {isSelected && <div className="absolute top-2 right-2 bg-primary text-white p-1.5 rounded-full shadow-lg"><UserCheck className="w-4 h-4" /></div>}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-black/80 p-3 rounded-full"><Lock className="w-8 h-8 text-white" /></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Equipment grids */}
        {tab !== 'characters' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {themeEquipment.filter(e => e.category === tab).map((item, i) => {
              const isUnlocked = xp >= item.requiredXp;
              const isSelected = (equipment as any)[tab] === item.id;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelectEquip(item.id, item.requiredXp, item.category)}
                  className={`glass-panel p-6 rounded-3xl text-center cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-primary scale-105 shadow-[0_0_20px_rgba(46,196,255,0.5)]' : isUnlocked ? 'hover:scale-105' : 'opacity-60 grayscale'}`}>
                  <div className="text-5xl mb-3">{item.emoji}</div>
                  <h3 className="font-display font-bold text-sm text-card-foreground">{item.name}</h3>
                  {!isUnlocked ? (
                    <p className="text-xs font-bold text-muted-foreground mt-2 flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> {item.requiredXp} XP</p>
                  ) : isSelected ? (
                    <p className="text-xs font-bold text-primary mt-2">✓ Equipped</p>
                  ) : (
                    <p className="text-xs font-bold text-muted-foreground mt-2">Tap to equip</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
