import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Radar, Zap, Search, ChevronLeft, Wifi, CheckCircle2, BookOpen, X } from "lucide-react";
import { PlayerMatchCard, type MatchedPlayerData } from "@/components/multiplayer/PlayerMatchCard";

// ─── Mock matched players ─────────────────────────────────────────────────────
const MOCK_MATCHES: MatchedPlayerData[] = [
  {
    matchScore: 94,
    reason: "Similar skill level | Shared interests: Algebra, Physics | Both on positive streaks",
    user: { id: 5, name: "Sam Q.", focusScore: 82, totalXp: 7600, difficultyLevel: "Intermediate", learningTopics: ["Algebra", "Physics"], currentStreak: 8, improvementRate: 11 },
  },
  {
    matchScore: 87,
    reason: "Close focus alignment | Shared interests: Physics | Both on positive streaks",
    user: { id: 6, name: "Nina L.", focusScore: 79, totalXp: 6100, difficultyLevel: "Intermediate", learningTopics: ["Physics", "Chemistry"], currentStreak: 5, improvementRate: 7 },
  },
  {
    matchScore: 76,
    reason: "Similar skill level | Balanced Match",
    user: { id: 7, name: "Arjun T.", focusScore: 68, totalXp: 5400, difficultyLevel: "Beginner", learningTopics: ["History", "Algebra"], currentStreak: 3, improvementRate: 5 },
  },
  {
    matchScore: 65,
    reason: "Shared interests: History | Balanced Match",
    user: { id: 8, name: "Maya R.", focusScore: 61, totalXp: 4800, difficultyLevel: "Beginner", learningTopics: ["History"], currentStreak: 2, improvementRate: 3 },
  },
];

const ALL_TOPICS = ["Algebra", "Physics", "Chemistry", "History", "Biology", "English", "Geography", "Music"];

type MatchState = "idle" | "searching" | "found";

// ─── Scanning animation ────────────────────────────────────────────────────────
function ScanAnimation() {
  return (
    <div className="relative flex items-center justify-center w-44 h-44 mx-auto mb-8">
      {[1, 2, 3].map(i => (
        <motion.div key={i}
          className="absolute rounded-full border border-primary/40"
          style={{ width: `${i * 48}px`, height: `${i * 48}px` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 rounded-full border-2 border-primary border-t-transparent"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Radar size={28} className="text-primary" />
      </div>
    </div>
  );
}

// ─── Topic pill ───────────────────────────────────────────────────────────────
function TopicPill({ topic, selected, onToggle }: { topic: string; selected: boolean; onToggle: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onToggle}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
        ${selected ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"}`}
    >
      <BookOpen size={9} /> {topic}
      {selected && <X size={9} />}
    </motion.button>
  );
}

// ─── Invited badge ────────────────────────────────────────────────────────────
function InvitedBadge() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm rounded-2xl border border-green-500/30"
    >
      <CheckCircle2 size={36} className="text-green-400 mb-2" />
      <p className="font-display font-bold text-foreground">Invite Sent!</p>
      <p className="text-xs text-muted-foreground mt-1">Waiting for response…</p>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export function MatchmakingScreen() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<MatchState>("idle");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Algebra"]);
  const [teamSize, setTeamSize] = useState(4);
  const [matches, setMatches] = useState<MatchedPlayerData[]>([]);
  const [invitedIds, setInvitedIds] = useState<Set<number>>(new Set());

  const toggleTopic = (t: string) =>
    setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const startSearch = () => {
    setState("searching");
    setTimeout(() => {
      setMatches(MOCK_MATCHES.slice(0, teamSize - 1));
      setState("found");
    }, 2500);
  };

  const reset = () => {
    setState("idle");
    setMatches([]);
    setInvitedIds(new Set());
  };

  const invite = (userId: number) =>
    setInvitedIds(prev => new Set([...prev, userId]));

  return (
    <div className="min-h-screen bg-background theme-future relative overflow-hidden">
      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="data-particle" style={{
            left: `${10 + i * 12}%`,
            animationDuration: `${4 + i * 1.2}s`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/map")}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Radar className="text-primary" size={22} />
              Matchmaking
            </h1>
            <p className="text-xs text-muted-foreground">AI-powered study partner finder</p>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1 text-[10px] text-green-400 font-bold">
            <Wifi size={9} /> Online
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Idle / Configure ── */}
          {state === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Team size */}
              <div className="glass-panel rounded-2xl p-4 mb-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Team Size</p>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map(n => (
                    <button key={n} onClick={() => setTeamSize(n)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all
                        ${teamSize === n ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/5 border-white/10 text-muted-foreground"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="glass-panel rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  <Search size={11} className="inline mr-1" />Preferred Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALL_TOPICS.map(t => (
                    <TopicPill key={t} topic={t} selected={selectedTopics.includes(t)} onToggle={() => toggleTopic(t)} />
                  ))}
                </div>
              </div>

              {/* AI hint */}
              <div className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-2xl p-3 mb-6 text-xs text-muted-foreground">
                <Zap size={13} className="text-primary flex-shrink-0 mt-0.5" />
                <span>Our <strong className="text-primary">Antigravity AI</strong> matches you with partners based on focus score, learning topics, difficulty level, and improvement rate — so no one gets left behind.</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={startSearch}
                className="w-full game-button game-button-primary py-4 text-base flex items-center justify-center gap-2"
              >
                <Radar size={18} /> Find My Study Squad
              </motion.button>
            </motion.div>
          )}

          {/* ── Searching ── */}
          {state === "searching" && (
            <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center pt-8">
              <ScanAnimation />
              <p className="font-display text-lg font-bold text-foreground mb-1">Scanning the network…</p>
              <p className="text-sm text-muted-foreground">AI is analyzing {300 + Math.floor(Math.random() * 200)} active learners</p>
              <div className="flex justify-center gap-1.5 mt-4">
                {[0, 0.2, 0.4].map(delay => (
                  <motion.div key={delay} className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, delay, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Found ── */}
          {state === "found" && (
            <motion.div key="found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-display font-bold text-foreground text-lg">
                    {matches.length} Matches Found! 🎉
                  </p>
                  <p className="text-xs text-muted-foreground">Best study partners for you</p>
                </div>
                <button onClick={reset}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-white/10 rounded-xl px-3 py-1.5 hover:bg-white/5">
                  <ChevronLeft size={12} /> Back
                </button>
              </div>

              <div className="space-y-3">
                {matches.map((m, i) => (
                  <div key={m.user.id} className="relative">
                    <AnimatePresence>
                      {invitedIds.has(m.user.id) && <InvitedBadge />}
                    </AnimatePresence>
                    <PlayerMatchCard match={m} index={i} onInvite={invite} />
                  </div>
                ))}
              </div>

              {invitedIds.size >= matches.length && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-secondary/10 border border-secondary/20 rounded-2xl text-center"
                >
                  <p className="font-display font-bold text-secondary text-lg">All invites sent! 🚀</p>
                  <p className="text-xs text-muted-foreground mt-1">Head to your team dashboard to track responses.</p>
                  <button onClick={() => navigate("/team")}
                    className="mt-3 game-button game-button-secondary px-6 py-2 text-sm">
                    Go to Team Dashboard
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
