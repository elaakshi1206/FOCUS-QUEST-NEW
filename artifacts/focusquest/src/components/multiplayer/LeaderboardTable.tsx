import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star, TrendingUp, Crown } from "lucide-react";

export interface LeaderboardUser {
  id: number;
  name: string;
  focusScore: number;
  totalXp: number;
  currentStreak: number;
  improvementRate: number;
  leaderboardScore: number;
  difficultyLevel?: string;
}

export interface LeaderboardTeamEntry {
  id: number;
  name: string;
  avatar?: string;
  totalXp: number;
  focusStreak: number;
  leaderboardScore: number;
}

type Entry = (LeaderboardUser | LeaderboardTeamEntry) & { rank?: number };

interface LeaderboardTableProps {
  entries: Entry[];
  type: "users" | "teams";
  currentUserId?: number;
}

const rankBadges = ["🥇", "🥈", "🥉"];

function isUser(e: Entry): e is LeaderboardUser & { rank?: number } {
  return "focusScore" in e;
}

export function LeaderboardTable({ entries, type, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {entries.map((entry, i) => {
          const rank = (entry.rank ?? i) + 1;
          const isMe = isUser(entry) && entry.id === currentUserId;
          const isTop3 = rank <= 3;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
              className={`relative overflow-hidden rounded-2xl flex items-center gap-3 px-4 py-3 border transition-all
                ${isMe ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/10" :
                  isTop3 ? "bg-card/80 border-white/15" : "bg-card/40 border-white/8"}`}
            >
              {/* Glow for top 3 */}
              {isTop3 && <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none" />}

              {/* Rank */}
              <div className={`w-9 text-center flex-shrink-0 font-display font-bold
                ${isTop3 ? "text-2xl" : "text-base text-muted-foreground"}`}>
                {isTop3 ? rankBadges[rank - 1] : rank}
              </div>

              {/* Avatar / Emoji */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg
                ${isMe ? "bg-primary/30" : "bg-white/8"}`}>
                {type === "teams" && !isUser(entry)
                  ? ((entry as LeaderboardTeamEntry).avatar || "🛡️")
                  : (isUser(entry) ? entry.name.charAt(0).toUpperCase() : "?")}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                  {entry.name}
                  {isMe && <span className="ml-2 text-[10px] bg-primary/20 text-primary rounded-full px-2 py-0.5 font-normal">You</span>}
                </p>
                {type === "users" && isUser(entry) && (
                  <p className="text-[10px] text-muted-foreground">{entry.difficultyLevel}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs flex-shrink-0">
                {type === "users" && isUser(entry) ? (
                  <>
                    <div className="hidden sm:flex items-center gap-0.5 text-accent">
                      <Flame size={11} /> {entry.currentStreak}d
                    </div>
                    <div className="hidden sm:flex items-center gap-0.5 text-green-400">
                      <TrendingUp size={11} /> +{entry.improvementRate}%
                    </div>
                    <div className="flex items-center gap-0.5 text-secondary font-bold">
                      <Star size={11} /> {entry.totalXp.toLocaleString()}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="hidden sm:flex items-center gap-0.5 text-accent">
                      <Flame size={11} /> {(entry as LeaderboardTeamEntry).focusStreak}d
                    </div>
                    <div className="flex items-center gap-0.5 text-secondary font-bold">
                      <Star size={11} /> {(entry as LeaderboardTeamEntry).totalXp.toLocaleString()}
                    </div>
                  </>
                )}

                {/* Score */}
                {rank === 1 && (
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-secondary"
                  >
                    <Crown size={16} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
