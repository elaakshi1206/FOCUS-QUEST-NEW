import { motion } from "framer-motion";
import { Clock, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export interface QuestData {
  id: number;
  title: string;
  description: string;
  objectiveType: string;
  targetValue: number;
  currentValue: number;
  rewardXp: number;
  expiresAt: string;
}

interface QuestProgressBarProps {
  quest: QuestData;
  index?: number;
}

function useCountdown(expiresAt: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Expired"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(h > 0 ? `${h}h ${m}m` : `${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return timeLeft;
}

const questIcons: Record<string, string> = {
  lessons: "📚",
  streak: "🔥",
  xp: "⭐",
  help: "🤝",
};

export function QuestProgressBar({ quest, index = 0 }: QuestProgressBarProps) {
  const pct = Math.min(100, Math.round((quest.currentValue / quest.targetValue) * 100));
  const timeLeft = useCountdown(quest.expiresAt);
  const isComplete = pct >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all
        ${isComplete
          ? "bg-secondary/10 border-secondary/30 shadow-secondary/10 shadow-lg"
          : "bg-card/60 border-white/10"
        }`}
    >
      {isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-7 h-7 bg-secondary rounded-full flex items-center justify-center text-sm"
        >
          ✓
        </motion.div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
          {questIcons[quest.objectiveType] || "🎯"}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-foreground text-sm leading-tight">{quest.title}</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{quest.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 + 0.3 }}
          className={`absolute inset-y-0 left-0 rounded-full xp-bar-shine
            ${isComplete
              ? "bg-gradient-to-r from-secondary to-secondary/80"
              : "bg-gradient-to-r from-primary to-accent"
            }`}
        />
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">
          {quest.currentValue} / {quest.targetValue}
          &nbsp;
          <span className="text-foreground font-semibold">({pct}%)</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-0.5 text-secondary font-bold">
            <Trophy size={10} /> +{quest.rewardXp} XP
          </span>
          <span className="flex items-center gap-0.5 text-muted-foreground">
            <Clock size={9} /> {timeLeft}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
