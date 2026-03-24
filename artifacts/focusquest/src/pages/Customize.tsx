import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/store';
import { CHARACTERS } from '@/lib/data';
import { TopHUD } from '@/components/TopHUD';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Lock, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Customize() {
  const { xp, avatarId, setAvatar } = useGame();
  
  const handleSelect = (id: string, reqXp: number) => {
    if (xp >= reqXp) {
      setAvatar(id);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    }
  };

  return (
    <div className="min-h-screen relative">
      <TopHUD />
      <AnimatedBackground />

      <div className="pt-28 pb-12 px-4 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-display font-bold text-white drop-shadow-md mb-4">Choose Your Hero</h1>
          <p className="text-white/80 font-bold text-xl">Unlock new characters by completing quests and earning XP!</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {CHARACTERS.map((char, i) => {
            const isUnlocked = xp >= char.requiredXp;
            const isSelected = avatarId === char.id;

            return (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(char.id, char.requiredXp)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform ${
                  isSelected ? 'ring-4 ring-primary scale-105 shadow-[0_0_30px_rgba(46,196,255,0.6)]' : 
                  isUnlocked ? 'hover:scale-105 hover:ring-2 ring-white/50' : 'opacity-75 grayscale-[0.8]'
                }`}
              >
                <div className="aspect-[3/4] relative">
                  <img 
                    src={`${import.meta.env.BASE_URL}${char.imagePath.replace(/^\//, '')}`} 
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-display font-bold text-sm leading-tight">{char.name}</h3>
                    {!isUnlocked && (
                      <p className="text-primary font-bold text-xs mt-1 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {char.requiredXp} XP
                      </p>
                    )}
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-white p-1.5 rounded-full shadow-lg">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-black/80 p-3 rounded-full">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
