import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useGame } from '@/lib/store';
import { Mascot } from '@/components/Mascot';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { SUBJECTS, TOPICS } from '@/lib/data';
import { Check } from 'lucide-react';

const TOTAL_STEPS = 2;

const gradeGroups = [
  { label: '1st – 4th Standard', range: '🏴‍☠️ Ocean Pirate Adventure', worldName: 'Ocean Pirate Adventure', grades: [1, 2, 3, 4], theme: 'ocean', emoji: '🌊' },
  { label: '5th – 7th Standard', range: '🚀 Space Explorer', worldName: 'Space Explorer', grades: [5, 6, 7], theme: 'space', emoji: '🪐' },
  { label: '8th – 10th Standard', range: '🤖 Futuristic Mind Lab', worldName: 'Futuristic Mind Lab', grades: [8, 9, 10], theme: 'future', emoji: '⚡' },
];

export function Setup() {
  const [, setLocation] = useLocation();
  const { setProfile, setSelectedSubjects, setSelectedTopics, userName: savedName, grade: savedGrade } = useGame();
  
  const [step, setStep] = useState(1);
  // Pre-fill from login page (new user typed their name there)
  const pendingName = sessionStorage.getItem('pending_new_user') || savedName || '';
  const [name, setName] = useState(pendingName);
  const [gradeGroup, setGradeGroup] = useState<number | null>(null);
  const [grade, setGrade] = useState<number>(savedGrade || 3);
  const [issue, setIssue] = useState('');
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [selectedTopicMap, setSelectedTopicMap] = useState<Record<string, string[]>>({});
  const [showWorldMessage, setShowWorldMessage] = useState(false);
  const [selectedWorldName, setSelectedWorldName] = useState('');

  // Compute preview theme from selected grade group
  const previewTheme = gradeGroup !== null
    ? (gradeGroups[gradeGroup].theme as 'ocean' | 'space' | 'future')
    : undefined;

  // Apply theme class to body in real-time when grade group changes
  useEffect(() => {
    if (previewTheme) {
      document.body.className = `theme-${previewTheme}`;
    }
    return () => {
      // Cleanup will be handled by ThemeWrapper on next render
    };
  }, [previewTheme]);

  useEffect(() => {
    if (showWorldMessage) {
      const timer = setTimeout(() => {
        setProfile(name || 'Adventurer', grade, issue || 'general');
        setSelectedSubjects(selectedSubs);
        setSelectedTopics(selectedTopicMap);
        sessionStorage.removeItem('pending_new_user');
        setLocation('/timetable');
      }, 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showWorldMessage, name, grade, issue, selectedSubs, selectedTopicMap, setProfile, setSelectedSubjects, setSelectedTopics, setLocation]);

  const mascotMessages = [
    "Ahoy! What's your name, brave explorer?",
    "Which school standard are you in?",
    "What makes it hard to focus? We'll fix that!"
  ];

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setProfile(name || 'Adventurer', grade, issue);
      setSelectedSubjects(selectedSubs);
      setSelectedTopics(selectedTopicMap);
      sessionStorage.removeItem('pending_new_user');
      setLocation('/timetable');
    }
  };

  const toggleSubject = (id: string) => {
    setSelectedSubs(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleTopic = (subId: string, topicId: string) => {
    setSelectedTopicMap(prev => {
      const current = prev[subId] || [];
      const updated = current.includes(topicId) ? current.filter(t => t !== topicId) : [...current, topicId];
      return { ...prev, [subId]: updated };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return gradeGroup !== null;
      default: return true;
    }
  };

  const availableTopics = TOPICS.filter(t => selectedSubs.includes(t.subjectId));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {gradeGroup === null
        ? <AnimatedBackground forceDefault />
        : <AnimatedBackground themeOverride={previewTheme} />
      }
      {!showWorldMessage && <Mascot message={mascotMessages[step - 1]} />}

      {/* Full-screen world welcome message */}
      <AnimatePresence>
        {showWorldMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-none"
          >
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="text-white text-5xl md:text-7xl font-display font-bold text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            >
              Welcome to the {selectedWorldName} World
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full max-w-lg z-10 ${showWorldMessage ? 'opacity-0 pointer-events-none' : ''} transition-opacity duration-500`}>
        {/* Progress bar */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i < step ? 'bg-primary w-8' : i === step - 1 ? 'bg-primary w-8' : 'bg-white/20 w-4'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Hero Name */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel p-8 rounded-3xl">
              <h2 className="text-3xl font-display font-bold mb-6 text-center text-primary">Create Your Hero</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase">Hero Name</label>
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Captain Alex"
                    className="w-full bg-background border-2 border-border rounded-xl px-4 py-4 font-bold text-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                  />
                </div>
                <button onClick={handleNext} disabled={!canProceed()} className="game-button game-button-primary w-full py-4 text-xl mt-4 disabled:opacity-50 disabled:grayscale">
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Standard / Grade Group Selection */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel p-8 rounded-3xl">
              <h2 className="text-3xl font-display font-bold mb-6 text-center text-primary">Your Standard</h2>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {gradeGroups.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => { 
                      setGradeGroup(i); 
                      setGrade(g.grades[0]); 
                      setSelectedWorldName(g.worldName);
                      setShowWorldMessage(true);
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${gradeGroup === i ? 'border-primary bg-primary/15 scale-[1.02] shadow-lg shadow-primary/20' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{g.emoji}</span>
                      <div>
                        <p className="font-display font-bold text-lg">{g.label}</p>
                        <p className="text-sm text-muted-foreground font-bold">{g.range}</p>
                      </div>
                      {gradeGroup === i && <Check className="ml-auto w-6 h-6 text-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}



        </AnimatePresence>
      </div>
    </div>
  );
}
