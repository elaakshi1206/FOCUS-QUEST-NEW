import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/store';
import { QUESTS, SUBJECTS } from '@/lib/data';
import { TopHUD } from '@/components/TopHUD';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ChevronLeft, Clock, Star, Lock } from 'lucide-react';

export function QuestList() {
  const [, params] = useRoute('/quests/:subjectId');
  const subjectId = params?.subjectId;
  const { xp, completedQuests } = useGame();
  
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const subjectQuests = QUESTS.filter(q => q.subjectId === subjectId);

  if (!subject) return <div>Subject not found</div>;

  return (
    <div className="min-h-screen relative">
      <TopHUD />
      <AnimatedBackground />

      <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto relative z-10">
        <Link href="/map" className="inline-flex items-center gap-2 text-white font-bold bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full mb-6 transition-colors backdrop-blur">
          <ChevronLeft className="w-5 h-5" /> Back to Map
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-4xl shadow-lg border-2 border-white/20`}>
            {subject.icon}
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-white drop-shadow-md">{subject.title} Quests</h1>
            <p className="text-white/80 font-bold">{subject.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectQuests.map((quest, i) => {
            const isLocked = xp < quest.requiredXp;
            const isCompleted = completedQuests.includes(quest.id);

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {isLocked ? (
                  <div className="glass-panel p-6 rounded-2xl opacity-70 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                      <Lock className="w-8 h-8 mb-2 text-white" />
                      <span className="font-bold text-white bg-black/50 px-3 py-1 rounded-full">Requires {quest.requiredXp} XP</span>
                    </div>
                    <QuestCardContent quest={quest} isCompleted={isCompleted} />
                  </div>
                ) : (
                  <Link href={`/quest/${subject.id}/${quest.id}`} className="block transform transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    <div className={`glass-panel p-6 rounded-2xl border-2 ${isCompleted ? 'border-primary' : 'border-transparent hover:border-white/50'} relative overflow-hidden`}>
                      {isCompleted && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
                          Completed
                        </div>
                      )}
                      <QuestCardContent quest={quest} isCompleted={isCompleted} />
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuestCardContent({ quest, isCompleted }: { quest: any, isCompleted: boolean }) {
  return (
    <>
      <h3 className="text-xl font-display font-bold text-card-foreground mb-2">{quest.title}</h3>
      <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground mb-4">
        <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {quest.timeMins} min</div>
        <div className="flex">
          {[...Array(3)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < quest.difficulty ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-primary font-bold text-lg">+{quest.xpReward} XP</span>
        <div className={`game-button px-4 py-2 text-sm ${isCompleted ? 'bg-muted text-muted-foreground' : 'game-button-primary'}`}>
          {isCompleted ? 'Replay' : 'Start Quest'}
        </div>
      </div>
    </>
  );
}
