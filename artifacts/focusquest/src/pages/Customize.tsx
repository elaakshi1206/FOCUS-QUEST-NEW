import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/store';
import { CHARACTERS, EQUIPMENT, SUBJECTS, SUBJECTS_BASE, SUBJECTS_MIDDLE, SUBJECTS_HIGH, QUESTS } from '@/lib/data';
import { TopHUD } from '@/components/TopHUD';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Lock, UserCheck, Shirt, Rocket, Gem, TrendingUp, TrendingDown, Award, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

type Tab = 'characters' | 'outfit' | 'vehicle' | 'accessory';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'characters', label: 'Heroes', icon: <UserCheck className="w-4 h-4" /> },
  { id: 'outfit', label: 'Outfits', icon: <Shirt className="w-4 h-4" /> },
  { id: 'vehicle', label: 'Vehicles', icon: <Rocket className="w-4 h-4" /> },
  { id: 'accessory', label: 'Accessories', icon: <Gem className="w-4 h-4" /> },
];

const WORLD_TABS = [
  { id: 'ocean', label: 'Ocean World', emoji: '🌊', bg: 'from-blue-500 to-cyan-500' },
  { id: 'space', label: 'Space World', emoji: '🚀', bg: 'from-indigo-600 to-purple-600' },
  { id: 'future', label: 'Future World', emoji: '⚡', bg: 'from-emerald-500 to-teal-500' },
];

export function Customize() {
  const { xp, avatarId, setAvatar, theme, equipment, setEquipment, focusHistory, completedQuests } = useGame();
  const [mainTab, setMainTab] = useState<'progress' | 'customize'>('customize');
  const [selectedWorld, setSelectedWorld] = useState<'ocean' | 'space' | 'future'>(theme);
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

  const themeEquipment = EQUIPMENT.filter(e => e.theme === selectedWorld);

  // Compute analytics for Progress tab
  const getSubjectsForWorld = (w: string) => {
    if (w === 'ocean') return SUBJECTS_BASE;
    if (w === 'space') return SUBJECTS_MIDDLE;
    if (w === 'future') return SUBJECTS_HIGH;
    return SUBJECTS_BASE;
  };
  
  const worldSubjects = getSubjectsForWorld(selectedWorld);
  const worldSubjectIds = worldSubjects.map(s => s.id);
  
  // Real time progress: quizzes solved in this world
  const worldQuests = QUESTS.filter(q => worldSubjectIds.includes(q.subjectId));
  const solvedWorldQuests = worldQuests.filter(q => completedQuests.includes(q.id));
  const quizzesProgressDisplay = `${solvedWorldQuests.length} / ${worldQuests.length}`;

  const sortedHistory = [...focusHistory].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstFocus = sortedHistory.length > 0 ? sortedHistory[0].score : 70;
  const lastFocus = sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].score : 85;
  const focusIncrease = sortedHistory.length > 1 ? lastFocus - firstFocus : 15;
  const focusIncreaseDisplay = focusHistory.length > 1 ? (focusIncrease > 0 ? `+${focusIncrease}%` : `${focusIncrease}%`) : '+24%';
  const distractionReducedDisplay = focusHistory.length > 1 ? `-${Math.abs(focusIncrease > 0 ? focusIncrease + 10 : 35)}%` : '-35%';

  const subjectScores: Record<string, { total: number; count: number }> = {};
  focusHistory.forEach(h => {
    if (!subjectScores[h.subjectId]) subjectScores[h.subjectId] = { total: 0, count: 0 };
    subjectScores[h.subjectId].total += h.score;
    subjectScores[h.subjectId].count += 1;
  });
  let bestSubjectId = '';
  let highestAvg = -1;
  Object.entries(subjectScores).forEach(([id, data]) => {
    const avg = data.total / data.count;
    if (avg > highestAvg) {
      highestAvg = avg;
      bestSubjectId = id;
    }
  });
  const bestSubjectName = SUBJECTS.find(s => s.id === bestSubjectId)?.title || 'Science';

  return (
    <div className="min-h-screen relative">
      <TopHUD />
      <AnimatedBackground />

      <div className="pt-28 pb-12 px-4 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-white drop-shadow-md mb-3">Hero Profile</h1>
          <p className="text-white/80 font-bold text-lg">Track your progress and gear up!</p>
        </div>

        {/* Big Main Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          <button onClick={() => setMainTab('progress')}
            className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl flex flex-col items-center justify-center gap-2 sm:gap-4 font-display font-bold transition-all duration-300 ${mainTab === 'progress' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110 shadow-[0_0_30px_rgba(59,130,246,0.6)] ring-4 ring-white z-10' : 'bg-black/30 backdrop-blur-md border border-white/10 text-white/60 hover:bg-white/10 hover:scale-105'}`}>
            <TrendingUp className="w-10 h-10 sm:w-14 sm:h-14" />
            <span className="text-base sm:text-lg">Progress</span>
          </button>
          <button onClick={() => setMainTab('customize')}
            className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl flex flex-col items-center justify-center gap-2 sm:gap-4 font-display font-bold transition-all duration-300 ${mainTab === 'customize' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white scale-110 shadow-[0_0_30px_rgba(16,185,129,0.6)] ring-4 ring-white z-10' : 'bg-black/30 backdrop-blur-md border border-white/10 text-white/60 hover:bg-white/10 hover:scale-105'}`}>
            <UserCheck className="w-10 h-10 sm:w-14 sm:h-14" />
            <span className="text-base sm:text-lg text-center leading-tight">Customize<br/>Your Hero</span>
          </button>
        </div>

        {/* World Theme Square Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {WORLD_TABS.map(w => (
            <button key={w.id} onClick={() => setSelectedWorld(w.id as any)}
              className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex flex-col items-center justify-center gap-2 font-display font-bold transition-all duration-300 ${selectedWorld === w.id ? `bg-gradient-to-br ${w.bg} text-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)] ring-4 ring-white z-10` : 'bg-black/20 backdrop-blur-md border border-white/10 text-white/60 hover:bg-white/10 hover:scale-105'}`}>
              <span className="text-3xl sm:text-4xl drop-shadow-md">{w.emoji}</span>
              <span className="text-[10px] sm:text-xs tracking-wide">{w.label}</span>
            </button>
          ))}
        </div>

        {mainTab === 'progress' ? (
          /* Progress Content */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mt-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="bg-primary/20 p-4 rounded-full mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-display font-bold text-card-foreground mb-1">Quizzes Solved</h3>
              <p className="text-4xl font-black text-primary mb-2">{quizzesProgressDisplay}</p>
              <p className="text-sm text-muted-foreground font-bold">In {WORLD_TABS.find(w => w.id === selectedWorld)?.label}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="bg-primary/20 p-4 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-display font-bold text-card-foreground mb-1">Focus Increased</h3>
              <p className="text-4xl font-black text-primary mb-2">{focusIncreaseDisplay}</p>
              <p className="text-sm text-muted-foreground font-bold">Over recent sessions</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="bg-yellow-500/20 p-4 rounded-full mb-4">
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-lg font-display font-bold text-card-foreground mb-1">Best Subject</h3>
              <p className="text-4xl font-black text-yellow-500 mb-2">{bestSubjectName}</p>
              <p className="text-sm text-muted-foreground font-bold">{highestAvg > 0 ? `${Math.round(highestAvg)}% Accuracy` : 'Keep playing!'}</p>
            </motion.div>
          </div>
        ) : (
          /* Customize Content */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            {/* Current Preview */}
            <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col sm:flex-row items-center gap-6 max-w-xl mx-auto">
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
            </div>

            {/* Sub-Tabs */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${tab === t.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            {tab === 'characters' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {CHARACTERS.filter(c => c.theme === selectedWorld).map((char, i) => {
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
