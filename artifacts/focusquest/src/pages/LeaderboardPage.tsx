import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Trophy, Users, ChevronLeft, RefreshCw, Info } from "lucide-react";
import { LeaderboardTable, type LeaderboardUser, type LeaderboardTeamEntry } from "@/components/multiplayer/LeaderboardTable";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USERS: LeaderboardUser[] = [
  { id: 1, name: "Aisha K.", focusScore: 92, totalXp: 18_500, currentStreak: 21, improvementRate: 18, leaderboardScore: 9800, difficultyLevel: "Advanced" },
  { id: 2, name: "Dev P.", focusScore: 85, totalXp: 15_200, currentStreak: 14, improvementRate: 12, leaderboardScore: 8400, difficultyLevel: "Advanced" },
  { id: 3, name: "Rohan M.", focusScore: 78, totalXp: 11_800, currentStreak: 10, improvementRate: 9, leaderboardScore: 7100, difficultyLevel: "Intermediate" },
  { id: 4, name: "Priya S.", focusScore: 71, totalXp: 9_300, currentStreak: 7, improvementRate: 6, leaderboardScore: 5900, difficultyLevel: "Intermediate" },
  { id: 5, name: "Sam Q.", focusScore: 66, totalXp: 7_600, currentStreak: 5, improvementRate: 4, leaderboardScore: 4700, difficultyLevel: "Beginner" },
  { id: 6, name: "Nina L.", focusScore: 62, totalXp: 6_100, currentStreak: 4, improvementRate: 3, leaderboardScore: 3900, difficultyLevel: "Beginner" },
  { id: 7, name: "Arjun T.", focusScore: 59, totalXp: 5_400, currentStreak: 3, improvementRate: 2, leaderboardScore: 3400, difficultyLevel: "Beginner" },
  { id: 8, name: "Maya R.", focusScore: 54, totalXp: 4_800, currentStreak: 2, improvementRate: 1, leaderboardScore: 2900, difficultyLevel: "Beginner" },
];

const MOCK_TEAMS: LeaderboardTeamEntry[] = [
  { id: 1, name: "Stellar Minds", avatar: "🌟", totalXp: 52_400, focusStreak: 14, leaderboardScore: 42000 },
  { id: 2, name: "Quantum Crew", avatar: "⚡", totalXp: 45_100, focusStreak: 10, leaderboardScore: 37000 },
  { id: 3, name: "Nova Squad", avatar: "🚀", totalXp: 38_700, focusStreak: 7, leaderboardScore: 31000 },
  { id: 4, name: "Cerebral Force", avatar: "🧠", totalXp: 29_200, focusStreak: 5, leaderboardScore: 23000 },
  { id: 5, name: "Eagle Eyes", avatar: "🦅", totalXp: 22_500, focusStreak: 4, leaderboardScore: 18000 },
];

type Period = "daily" | "weekly" | "alltime";
type View = "users" | "teams";

const periodLabel: Record<Period, string> = { daily: "Today", weekly: "This Week", alltime: "All Time" };

// ─── Scoring breakdown tooltip ───────────────────────────────────────────────
function ScoringInfo({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="absolute top-10 right-0 z-20 w-56 bg-card border border-white/15 rounded-2xl p-3 shadow-2xl text-xs"
    >
      <p className="font-bold text-foreground mb-2">🤖 Ranking Formula</p>
      {[
        ["Total XP", "40%", "text-secondary"],
        ["Focus Score", "30%", "text-primary"],
        ["Streak", "20%", "text-accent"],
        ["Improvement", "10%", "text-green-400"],
      ].map(([label, pct, cls]) => (
        <div key={label} className="flex justify-between items-center mb-1">
          <span className="text-muted-foreground">{label}</span>
          <span className={`font-bold ${cls}`}>{pct}</span>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function LeaderboardPage() {
  const [, navigate] = useLocation();
  const [view, setView] = useState<View>("users");
  const [period, setPeriod] = useState<Period>("weekly");
  const [showInfo, setShowInfo] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const currentUserId = 3; // mock: Rohan M. is "you"

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background theme-space relative overflow-hidden">
      {/* Cosmic background */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="star" style={{
          width: Math.random() * 2 + 1, height: Math.random() * 2 + 1,
          top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
          animationDuration: `${2 + Math.random() * 4}s`, animationDelay: `${Math.random() * 3}s`,
        }} />
      ))}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/map")}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="text-secondary" size={22} /> Leaderboard
            </h1>
            <p className="text-xs text-muted-foreground">Top learners & teams</p>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={handleRefresh}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
              <RefreshCw size={15} className={`text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <div className="relative">
              <button onClick={() => setShowInfo(v => !v)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
                <Info size={15} className="text-muted-foreground" />
              </button>
              <AnimatePresence><ScoringInfo show={showInfo} /></AnimatePresence>
            </div>
          </div>
        </div>

        {/* View toggle (Users / Teams) */}
        <div className="flex gap-1 bg-white/5 rounded-2xl p-1 mb-4">
          {(["users", "teams"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all
                ${view === v ? "bg-primary/80 text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
              {v === "users" ? <><Trophy size={14} /> Players</> : <><Users size={14} /> Teams</>}
            </button>
          ))}
        </div>

        {/* Period picker */}
        <div className="flex gap-1 mb-5">
          {(["daily", "weekly", "alltime"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all
                ${period === p ? "bg-secondary/20 text-secondary border border-secondary/30" : "text-muted-foreground hover:text-foreground"}`}>
              {periodLabel[p]}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        {view === "users" && (
          <div className="flex items-end justify-center gap-3 mb-6">
            {[MOCK_USERS[1], MOCK_USERS[0], MOCK_USERS[2]].map((u, i) => {
              const heights = ["h-20", "h-28", "h-16"];
              const badges = ["🥈", "🥇", "🥉"];
              const colors = ["from-slate-600/40 to-slate-700/40", "from-secondary/30 to-secondary/10", "from-amber-700/30 to-amber-900/20"];
              return (
                <motion.div key={u.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex-1 ${heights[i]} rounded-t-2xl bg-gradient-to-b ${colors[i]} border border-white/10 flex flex-col items-center justify-end pb-2`}
                >
                  <span className="text-xl mb-1">{badges[i]}</span>
                  <p className="text-[10px] font-bold text-foreground text-center px-1 leading-tight truncate w-full text-center">{u.name.split(" ")[0]}</p>
                  <p className="text-[9px] text-muted-foreground">{u.totalXp.toLocaleString()} XP</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div key={view + period} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {view === "users"
              ? <LeaderboardTable entries={MOCK_USERS} type="users" currentUserId={currentUserId} />
              : <LeaderboardTable entries={MOCK_TEAMS} type="teams" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
