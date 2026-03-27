import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/store';
import { AI_GUIDE_SYSTEM_PROMPT } from '@/lib/aiGuidePrompt';

// ─── Types ───────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  text: string;
}

// ─── Grade → game label ──────────────────────────────────
function getGameModeLabel(grade: number): string {
  if (grade <= 4) return '🐠 Sea World AI Tutor';
  if (grade <= 7) return '🚀 Space AI Tutor';
  return '👾 Robotics AI Tutor';
}

function getMissionEmoji(grade: number): string {
  if (grade <= 4) return '🐠';
  if (grade <= 7) return '🚀';
  return '👾';
}

// ─── Finny's Starting Message ─────────────────────────────
const FINNY_STARTING_MESSAGE = `Hi hi hi! 👋 I'm Finny the Focus Friend! Welcome to Focus Quest! 
To give you the best help and fun avatar, please tell me your standard:
🌊 1st to 4th Std (Sea World)
🚀 5th to 7th Std (Space Adventure)
🤖 8th to 10th Std (Robotics & AI)

Which one are you in? Let's start our learning adventure!`;

// ─── Gemini API key pool (auto-rotates on quota errors) ──
const GEMINI_API_KEYS: string[] = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3,
  import.meta.env.VITE_GEMINI_API_KEY_4,
  import.meta.env.VITE_GEMINI_API_KEY_5,
  import.meta.env.VITE_GEMINI_API_KEY_6,
  import.meta.env.VITE_GEMINI_API_KEY_7,
  import.meta.env.VITE_GEMINI_API_KEY_8,
  import.meta.env.VITE_GEMINI_API_KEY_9,
  import.meta.env.VITE_GEMINI_API_KEY_10,
  import.meta.env.VITE_GEMINI_API_KEY_11,
  import.meta.env.VITE_GEMINI_API_KEY_12,
  import.meta.env.VITE_GEMINI_API_KEY_13,
  import.meta.env.VITE_GEMINI_API_KEY_14,
  import.meta.env.VITE_GEMINI_API_KEY_15,
  import.meta.env.VITE_GEMINI_API_KEY_16,
].filter(Boolean);

// ─── Gemini API call ─────────────────────────────────────
async function callGemini(
  history: Message[],
  userMessage: string,
  grade: number
): Promise<string> {
  if (GEMINI_API_KEYS.length === 0) {
    return "I'm having trouble connecting right now. But let's keep going! 🚀\n\nIs there anything else I can help you with?";
  }

  const filteredHistory = history.filter((_, idx) => !(idx === 0 && history[0].role === 'assistant'));
  const contents = [
    ...filteredHistory.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const apiKey = GEMINI_API_KEYS[i];
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: AI_GUIDE_SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
          }),
        }
      );

      if (res.status === 429) { continue; }
      if (!res.ok) { continue; }

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm here to help, explorer! 🚀\n\nDo you need help with anything else?";
    } catch {
      continue;
    }
  }

  return "I'm ready for your next question, explorer! 🚀\n\nIs there anything else I can help you with?";
}

// ─── Main Component ───────────────────────────────────────
export function AiGuideChat() {
  const { grade, userName, xp, streak } = useGame();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Local state to keep track of gamification from chatting
  const [xpPoints, setXpPoints] = useState(xp);
  const [focusStreak, setFocusStreak] = useState(streak);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Helper: add a bot message ──────────────────────────
  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { role: 'assistant', text }]);
  };

  // ── Seed welcome message on first open ────────────────
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', text: FINNY_STARTING_MESSAGE }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Main send handler ─────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Call Gemini as a conversational AI tutor
    try {
      let reply = await callGemini(messages, text, grade);

      // Parse and apply standard logo change command if generated
      const logoMatch = reply.match(/\[CHANGE_LOGO:\s*([^\]]+)\]/);
      if (logoMatch) {
        reply = reply.replace(/\[CHANGE_LOGO:[^\]]+\]/, '').trim();
        sessionStorage.setItem('current_finny_logo', logoMatch[1]);
        window.dispatchEvent(new CustomEvent('finny_logo_change', { detail: logoMatch[1] }));
      }

      // Add safety fallback if the AI somehow forgot to add a follow-up
      const hasFollowUp = reply.includes('?') || reply.toLowerCase().includes('help');
      if (!hasFollowUp) {
        reply += '\n\nIs there anything else I can help you with?';
      }

      addBotMessage(reply);

      // Standard gamification for interacting with the tutor
      setXpPoints(prev => prev + 5);
      
      // Update streak once per few interactions, simulated simple logic
      if (Math.random() > 0.5) setFocusStreak(prev => prev + 1);

    } catch {
      addBotMessage("Hmm, I'm having a little trouble thinking of the answer right now, but I'm back!\n\nWhat else would you like to learn about? 🎮");
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Theme colours based on grade
  const isJunior = grade <= 4;
  const isMid = grade > 4 && grade <= 7;
  const gradientClass = isJunior
    ? 'from-blue-500 via-cyan-400 to-teal-400'
    : isMid
    ? 'from-violet-600 via-purple-500 to-indigo-500'
    : 'from-rose-600 via-orange-500 to-amber-500';

  const panelBg = isJunior
    ? 'rgba(10, 30, 60, 0.96)'
    : isMid
    ? 'rgba(20, 10, 50, 0.96)'
    : 'rgba(20, 10, 10, 0.96)';

  const fabEmoji = getMissionEmoji(grade);
  const modeLabel = getGameModeLabel(grade);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        id="ai-guide-fab"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full text-white text-2xl shadow-2xl flex items-center justify-center border-4 border-white/30"
        style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
        whileHover={{ scale: 1.12, rotate: 8 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(v => !v)}
        animate={{ boxShadow: open ? '0 0 0 0px rgba(255,255,255,0)' : ['0 0 0 0px rgba(255,255,255,0.4)', '0 0 0 12px rgba(255,255,255,0)'] }}
        transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
      >
        <span
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradientClass} opacity-90`}
        />
        <span className="relative z-10">{open ? '✕' : fabEmoji}</span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="guide-panel"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="fixed bottom-28 right-4 z-50 w-[340px] sm:w-[380px] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
            style={{ height: '520px', background: panelBg }}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${gradientClass} px-4 py-3 flex items-center gap-3`}>
              <span className="text-2xl">{fabEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-sm leading-tight truncate">
                  FocusQuest AI Guide
                </p>
                <p className="text-white/75 text-[11px] truncate">{modeLabel}</p>
              </div>
              {/* XP & Streak mini-HUD */}
              <div className="flex gap-2 text-xs font-black">
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full">⭐ {xpPoints} XP</span>
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full">🔥 {focusStreak}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scrollbar-thin">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <span className="mr-2 mt-1 text-lg flex-shrink-0">{fabEmoji}</span>
                    )}
                    <div
                      className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed font-medium ${
                        msg.role === 'user'
                          ? `bg-gradient-to-br ${gradientClass} text-white rounded-br-sm`
                          : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/10'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 pl-2"
                >
                  <span className="text-lg">{fabEmoji}</span>
                  <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-2 flex gap-1.5">
                    {[0, 1, 2].map(n => (
                      <motion.span
                        key={n}
                        className="w-2 h-2 rounded-full bg-white/60"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: n * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-white/10 flex gap-2">
              <input
                id="ai-guide-input"
                className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-2xl px-4 py-2.5 text-sm font-medium outline-none border border-white/10 focus:border-white/30 transition-colors"
                placeholder="Ask me a question! ✨"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <motion.button
                id="ai-guide-send"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg transition-opacity ${
                  loading || !input.trim() ? 'opacity-40 cursor-not-allowed' : 'opacity-100'
                } bg-gradient-to-br ${gradientClass}`}
              >
                ➤
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
