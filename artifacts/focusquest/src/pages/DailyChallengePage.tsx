import { useState } from "react";
import { useGame } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, ChevronLeft, Award } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface DailyQuiz {
  id: number;
  date: string;
  gradeGroup: string;
  questions: QuizQuestion[];
}

const THEME_STYLES: Record<string, any> = {
  ocean: {
    bg: "from-cyan-900 via-blue-900 to-slate-900",
    primaryText: "text-cyan-300",
    gradientText: "from-cyan-400 to-blue-400",
    cardBorder: "border-cyan-500/30",
    button: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    cardBg: "bg-cyan-950/40",
    activeOption: "border-cyan-400 bg-cyan-900/60 shadow-[0_0_15px_rgba(6,182,212,0.4)]",
    activeChar: "bg-cyan-500 text-white",
    hoverOption: "hover:border-cyan-400/50 hover:bg-cyan-900/30",
    icon: "🌊",
    title: "Ocean Pirate Challenge"
  },
  space: {
    bg: "from-indigo-900 via-purple-900 to-slate-900",
    primaryText: "text-purple-300",
    gradientText: "from-purple-400 to-fuchsia-400",
    cardBorder: "border-purple-500/30",
    button: "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    cardBg: "bg-purple-950/40",
    activeOption: "border-purple-400 bg-purple-900/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    activeChar: "bg-purple-500 text-white",
    hoverOption: "hover:border-purple-400/50 hover:bg-purple-900/30",
    icon: "🚀",
    title: "Cosmic Space Challenge"
  },
  future: {
    bg: "from-emerald-900 via-teal-950 to-slate-900",
    primaryText: "text-emerald-300",
    gradientText: "from-emerald-400 to-cyan-400",
    cardBorder: "border-emerald-500/30",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    cardBg: "bg-emerald-950/40",
    activeOption: "border-emerald-400 bg-emerald-900/60 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    activeChar: "bg-emerald-500 text-white",
    hoverOption: "hover:border-emerald-400/50 hover:bg-emerald-900/30",
    icon: "⚡",
    title: "Cyber Lab Challenge"
  }
};

export function DailyChallengePage() {
  const [, setLocation] = useLocation();
  const { grade, userName, theme } = useGame();
  
  const themeWorldMap: Record<string, string> = {
    ocean: "Ocean Pirate Adventure",
    space: "Space Explorer",
    future: "Futuristic Mind Lab",
  };
  const worldName = themeWorldMap[theme] || "Ocean Pirate Adventure";
  const style = THEME_STYLES[theme] || THEME_STYLES.ocean;
  
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number>(0);
  
  // result state
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const fetchDailyQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/daily/daily-quiz?grade=${grade}&world=${encodeURIComponent(worldName)}`);
      const data = await res.json();
      if (!data.error) {
        setQuiz(data);
        setStartTime(Date.now());
      } else {
        throw new Error(data.error);
      }
    } catch(err) {
      console.error("API Server not reachable or failed, using mock data.", err);
      // Fallback mock quiz if server not reachable
      const realisticMockQuestionsFor1to4 = [
        {
          questionText: "What is 5 + 3?",
          options: ["6", "7", "8", "9"],
          correctAnswer: "8"
        },
        {
          questionText: "Which animal lives in the ocean?",
          options: ["Lion", "Shark", "Elephant", "Giraffe"],
          correctAnswer: "Shark"
        },
        {
          questionText: "Choose the correct spelling:",
          options: ["Aple", "Appl", "Apple", "Apel"],
          correctAnswer: "Apple"
        },
        {
          questionText: "What is 10 - 4?",
          options: ["5", "6", "7", "8"],
          correctAnswer: "6"
        },
        {
          questionText: "Which of these is a fruit?",
          options: ["Carrot", "Banana", "Broccoli", "Potato"],
          correctAnswer: "Banana"
        },
        {
          questionText: "Complete the sentence: The cat sits ___ the mat.",
          options: ["on", "with", "into", "between"],
          correctAnswer: "on"
        },
        {
          questionText: "How many legs does a spider have?",
          options: ["4", "6", "8", "10"],
          correctAnswer: "8"
        },
        {
          questionText: "What day comes after Tuesday?",
          options: ["Monday", "Wednesday", "Thursday", "Friday"],
          correctAnswer: "Wednesday"
        },
        {
          questionText: "Which object gives us light and heat during the day?",
          options: ["The Moon", "The Stars", "The Sun", "A Lamp"],
          correctAnswer: "The Sun"
        },
        {
          questionText: "If you have 2 apples and get 2 more, how many do you have?",
          options: ["2", "3", "4", "5"],
          correctAnswer: "4"
        }
      ];

      const realisticMockQuestionsFor5to7 = [
        { questionText: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: "Mars" },
        { questionText: "What is the result of 15 * 6?", options: ["80", "90", "100", "110"], correctAnswer: "90" },
        { questionText: "Identify the synonym for 'vast':", options: ["Tiny", "Narrow", "Immense", "Brief"], correctAnswer: "Immense" },
        { questionText: "Which force keeps the planets in orbit around the Sun?", options: ["Friction", "Magnetism", "Gravity", "Tension"], correctAnswer: "Gravity" },
        { questionText: "If a spaceship travels at 500 km/h, how far will it travel in 4 hours?", options: ["1000 km", "1500 km", "2000 km", "2500 km"], correctAnswer: "2000 km" },
        { questionText: "What is the central core of an atom called?", options: ["Electron", "Proton", "Nucleus", "Neutron"], correctAnswer: "Nucleus" },
        { questionText: "Choose the correctly punctuated sentence:", options: ["The alien said 'hello!'", "The alien said, \"Hello!\"", "The alien said hello.", "the alien said hello"], correctAnswer: "The alien said, \"Hello!\"" },
        { questionText: "Solve for x: 3x + 5 = 20", options: ["x = 4", "x = 5", "x = 6", "x = 7"], correctAnswer: "x = 5" },
        { questionText: "What gas do plants absorb from the atmosphere in space stations?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], correctAnswer: "Carbon Dioxide" },
        { questionText: "What is the past tense of 'fly'?", options: ["Flyed", "Flew", "Flown", "Flying"], correctAnswer: "Flew" }
      ];

      const realisticMockQuestionsFor8to10 = [
        { questionText: "What is the value of x in the equation 2(x - 3) = 4x + 6?", options: ["-6", "-3", "3", "6"], correctAnswer: "-6" },
        { questionText: "Which fundamental force is responsible for radioactive decay?", options: ["Strong Nuclear Force", "Weak Nuclear Force", "Electromagnetism", "Gravity"], correctAnswer: "Weak Nuclear Force" },
        { questionText: "In a right-angled triangle, if the sides are 6 cm and 8 cm, what is the length of the hypotenuse?", options: ["9 cm", "10 cm", "12 cm", "14 cm"], correctAnswer: "10 cm" },
        { questionText: "Which law of thermodynamics states that energy cannot be created or destroyed?", options: ["Zeroth Law", "First Law", "Second Law", "Third Law"], correctAnswer: "First Law" },
        { questionText: "What is the chemical formula for sulfuric acid?", options: ["H2SO4", "HCl", "HNO3", "H2CO3"], correctAnswer: "H2SO4" },
        { questionText: "Solve the quadratic equation: x^2 - 5x + 6 = 0", options: ["x=2, x=3", "x=-2, x=-3", "x=1, x=6", "x=-1, x=-6"], correctAnswer: "x=2, x=3" },
        { questionText: "What is the SI unit of electric resistance?", options: ["Volt", "Ampere", "Ohm", "Joule"], correctAnswer: "Ohm" },
        { questionText: "If the probability of an event is 0.2, what is the probability of the event not happening?", options: ["0.2", "0.5", "0.8", "1.0"], correctAnswer: "0.8" },
        { questionText: "Which organelle is known as the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"], correctAnswer: "Mitochondria" },
        { questionText: "What happens to the resistance of a semiconductor when its temperature increases?", options: ["Increases", "Decreases", "Remains constant", "First increases then decreases"], correctAnswer: "Decreases" }
      ];

      const mockQuiz: DailyQuiz = {
        id: 999,
        date: new Date().toISOString().split("T")[0],
        gradeGroup: grade < 5 ? "1-4" : grade < 8 ? "5-7" : "8-10",
        questions: grade < 5 ? realisticMockQuestionsFor1to4 : grade < 8 ? realisticMockQuestionsFor5to7 : realisticMockQuestionsFor8to10
      };
      setQuiz(mockQuiz);
      setStartTime(Date.now());
    }
    setLoading(false);
  };

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const nextQuestion = () => {
    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    setLoading(true);
    
    // Calculate correct answers
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    
    const timeToComplete = Math.floor((Date.now() - startTime) / 1000); // in seconds
    setScore(correct);
    setTimeTaken(timeToComplete);

    try {
      // Fetch actual user ID from the backend based on userName
      let currentUserId = 1; // Fallback
      if (userName) {
        try {
          const userRes = await fetch(`http://localhost:3001/api/users/${encodeURIComponent(userName)}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData && userData.id) {
              currentUserId = userData.id;
            }
          }
        } catch (e) {
          console.warn("Could not fetch actual user id, using 1", e);
        }
      }

      const reqBody = { userId: currentUserId, quizId: quiz.id, correctAnswers: correct, timeTaken: timeToComplete };
      const res = await fetch("http://localhost:3001/api/daily/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody)
      });
      
      if (!res.ok) throw new Error("Submit failed");
      
      const resLB = await fetch(`http://localhost:3001/api/daily/leaderboard?grade=${grade}&date=${quiz.date}&world=${encodeURIComponent(worldName)}`);
      const lbData = await resLB.json();
      
      // Inject isMe into leaderboard data based on currentUserId
      const mappedLb = lbData.map((entry: any) => ({
         ...entry,
         isMe: entry.userId === currentUserId
      }));

      setLeaderboard(mappedLb);
      setSubmitted(true);
    } catch(err) {
      console.error("Submission backend failed, using mock leaderboard", err);
      // Fallback mock leaderboard
      setLeaderboard([
        { userId: 1, name: userName || "You", score: correct, timeTaken: timeToComplete, isMe: true },
        { userId: 2, name: "Alpha", score: Math.max(0, correct - 1), timeTaken: timeToComplete + 10, isMe: false },
        { userId: 3, name: "Beta", score: Math.max(0, correct - 2), timeTaken: timeToComplete + 20, isMe: false },
      ]);
      setSubmitted(true);
    }
    setLoading(false);
  };

  const renderTopBar = () => (
    <div className="flex items-center justify-between w-full max-w-5xl mx-auto mb-8 relative z-20">
      <button 
        onClick={() => setLocation("/map")}
        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all backdrop-blur-md"
      >
        <ChevronLeft className="text-white" />
      </button>
      <div className={`flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-black/30 backdrop-blur-xl shadow-lg border-b-2 ${style.cardBorder}`}>
        <span className="text-xl">{style.icon}</span>
        <span className={`font-bold uppercase tracking-widest text-sm bg-gradient-to-r ${style.gradientText} bg-clip-text text-transparent`}>
          {style.title}
        </span>
      </div>
      <div className="w-10 h-10" /> {/* Balancer */}
    </div>
  );

  if (!quiz) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${style.bg} relative overflow-hidden flex flex-col p-6`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
        {renderTopBar()}
        
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full animate-fade-in-up">
          <Card className={`w-full max-w-lg ${style.cardBg} ${style.cardBorder} backdrop-blur-2xl text-center shadow-2xl relative overflow-hidden`}>
            {/* Soft backdrop glow inside the card */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl`} />
            
            <CardHeader className="pt-10 pb-6">
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="text-6xl mb-4"
              >
                {style.icon}
              </motion.div>
              <CardTitle className={`text-4xl font-extrabold bg-gradient-to-br ${style.gradientText} bg-clip-text text-transparent`}>
                Daily Challenge
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg mt-4 max-w-sm mx-auto font-medium">
                10 Questions. Only one attempt per day. Can you top the leaderboard in the <strong>{worldName}</strong>?
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10 pt-4 px-10">
              <Button 
                onClick={fetchDailyQuiz} 
                disabled={loading} 
                className={`w-full h-14 text-xl font-bold rounded-xl transition-all ${style.button}`}
              >
                {loading ? "Aligning Scanners..." : "Start Adventure!"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (submitted) {
    const wrongQuestions = quiz.questions.map((q, idx) => ({ 
      ...q, 
      userAnswer: answers[idx], 
      questionNumber: idx + 1 
    })).filter(q => q.userAnswer !== q.correctAnswer);

    return (
      <div className={`min-h-screen bg-gradient-to-br ${style.bg} relative overflow-hidden flex flex-col p-6`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
        {renderTopBar()}

        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col gap-8 relative z-10 animate-fade-in-up pb-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Result Card */}
            <Card className={`${style.cardBg} ${style.cardBorder} backdrop-blur-2xl shadow-2xl overflow-hidden`}>
              <div className={`h-2 w-full bg-gradient-to-r ${style.gradientText}`} />
              <CardHeader>
                <CardTitle className={`text-3xl font-extrabold flex items-center gap-3 ${style.primaryText}`}>
                  <Award className="w-8 h-8" /> Mission Complete!
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  You earned <strong className="text-white">{score * 10} XP</strong> for this run.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-gray-400 font-semibold mb-1">Final Score</span>
                    <span className={`text-4xl font-black bg-gradient-to-tr ${style.gradientText} bg-clip-text text-transparent`}>
                      {score} <span className="text-xl text-gray-500">/ {quiz.questions.length}</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-gray-400 font-semibold mb-1">Accuracy</span>
                    <span className="text-4xl font-bold text-white">
                      {Math.round((score / quiz.questions.length) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xl p-5 bg-black/40 rounded-xl border border-white/5 shadow-inner">
                  <span className="text-gray-400 font-semibold">Time Record</span>
                  <span className="text-white font-bold">{timeTaken} seconds</span>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Card */}
            <Card className={`bg-black/60 ${style.cardBorder} backdrop-blur-2xl relative shadow-2xl md:h-[352px] flex flex-col`}>
              <CardHeader className="pb-4 shrink-0">
                <CardTitle className={`text-2xl font-bold bg-gradient-to-r ${style.gradientText} bg-clip-text text-transparent`}>
                  Top Explorers Today
                </CardTitle>
                <CardDescription className="text-gray-400 italic font-medium">World: Grade {quiz.gradeGroup} — {worldName}</CardDescription>
              </CardHeader>
              <CardContent className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                 {leaderboard.length === 0 ? <p className="text-gray-500 py-4 text-center">Data streams are empty.</p> : (
                   <div className="space-y-3">
                     {leaderboard.map((lb, idx) => {
                       const isMe = lb.isMe !== undefined ? lb.isMe : lb.userId === 1; // Check injected isMe or fallback
                       return (
                         <motion.div 
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: idx * 0.1 }}
                           key={idx} 
                           className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isMe ? `bg-white/10 ${style.cardBorder} shadow-lg shadow-white/5 font-extrabold` : 'border-white/5 bg-black/30 hover:bg-black/50'}`}
                         >
                            <div className="flex items-center gap-4">
                              <span className={`w-8 text-center text-lg font-black ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                                #{idx + 1}
                              </span>
                              <span className="text-white truncate max-w-[120px] sm:max-w-xs">{lb.name}</span>
                            </div>
                            <div className="flex items-center gap-5 text-sm font-bold">
                              <span className={style.primaryText}>{lb.score} pts</span>
                              <span className="text-gray-400 w-8 text-right">{lb.timeTaken}s</span>
                            </div>
                         </motion.div>
                       );
                     })}
                   </div>
                 )}
              </CardContent>
            </Card>
          </div>

          {/* Corrections / Review Card */}
          {wrongQuestions.length > 0 && (
            <Card className={`${style.cardBg} border-red-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden animate-fade-in mt-4`}>
              <div className={`h-1.5 w-full bg-gradient-to-r from-red-500 to-orange-500`} />
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2 text-red-400">
                  Mission Review Log
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Analyze your mistakes to level up your knowledge!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {wrongQuestions.map((wq, i) => (
                  <div key={i} className="p-5 bg-black/40 rounded-xl border border-red-500/20 shadow-inner">
                    <p className="text-gray-400 text-sm font-bold mb-2">Question {wq.questionNumber}</p>
                    <p className="text-white text-lg font-semibold mb-4 leading-relaxed">{wq.questionText}</p>
                    
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="flex-1 p-4 rounded-lg bg-red-950/40 border border-red-500/30">
                        <span className="text-red-400 text-xs font-bold uppercase tracking-wider block mb-1">Your Answer</span>
                        <span className="text-gray-200 line-through opacity-80">{wq.userAnswer || "No Answer"}</span>
                      </div>
                      <div className="flex-1 p-4 rounded-lg bg-green-950/40 border border-green-500/30">
                        <span className="text-green-400 text-xs font-bold uppercase tracking-wider block mb-1">Correct Answer</span>
                        <span className="text-white font-bold">{wq.correctAnswer}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {wrongQuestions.length === 0 && (
            <div className="text-center py-10 bg-green-950/20 rounded-2xl border border-green-500/30 backdrop-blur-md">
              <span className="text-6xl mb-4 block">✨</span>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Flawless Run!</h3>
              <p className="text-gray-300">You answered every single question correctly. Amazing job!</p>
            </div>
          )}

        </div>
      </div>
    );
  }

  const q = quiz.questions[currentIndex];
  // Calculate progress
  const progressPercent = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${style.bg} relative overflow-hidden flex flex-col p-4 md:p-8`}>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
      {renderTopBar()}
      
      <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col relative z-10 mt-4 animate-fade-in">
        
        {/* Progress header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex-1 mr-6">
            <div className="flex justify-between text-sm font-bold text-white/70 mb-2">
              <span>Question {currentIndex + 1}</span>
              <span>{quiz.questions.length}</span>
            </div>
            <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={`h-full bg-gradient-to-r ${style.gradientText}`} 
              />
            </div>
          </div>
          <div className={`flex items-center gap-2 ${style.primaryText} font-black text-lg bg-black/40 px-4 py-2 rounded-xl border border-white/10 shadow-inner`}>
            <Timer className="w-5 h-5 animate-pulse" /> Active
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col"
          >
            <Card className={`flex-1 ${style.cardBg} ${style.cardBorder} backdrop-blur-2xl shadow-xl flex flex-col overflow-hidden`}>
              <div className={`h-1.5 w-full bg-gradient-to-r ${style.gradientText}`} />
              <CardContent className="p-6 md:p-10 flex flex-col flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-10 mt-4 tracking-wide break-words drop-shadow-md">
                  {q.questionText}
                </h2>
                
                <div className="space-y-4 mb-8 flex-1">
                  {q.options.map((opt, i) => {
                    const isSelected = answers[currentIndex] === opt;
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all duration-200 text-lg font-semibold group text-left
                          ${isSelected ? style.activeOption : `border-white/10 bg-white/5 text-gray-200 ${style.hoverOption} shadow-sm`}
                        `}
                      >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-colors mr-5 shrink-0 ${isSelected ? style.activeChar : 'bg-black/50 text-gray-400 group-hover:bg-black/30 group-hover:text-white'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="w-full break-words">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-end mt-6">
          {currentIndex < quiz.questions.length - 1 ? (
            <Button 
              onClick={nextQuestion} 
              disabled={!answers[currentIndex]} 
              className={`px-10 h-14 text-xl font-bold rounded-2xl transition-all ${style.button} disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95`}
            >
              Confirm & Next
            </Button>
          ) : (
            <Button 
              onClick={submitQuiz} 
              disabled={!answers[currentIndex] || loading} 
              className={`px-10 h-14 text-xl font-bold rounded-2xl transition-all ${style.button} disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95`}
            >
              {loading ? "Analyzing Run..." : "Submit Mission"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
