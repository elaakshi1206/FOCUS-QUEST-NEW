import { motion } from "framer-motion";
import { TrendingUp, Zap, BookOpen, Star } from "lucide-react";

export interface MatchedPlayerData {
  user: {
    id: number;
    name: string;
    focusScore: number;
    totalXp: number;
    difficultyLevel: string;
    learningTopics: string[];
    currentStreak: number;
    improvementRate: number;
  };
  matchScore: number;
  reason: string;
}

interface PlayerMatchCardProps {
  match: MatchedPlayerData;
  index: number;
  onInvite?: (userId: number) => void;
}

const levelColors: Record<string, string> = {
  Beginner: "text-green-400 bg-green-400/10 border-green-400/20",
  Intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Advanced: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export function PlayerMatchCard({ match, index, onInvite }: PlayerMatchCardProps) {
  const { user, matchScore, reason } = match;
  const scoreColor = matchScore >= 80 ? "text-green-400" : matchScore >= 60 ? "text-yellow-400" : "text-muted-foreground";
  const scoreGlow = matchScore >= 80 ? "shadow-green-500/20" : matchScore >= 60 ? "shadow-yellow-500/20" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl p-4 shadow-xl ${scoreGlow}`}
    >
      {/* Match score badge */}
      <div className="absolute top-3 right-3 flex flex-col items-center">
        <div className={`text-2xl font-display font-bold ${scoreColor}`}>{matchScore}</div>
        <div className="text-[9px] text-muted-foreground uppercase tracking-widest">Match</div>
      </div>

      {/* Score arc indicator */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{ background: matchScore >= 80 ? "#4ade80" : matchScore >= 60 ? "#facc15" : "#94a3b8" }}
      />

      <div className="flex items-center gap-3 mb-3 pr-14">
        {/* Avatar placeholder */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-foreground text-base leading-tight">{user.name}</p>
          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${levelColors[user.difficultyLevel] || levelColors.Beginner}`}>
            {user.difficultyLevel}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { icon: <Zap size={11} />, label: "Focus", value: `${user.focusScore}` },
          { icon: <Star size={11} />, label: "XP", value: user.totalXp.toLocaleString() },
          { icon: <TrendingUp size={11} />, label: "Growth", value: `+${user.improvementRate}%` },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center bg-white/5 rounded-xl p-2">
            <span className="text-primary mb-0.5">{stat.icon}</span>
            <span className="text-xs font-bold text-foreground">{stat.value}</span>
            <span className="text-[9px] text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Topics */}
      {user.learningTopics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {user.learningTopics.slice(0, 3).map((topic) => (
            <span key={topic} className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 flex items-center gap-0.5">
              <BookOpen size={8} /> {topic}
            </span>
          ))}
        </div>
      )}

      {/* Reason */}
      <p className="text-[11px] text-muted-foreground italic mb-3 line-clamp-1">✨ {reason}</p>

      {/* Invite button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onInvite?.(user.id)}
        className="w-full game-button game-button-primary py-2 text-sm"
      >
        Invite to Team
      </motion.button>
    </motion.div>
  );
}
