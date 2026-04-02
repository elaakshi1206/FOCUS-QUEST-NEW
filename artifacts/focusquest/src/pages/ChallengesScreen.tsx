import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useGame } from "@/lib/store";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { Swords, Plus, Shield } from "lucide-react";

const themeWorldMap: Record<string, string> = {
  ocean: "Ocean Pirate Adventure",
  space: "Space Explorer",
  future: "Futuristic Mind Lab",
};

const worldChallengeTypes: Record<string, string[]> = {
  "Ocean Pirate Adventure": [
    "Emoji Math Race", "Sea Creature Identification Battle", "Pirate Vocabulary Rapid Fire", 
    "Animal Fact Showdown", "Cannonball Math Race", "Treasure Map Puzzle Duel"
  ],
  "Space Explorer": [
    "Concept Rapid Fire", "Science Fact Duel", "English Grammar Showdown", 
    "Quick Calculation Race", "Mystery Planet Challenge", "Asteroid Word Problem Relay"
  ],
  "Futuristic Mind Lab": [
    "Analytical Rapid Fire", "Problem-Solving Duel", "Science Application Battle", 
    "Math Puzzle Showdown", "Concept Defense Round", "Logic & Reasoning Relay", "Neural Network Puzzle Battle"
  ]
};

export function ChallengesScreen() {
  const [, setLocation] = useLocation();
  const { theme, userName } = useGame();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const worldName = themeWorldMap[theme] || "Ocean Pirate Adventure";

  useEffect(() => {
    fetchAvailableChallenges();
  }, [worldName]);

  const fetchAvailableChallenges = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/challenges/available?world=${encodeURIComponent(worldName)}`);
      const data = await res.json();
      setChallenges(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async (cType: string) => {
    try {
      // In a real app we'd get teamId from the store, assuming teamId 1 for demo
      const res = await fetch("http://localhost:3001/api/challenges/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: 1, 
          challengeType: cType,
          world: worldName
        })
      });
      const data = await res.json();
      if (data.challenge) {
        setLocation(`/challenge/${data.challenge.id}`);
      }
    } catch (err) {
      console.error("Failed to create challenge", err);
    }
  };

  const handleJoin = async (challengeId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/challenges/${challengeId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: 2 }) // Mocking opponent teamId 2
      });
      const data = await res.json();
      if (data.challenge || data.id) {
        setLocation(`/challenge/${challengeId}`);
      }
    } catch (err) {
      console.error("Failed to join challenge", err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-y-auto pb-20">
      <AnimatedBackground themeOverride={theme} />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 bg-black/40 rounded-full mb-6 backdrop-blur-sm border border-white/10 shadow-2xl"
          >
            <Shield className="w-10 h-10 text-yellow-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 drop-shadow-sm uppercase tracking-wider">
              Battle Arena
            </h1>
          </motion.div>
          <p className="text-lg text-white/80 font-medium">
            Welcome to the <span className="font-bold text-white">{worldName}</span> Battlegrounds, {userName}!
          </p>
        </header>

        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Swords className="text-primary w-6 h-6" /> Open Challenges
          </h2>
        </div>

        <div className="mb-8">
          <h3 className="text-sm uppercase tracking-widest text-white/50 mb-4">Host a new match:</h3>
          <div className="flex flex-wrap gap-3">
            {(worldChallengeTypes[worldName] || []).map((cType) => (
              <button
                key={cType}
                onClick={() => handleCreateNew(cType)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary/80 to-primary text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
              >
                <Plus className="w-4 h-4" /> {cType}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/60">Loading arena...</div>
        ) : challenges.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md">
            <Swords className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-2xl font-display font-bold text-white mb-2">It's quiet here.</h3>
            <p className="text-white/60 max-w-md mx-auto">
              No active challenges right now. Be the first to host a match and invite others to battle!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((c) => (
              <ChallengeCard
                key={c.id}
                id={c.id}
                challengeType={c.challengeType}
                world={c.world}
                status={c.status}
                isPending={c.status === "pending"}
                onJoin={() => handleJoin(c.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
