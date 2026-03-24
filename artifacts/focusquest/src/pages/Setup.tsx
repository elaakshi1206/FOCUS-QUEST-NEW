import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useGame } from '@/lib/store';
import { Mascot } from '@/components/Mascot';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export function Setup() {
  const [, setLocation] = useLocation();
  const { setProfile, userName: savedName, grade: savedGrade } = useGame();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState(savedName || '');
  const [grade, setGrade] = useState<number>(savedGrade || 3);
  const [issue, setIssue] = useState('');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setProfile(name || 'Adventurer', grade, issue);
      setLocation('/map');
    }
  };

  const focusIssues = [
    { id: 'bored', label: 'I get bored easily 😴' },
    { id: 'distracted', label: 'My phone distracts me 📱' },
    { id: 'hard', label: 'The topics are too hard 🤯' },
    { id: 'long', label: "I can't sit still for long 🏃" }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <AnimatedBackground />
      
      <Mascot message={
        step === 1 ? "Ahoy! What's your name and grade?" :
        step === 2 ? "What makes it hard to focus? We'll fix it!" :
        "Ready to set sail?"
      } />

      <div className="w-full max-w-md z-10">
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-primary w-8' : 'bg-white/20 w-4'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-8 rounded-3xl"
            >
              <h2 className="text-3xl font-display font-bold mb-6 text-center text-primary">Create Your Hero</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase">Hero Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Captain Alex"
                    className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 font-bold text-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase">School Grade (1-10)</label>
                  <div className="flex items-center gap-4 bg-background border-2 border-border rounded-xl p-2">
                    <input 
                      type="range" min="1" max="10" 
                      value={grade} onChange={(e) => setGrade(parseInt(e.target.value))}
                      className="flex-1 accent-primary"
                    />
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-display font-bold text-xl">
                      {grade}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Grades 1-4: Ocean | Grades 5-7: Space | Grades 8-10: Cyber
                  </p>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!name.trim()}
                  className="game-button game-button-primary w-full py-4 text-xl mt-4 disabled:opacity-50 disabled:grayscale"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-8 rounded-3xl"
            >
              <h2 className="text-3xl font-display font-bold mb-6 text-center text-primary">Your Challenge</h2>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                {focusIssues.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setIssue(opt.id)}
                    className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${issue === opt.id ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleNext}
                disabled={!issue}
                className="game-button game-button-primary w-full py-4 text-xl disabled:opacity-50"
              >
                Almost There!
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-8 rounded-3xl text-center"
            >
              <div className="text-6xl mb-6 animate-bounce">🗺️</div>
              <h2 className="text-3xl font-display font-bold mb-4 text-primary">Ready to Explore?</h2>
              <p className="text-muted-foreground font-bold mb-8">
                Your world has been generated based on your grade. Let's find some quests and earn XP!
              </p>

              <button 
                onClick={handleNext}
                className="game-button game-button-primary w-full py-4 text-xl"
              >
                Enter World Map
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
