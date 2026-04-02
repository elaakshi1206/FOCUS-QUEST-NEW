import { motion } from "framer-motion";
import { Users, Swords, Clock } from "lucide-react";

interface ChallengeCardProps {
  id?: number;
  challengeType: string;
  world: string;
  status: string;
  onJoin?: () => void;
  isPending?: boolean;
}

export function ChallengeCard({ challengeType, world, status, onJoin, isPending }: ChallengeCardProps) {
  // Theme selection
  const themeClasses: Record<string, string> = {
    "Ocean Pirate Adventure": "bg-blue-900 border-blue-400 text-blue-100",
    "Space Explorer": "bg-indigo-900 border-purple-500 text-purple-100",
    "Futuristic Mind Lab": "bg-emerald-900 border-green-500 text-green-100",
  };

  const bgClass = themeClasses[world] || "bg-gray-800 border-gray-500 text-gray-100";

  return (
    <motion.div
      whileHover={{ scale: 1.05, translateY: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`p-6 rounded-2xl border-2 shadow-lg flex flex-col gap-4 ${bgClass} transition-shadow hover:shadow-2xl`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold font-display uppercase tracking-widest text-white flex items-center gap-2">
            <Swords className="w-5 h-5 opacity-80" />
            {challengeType}
          </h3>
          <p className="text-sm opacity-80 mt-1">{world}</p>
        </div>
        <div className="bg-black/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {status}
        </div>
      </div>

      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1 text-sm opacity-90">
          <Users className="w-4 h-4" />
          <span>Vs Match</span>
        </div>
        <div className="flex items-center gap-1 text-sm opacity-90">
          <Clock className="w-4 h-4" />
          <span>~5 Mins</span>
        </div>
      </div>

      {isPending && onJoin && (
        <button
          onClick={onJoin}
          className="mt-4 py-2 w-full bg-white text-black font-bold uppercase rounded-lg shadow-md hover:bg-gray-200 transition-colors"
        >
          Join Battle
        </button>
      )}
    </motion.div>
  );
}
