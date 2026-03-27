import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useGame } from '@/lib/store';
import { Mascot } from '@/components/Mascot';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { SUBJECTS, TOPICS, FOCUS_ISSUES } from '@/lib/data';
import { Check } from 'lucide-react';

const TOTAL_STEPS = 3;

const gradeGroups = [
  { label: '1st – 4th Standard', range: '🏴‍☠️ Ocean Pirate Adventure', grades: [1, 2, 3, 4], theme: 'ocean', emoji: '🌊' },
  { label: '5th – 7th Standard', range: '🚀 Space Explorer', grades: [5, 6, 7], theme: 'space', emoji: '🪐' },
  { label: '8th – 10th Standard', range: '🤖 Futuristic Mind Lab', grades: [8, 9, 10], theme: 'future', emoji: '⚡' },
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
      case 3: return issue.length > 0;
      default: return true;
    }
  };

  const availableTopics = TOPICS.filter(t => selectedSubs.includes(t.subjectId));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <AnimatedBackground themeOverride={previewTheme} />
      <Mascot message={mascotMessages[step - 1]} />

      <div className="w-full max-w-lg z-10">
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
                    onClick={() => { setGradeGroup(i); setGrade(g.grades[0]); }}
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
              <div className="flex gap-3">
                <button onClick={() => setStep(step - 1)} className="game-button bg-white/15 backdrop-blur text-white border border-white/30 px-6 py-4 text-lg">Back</button>
                <button onClick={handleNext} disabled={!canProceed()} className="game-button game-button-primary flex-1 py-4 text-xl disabled:opacity-50">Continue</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Focus Issues */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel p-8 rounded-3xl">
              <h2 className="text-3xl font-display font-bold mb-6 text-center text-primary">Why do you lose focus?</h2>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {FOCUS_ISSUES.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setIssue(opt.id)}
                    className={`p-4 rounded-xl border-2 text-left font-bold transition-all duration-200 flex items-center gap-3 ${issue === opt.id ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span>{opt.label}</span>
                    {issue === opt.id && <Check className="ml-auto w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(step - 1)} className="game-button bg-white/15 backdrop-blur text-white border border-white/30 px-6 py-4 text-lg">Back</button>
                <button onClick={handleNext} disabled={!canProceed()} className="game-button game-button-primary flex-1 py-4 text-xl disabled:opacity-50">
                  🗺️ Enter World Map
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
