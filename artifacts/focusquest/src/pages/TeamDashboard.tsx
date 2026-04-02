import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Users, Sword, Plus, LogIn, Copy, Check, Shield, Star, Flame, TrendingUp, ChevronLeft } from "lucide-react";
import { TeamCard, type TeamCardData } from "@/components/multiplayer/TeamCard";
import { QuestProgressBar, type QuestData } from "@/components/multiplayer/QuestProgressBar";
import { ThemeBackground } from "@/components/ThemeBackground";
import { useGame } from "@/lib/store";

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_MY_TEAM: TeamCardData & {
  members: { id: number; name: string; focusScore: number; role: string; level: string }[];
} = {
  id: 1,
  teamId: "abc-123",
  name: "Stellar Minds",
  avatar: "🌟",
  totalXp: 12_450,
  focusStreak: 7,
  memberCount: 4,
  members: [
    { id: 1, name: "Aisha K.", focusScore: 88, role: "owner", level: "Advanced" },
    { id: 2, name: "Rohan M.", focusScore: 71, role: "member", level: "Intermediate" },
    { id: 3, name: "Priya S.", focusScore: 64, role: "member", level: "Beginner" },
    { id: 4, name: "Dev P.", focusScore: 79, role: "member", level: "Intermediate" },
  ],
};

const MOCK_QUESTS: QuestData[] = [
  {
    id: 1,
    title: "Weekly Knowledge Sprint",
    description: "Complete 10 lessons together this week",
    objectiveType: "lessons",
    targetValue: 10,
    currentValue: 6,
    rewardXp: 500,
    expiresAt: new Date(Date.now() + 2 * 86400000).toISOString(),
  },
  {
    id: 2,
    title: "Streak Masters",
    description: "Maintain a combined 7-day focus streak",
    objectiveType: "streak",
    targetValue: 7,
    currentValue: 7,
    rewardXp: 350,
    expiresAt: new Date(Date.now() + 1 * 86400000).toISOString(),
  },
  {
    id: 3,
    title: "XP Rush",
    description: "Score at least 2000 team XP in 24 hours",
    objectiveType: "xp",
    targetValue: 2000,
    currentValue: 1240,
    rewardXp: 800,
    expiresAt: new Date(Date.now() + 12 * 3600000).toISOString(),
  },
];

// ─── Level bar colors ────────────────────────────────────────────────────────
const levelBar: Record<string, string> = {
  Beginner: "bg-green-500",
  Intermediate: "bg-yellow-400",
  Advanced: "bg-purple-500",
};

// ─── Create Team modal ───────────────────────────────────────────────────────
function CreateTeamModal({ onClose, onCreate }: { onClose: () => void; onCreate: (n: string, a: string) => void }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🛡️");
  const avatars = ["🛡️", "🌟", "🔥", "⚡", "🎯", "🚀", "🧠", "🦅"];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-card border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Create Team</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {avatars.map(a => (
            <button key={a} onClick={() => setAvatar(a)}
              className={`w-10 h-10 text-xl rounded-xl transition-all ${avatar === a ? "bg-primary/30 ring-2 ring-primary" : "bg-white/5 hover:bg-white/10"}`}>
              {a}
            </button>
          ))}
        </div>
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Team name…"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 mb-4"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-muted-foreground hover:bg-white/5">
            Cancel
          </button>
          <button onClick={() => { if (name.trim()) { onCreate(name, avatar); onClose(); } }}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90">
            Create 🚀
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Join Team modal ─────────────────────────────────────────────────────────
function JoinTeamModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-card border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Join a Team</h2>
        <p className="text-sm text-muted-foreground mb-4">Enter the invite code shared by your friend.</p>
        <input
          value={code} onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Invite code (e.g. ABC-123)"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 mb-4 font-mono tracking-widest"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-muted-foreground hover:bg-white/5">
            Cancel
          </button>
          <button className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90">
            Join Team
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export function TeamDashboard() {
  const [, navigate] = useLocation();
  const { theme } = useGame();
  const [myTeam] = useState(MOCK_MY_TEAM);
  const [quests] = useState(MOCK_QUESTS);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"overview" | "quests" | "members">("overview");

  const themeConfig = {
    ocean: { icon: '🏴‍☠️', label: 'Pirate Crew', badge: 'Pirates' },
    space: { icon: '🛸', label: 'Starfleet Squadron', badge: 'Crew' },
    future: { icon: '🤖', label: 'Neural Team', badge: 'Agents' },
  }[theme] ?? { icon: '🛡️', label: 'Study Team', badge: 'Team' };

  const copyInvite = () => {
    navigator.clipboard.writeText(myTeam.teamId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ThemeBackground />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/map")}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="text-primary" size={22} /> {themeConfig.icon} My {themeConfig.badge}
            </h1>
            <p className="text-xs text-muted-foreground">{themeConfig.label}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <motion.button whileTap={{ scale: 0.94 }}
              onClick={() => setShowJoin(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <LogIn size={16} className="text-muted-foreground" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.94 }}
              onClick={() => setShowCreate(true)}
              className="p-2 rounded-xl bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors">
              <Plus size={16} className="text-primary" />
            </motion.button>
          </div>
        </div>

        {/* Team Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-white/10 p-5 mb-5 shadow-xl"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-4xl">
                {myTeam.avatar}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">{myTeam.name}</h2>
                <p className="text-xs text-muted-foreground">{myTeam.memberCount} members • Active</p>
              </div>
            </div>
            <button onClick={copyInvite} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground transition-all">
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Invite"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Star size={14} />, val: myTeam.totalXp.toLocaleString(), label: "Team XP", color: "text-secondary" },
              { icon: <Flame size={14} />, val: `${myTeam.focusStreak}d`, label: "Streak", color: "text-accent" },
              { icon: <TrendingUp size={14} />, val: `${quests.filter(q => Math.round((q.currentValue / q.targetValue) * 100) >= 100).length}/${quests.length}`, label: "Quests Done", color: "text-green-400" },
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-2xl p-3 text-center">
                <div className={`flex justify-center mb-1 ${item.color}`}>{item.icon}</div>
                <div className={`font-display font-bold text-lg ${item.color}`}>{item.val}</div>
                <div className="text-[10px] text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-2xl p-1 mb-5">
          {(["overview", "quests", "members"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all
                ${tab === t ? "bg-primary/80 text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <h3 className="font-display font-bold text-foreground text-base flex items-center gap-2">
                <Sword size={16} className="text-primary" /> Active Quests
              </h3>
              {quests.slice(0, 2).map((q, i) => <QuestProgressBar key={q.id} quest={q} index={i} />)}
              <button onClick={() => setTab("quests")} className="text-xs text-primary text-center w-full py-2 hover:underline">
                View all quests →
              </button>
            </motion.div>
          )}

          {tab === "quests" && (
            <motion.div key="quests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <h3 className="font-display font-bold text-foreground text-base">All Team Quests</h3>
              {quests.map((q, i) => <QuestProgressBar key={q.id} quest={q} index={i} />)}
            </motion.div>
          )}

          {tab === "members" && (
            <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <h3 className="font-display font-bold text-foreground text-base flex items-center gap-2">
                <Users size={16} className="text-primary" /> Members
              </h3>
              {myTeam.members.map((m, i) => (
                <motion.div key={m.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 bg-card/60 border border-white/10 rounded-2xl px-4 py-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold text-white text-sm">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      {m.name}
                      {m.role === "owner" && <span className="text-[9px] bg-secondary/20 text-secondary border border-secondary/30 rounded-full px-1.5">Owner</span>}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="h-1.5 w-16 rounded-full bg-white/10 overflow-hidden">
                        <div className={`h-full rounded-full ${levelBar[m.level] || "bg-primary"}`}
                          style={{ width: `${m.focusScore}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{m.level}</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-primary">{m.focusScore}%</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && <CreateTeamModal onClose={() => setShowCreate(false)} onCreate={(n, a) => console.log("Create", n, a)} />}
        {showJoin && <JoinTeamModal onClose={() => setShowJoin(false)} />}
      </AnimatePresence>
    </div>
  );
}
