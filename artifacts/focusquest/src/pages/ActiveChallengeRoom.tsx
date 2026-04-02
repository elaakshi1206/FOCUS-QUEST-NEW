import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/store";
import { getSocket } from "@/lib/socketClient";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Swords, Trophy, Clock, Skull, Stars } from "lucide-react";
import confetti from "canvas-confetti";

export function ActiveChallengeRoom() {
  const [, params] = useRoute("/challenge/:challengeId");
  const challengeId = params?.challengeId;
  const { theme } = useGame();
  
  const [challenge, setChallenge] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);

  // My team id mocked for demo
  const myTeamId = 1; 
  
  useEffect(() => {
    if (!challengeId) return;

    fetch(`http://localhost:3001/api/challenges/${challengeId}/status`)
      .then(res => res.json())
      .then(data => {
        if (data.challenge) {
          setChallenge(data.challenge);
          setQuestions(data.questions || []);
          if (data.challenge.status === "active") setStarted(true);
        }
      });

    const socket = getSocket();
    socket.emit("joinChallengeRoom", challengeId, String(myTeamId));

    socket.on("challengeStarted", (data) => {
      setChallenge(data);
      setStarted(true);
      setTimeLeft(15); // Start timer
    });

    socket.on("teamJoined", (data) => {
      console.log("Team joined:", data);
    });

    socket.on("answerSubmitted", (data: any) => {
      if (data.teamId === challenge?.team1Id) {
        setTeam1Score(prev => prev + data.pointsEarned);
      } else {
        setTeam2Score(prev => prev + data.pointsEarned);
      }
    });

    return () => {
      socket.off("challengeStarted");
      socket.off("teamJoined");
      socket.off("answerSubmitted");
    };
  }, [challengeId, challenge?.team1Id]);

  useEffect(() => {
    if (started && !finished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !finished) {
      handleNextQuestion();
    }
    return undefined;
  }, [timeLeft, started, finished]);

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(15);
    } else {
      setFinished(true);
      determineWinner();
    }
  };

  const determineWinner = () => {
    if (team1Score > team2Score) setWinner(challenge?.team1Id);
    else if (team2Score > team1Score) setWinner(challenge?.team2Id);
    else setWinner(-1); // Match Tie
    createConfetti();
  };

  const createConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: theme === "future" ? ["#00ff00", "#ffffff"] : ["#FFD700", "#FF4500"]
    });
  };

  const submitAnswer = (option: string) => {
    if (!started || finished) return;
    const socket = getSocket();
    const timeTaken = (15 - timeLeft) * 1000;
    
    socket.emit("submitRealtimeAnswer", {
      challengeId,
      teamId: String(myTeamId),
      questionId: String(questions[currentQIndex]?.id),
      answer: option,
      timeTaken
    });
    
    // Auto advance locally for smoother feel or let server tick if async multiplayer
    handleNextQuestion();
  };

  if (!challenge) {
    return <div className="min-h-screen text-white flex items-center justify-center">Loading Battle...</div>;
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground themeOverride={theme} />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col p-6">
        {/* Top HUD */}
        <header className="flex justify-between items-center mb-8 glass-panel p-4 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border flex flex-col items-center ${myTeamId === challenge.team1Id ? 'bg-primary/20 border-primary' : 'bg-black/30 border-white/10'}`}>
              <span className="text-xs uppercase tracking-widest text-white/70">Team 1</span>
              <span className="text-3xl font-bold text-white">{team1Score}</span>
            </div>
            <Swords className="w-8 h-8 text-yellow-500 animate-pulse" />
            <div className={`p-3 rounded-xl border flex flex-col items-center ${myTeamId === challenge.team2Id ? 'bg-primary/20 border-primary' : 'bg-black/30 border-white/10'}`}>
              <span className="text-xs uppercase tracking-widest text-white/70">Team 2</span>
              <span className="text-3xl font-bold text-white">{team2Score}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-display font-bold uppercase tracking-wider text-white">
              {challenge.challengeType}
            </h1>
            <div className="flex items-center gap-2 text-white/80 bg-black/40 px-3 py-1 rounded-full mt-1">
              <Clock className="w-4 h-4" />
              <span>Round {currentQIndex + 1} / {questions.length || 5}</span>
            </div>
          </div>
        </header>

        {/* Battle Arena Area */}
        <div className="flex-1 flex items-center justify-center relative">
          {!started ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-12 glass-panel rounded-3xl max-w-lg"
            >
              <Stars className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl font-display font-bold text-white mb-4">Waiting for Challenger...</h2>
              <p className="text-white/70">The battle starts as soon as an opponent joins this room.</p>
            </motion.div>
          ) : finished ? (
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="text-center p-12 glass-panel border-4 rounded-3xl max-w-md w-full bg-black/60 shadow-[0_0_50px_rgba(255,215,0,0.2)]"
            >
              {winner === myTeamId ? (
                 <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,255,0,0.5)]" />
              ) : winner === -1 ? (
                <Swords className="w-24 h-24 text-white mx-auto mb-6" />
              ) : (
                <Skull className="w-24 h-24 text-red-500 mx-auto mb-6" />
              )}
              <h2 className="text-4xl font-display font-bold text-white mb-2 uppercase tracking-widest">
                {winner === myTeamId ? "Victory!" : winner === -1 ? "Draw!" : "Defeat!"}
              </h2>
              <p className="text-xl text-white/80 mb-8">+250 XP earned</p>
              
              <button onClick={() => window.history.back()} className="game-button game-button-primary w-full py-4 text-xl">
                Return to Map
              </button>
            </motion.div>
          ) : currentQ ? (
             <AnimatePresence mode="wait">
              <motion.div 
                key={currentQ.id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="w-full max-w-2xl bg-black/50 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                    {currentQ.topic || "General"}
                  </span>
                  
                  <div className={`text-4xl font-display font-bold ${timeLeft <= 5 ? 'text-red-500 animate-bounce' : 'text-white'}`}>
                    {timeLeft}s
                  </div>
                </div>

                <h2 className="text-3xl font-medium text-white mb-10 leading-relaxed">
                  {currentQ.questionText}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(currentQ.options) ? currentQ.options.map((opt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => submitAnswer(opt)}
                      className="p-5 text-left text-lg font-medium text-white bg-white/5 border border-white/10 hover:bg-white/15 focus:outline-none rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg focus:ring-4 focus:ring-primary/50"
                    >
                      <span className="opacity-50 mr-3">{["A","B","C","D"][i]}.</span> {opt}
                    </button>
                  )) : (
                    <div className="col-span-2 text-white/50">Question parsing error. Option data invalid.</div>
                  )}
                </div>
              </motion.div>
             </AnimatePresence>
          ) : (
             <div className="text-white text-2xl animate-pulse">Generating academic payload...</div>
          )}
        </div>
      </div>
    </div>
  );
}
