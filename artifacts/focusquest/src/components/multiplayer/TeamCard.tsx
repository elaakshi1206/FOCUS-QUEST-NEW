import { motion } from "framer-motion";
import { Flame, Star, Users, Shield } from "lucide-react";

export interface TeamCardData {
  id: number;
  teamId: string;
  name: string;
  avatar?: string;
  totalXp: number;
  focusStreak: number;
  memberCount?: number;
  leaderboardScore?: number;
  rank?: number;
}

interface TeamCardProps {
  team: TeamCardData;
  onClick?: () => void;
  compact?: boolean;
}

export function TeamCard({ team, onClick, compact = false }: TeamCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all
        bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-lg
        border border-white/10 shadow-xl hover:shadow-primary/20 hover:border-primary/30
        ${compact ? "p-3" : "p-5"}`}
    >
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />

      {team.rank && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-secondary/20 border border-secondary/30 rounded-full px-2 py-0.5 text-xs font-bold text-secondary">
          <Star size={10} />
          #{team.rank}
        </div>
      )}

      <div className={`flex items-center gap-3 ${compact ? "" : "mb-4"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10
          ${compact ? "w-10 h-10 text-xl" : "w-14 h-14 text-3xl"}`}>
          {team.avatar || "🛡️"}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`font-display font-bold text-foreground truncate ${compact ? "text-sm" : "text-lg"}`}>
            {team.name}
          </h3>
          {!compact && (
            <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
              <Users size={11} />
              {team.memberCount ?? 0} members
            </p>
          )}
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5">
            <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Star size={14} className="text-secondary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Team XP</p>
              <p className="text-sm font-bold text-foreground">{team.totalXp.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
              <Flame size={14} className="text-accent" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak</p>
              <p className="text-sm font-bold text-foreground">{team.focusStreak} days</p>
            </div>
          </div>
        </div>
      )}

      {compact && (
        <div className="flex items-center gap-3 mt-1 ml-[52px]">
          <span className="text-xs text-secondary font-semibold flex items-center gap-0.5">
            <Star size={10} /> {team.totalXp.toLocaleString()} XP
          </span>
          <span className="text-xs text-accent font-semibold flex items-center gap-0.5">
            <Flame size={10} /> {team.focusStreak}
          </span>
        </div>
      )}
    </motion.div>
  );
}
