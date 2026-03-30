import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/store';
import { getGradeTheme, getMascotThemeProps } from '@/lib/data';

// ─── Config ───────────────────────────────────────────────────────
const NLB_URL = import.meta.env.VITE_AI_COMPANION_URL || 'http://localhost:3003';
const SESSION_KEY = 'fq_chat_session_id';
const SUMMARY_KEY  = 'fq_chat_summary';

// ─── Types ────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: string;
}

interface ContextSummary {
  active_quests: string[];
  focus_topics: string[];
  user_emotion: string;
  key_facts: string[];
}

// ─── Welcome message generator ───────────────────────────────────
function getWelcomeMessage(mascotName: string, userName: string): string {
  return `Welcome back to **Focus Quest**, ${userName || 'Hero'}! 🎮✨

I'm **${mascotName}**, your personal AI mentor and focus coach.

I remember everything we've worked on together, and I'm here to help you level up your learning journey! ⚔️💎

**What would you like to do today?**
- 📚 Study a subject?
- 🎯 Set a new focus goal?
- 💪 Get motivated?
- 🗺️ Check your progress?`;
}

// ─── Main Component ───────────────────────────────────────────────
export function AiGuideChat() {
  const { grade, userName, xp, streak } = useGame();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [contextSummary, setContextSummary] = useState<ContextSummary | null>(null);
  const [localStats, setLocalStats] = useState({ xp, streak, level: 1 });
  const [isConnected, setIsConnected] = useState(true); // NLB connectivity status

  const theme = getGradeTheme(grade);
  const { emoji: mascotEmoji, name: mascotName } = getMascotThemeProps(theme);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Restore session on mount ────────────────────────────────────
  useEffect(() => {
    const storedId = sessionStorage.getItem(SESSION_KEY);
    const storedSummary = sessionStorage.getItem(SUMMARY_KEY);
    if (storedId) {
      setChatId(storedId);
      if (storedSummary) {
        try { setContextSummary(JSON.parse(storedSummary)); } catch {}
      }
    }
  }, []);

  // ── Seed welcome message on first open ─────────────────────────
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        text: getWelcomeMessage(mascotName, userName),
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [open]);

  // ── Auto scroll ─────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Focus input when chat opens ─────────────────────────────────
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // ── Initialize (or restore) session on the NLB ─────────────────
  const ensureSession = useCallback(async (): Promise<string> => {
    // Validate existing session
    if (chatId) {
      try {
        const res = await fetch(`${NLB_URL}/api/chat/session/${chatId}`);
        if (res.ok) return chatId;
      } catch {}
    }

    // Create new session
    const res = await fetch(`${NLB_URL}/api/chat/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userName || 'anonymous',
        user_stats: { xp, streak, grade, mascotName, userName, level: localStats.level },
      }),
    });

    if (!res.ok) throw new Error('Failed to create session');
    const data = await res.json();
    sessionStorage.setItem(SESSION_KEY, data.chat_id);
    setChatId(data.chat_id);
    return data.chat_id;
  }, [chatId, xp, streak, grade, mascotName, userName, localStats.level]);

  // ── Send a message via NLB Stream ────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Create a placeholder for the bot's streaming reply
    const tempBotMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: '', // To be filled by stream
      timestamp: new Date().toISOString(),
      id: tempBotMsgId,
    } as any]);

    try {
      const activeChatId = await ensureSession();
      setIsConnected(true);

      const res = await fetch(`${NLB_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: activeChatId,
          message: text,
          user_stats: { xp, streak, grade, mascotName, userName, level: localStats.level },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      setLoading(false); // Hide the "thinking..." indicator early since stream is starting

      // Read SSE stream
      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let finalBotText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          // Split by SSE double newline
          const events = chunkStr.split("\n\n");
          
          for (const event of events) {
            if (event.startsWith("data: ")) {
              try {
                const dataObj = JSON.parse(event.replace("data: ", ""));
                
                if (dataObj.type === "meta" && dataObj.chat_id) {
                  if (dataObj.chat_id !== activeChatId) {
                     sessionStorage.setItem(SESSION_KEY, dataObj.chat_id);
                     setChatId(dataObj.chat_id);
                  }
                } else if (dataObj.type === "chunk") {
                  finalBotText += dataObj.text;
                  setMessages(prev => prev.map(m => 
                     (m as any).id === tempBotMsgId ? { ...m, text: finalBotText } : m
                  ));
                } else if (dataObj.type === "done") {
                  if (dataObj.context_summary) {
                    setContextSummary(dataObj.context_summary);
                    sessionStorage.setItem(SUMMARY_KEY, JSON.stringify(dataObj.context_summary));
                  }
                  if (dataObj.character_stats) {
                    setLocalStats(prev => ({ ...prev, ...dataObj.character_stats }));
                  }
                }
              } catch (e) {
                // Ignore parsing errors for partial chunks
              }
            }
          }
        }
      }

      // Check for logo change commands after stream completes
      const logoRegex = new RegExp('\\[CHANGE_LOGO:\\\\s*([^\\]]+)\\]');
      const logoMatch = finalBotText.match(logoRegex);
      if (logoMatch) {
         setMessages(prev => prev.map(m => 
            (m as any).id === tempBotMsgId ? { ...m, text: finalBotText.replace(logoRegex, '').trim() } : m
         ));
         sessionStorage.setItem('current_finny_logo', logoMatch[1]);
         window.dispatchEvent(new CustomEvent('finny_logo_change', { detail: logoMatch[1] }));
      }

    } catch (err: any) {
      console.error('[FocusQuest Chat] NLB Stream error:', err);
      setIsConnected(false);

      // ── Fallback: Direct Gemini API call if NLB is down ────────
      try {
        const fallbackReply = await callGeminiFallback(
          messages.concat(userMsg),
          text, grade, mascotName, userName, xp, streak
        );
        setMessages(prev => prev.map(m => 
           (m as any).id === tempBotMsgId ? { ...m, text: fallbackReply + '\n\n_(Offline mode — context not saved)_' } : m
        ));
      } catch {
        setMessages(prev => prev.map(m => 
           (m as any).id === tempBotMsgId ? { ...m, text: `Hmm, I'm having trouble connecting right now 🔌\n\nMake sure the AI Companion server is running:\n\`\`\`\npnpm --filter @workspace/ai-companion dev\n\`\`\`\n\nThen try again! 🚀` } : m
        ));
      }
    }

    setLoading(false);
  }, [input, loading, messages, chatId, ensureSession, xp, streak, grade, mascotName, userName, localStats]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Theme ─────────────────────────────────────────────────────
  const isJunior = grade <= 4;
  const isMid = grade > 4 && grade <= 7;
  const gradientClass = isJunior
    ? 'from-blue-500 via-cyan-400 to-teal-400'
    : isMid
    ? 'from-violet-600 via-purple-500 to-indigo-500'
    : 'from-rose-600 via-orange-500 to-amber-500';

  const panelBg = isJunior
    ? 'rgba(8, 25, 55, 0.97)'
    : isMid
    ? 'rgba(16, 8, 45, 0.97)'
    : 'rgba(20, 8, 8, 0.97)';

  const modeLabel = `${mascotName} · ${contextSummary?.user_emotion ?? 'Ready to learn'}`;

  // ─── Render ────────────────────────────────────────────────────
  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        id="ai-guide-fab"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full text-white text-2xl shadow-2xl flex items-center justify-center border-4 border-white/30"
        whileHover={{ scale: 1.12, rotate: 8 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(v => !v)}
        animate={{
          boxShadow: open
            ? '0 0 0 0px rgba(255,255,255,0)'
            : ['0 0 0 0px rgba(255,255,255,0.4)', '0 0 0 14px rgba(255,255,255,0)'],
        }}
        transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
      >
        <span className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradientClass} opacity-90`} />
        {/* NLB connectivity dot */}
        <span
          className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isConnected ? 'bg-green-400' : 'bg-red-500'}`}
          title={isConnected ? 'AI Companion Connected' : 'Offline Mode'}
        />
        <span className="relative z-10">{open ? '✕' : mascotEmoji}</span>
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
            className="fixed bottom-28 right-4 z-50 w-[340px] sm:w-[400px] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
            style={{ height: '560px', background: panelBg, backdropFilter: 'blur(24px)' }}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${gradientClass} px-4 py-3 flex items-center gap-3`}>
              <span className="text-2xl">{mascotEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-sm leading-tight truncate">FocusQuest AI Guide</p>
                <p className="text-white/75 text-[11px] truncate">{modeLabel}</p>
              </div>
              <div className="flex gap-2 text-xs font-black">
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full">⭐ {localStats.xp} XP</span>
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full">Lv.{localStats.level}</span>
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full">🔥 {localStats.streak}</span>
              </div>
            </div>

            {/* Context Summary Badge */}
            {contextSummary && contextSummary.focus_topics.length > 0 && (
              <div className="px-3 py-1.5 bg-white/5 border-b border-white/10 flex gap-1.5 flex-wrap">
                {contextSummary.focus_topics.slice(0, 3).map((topic, i) => (
                  <span key={i} className="text-[10px] bg-white/15 text-white/70 px-2 py-0.5 rounded-full">
                    📚 {topic}
                  </span>
                ))}
              </div>
            )}

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
                      <span className="mr-2 mt-1 text-lg flex-shrink-0">{mascotEmoji}</span>
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

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 pl-2"
                >
                  <span className="text-lg">{mascotEmoji}</span>
                  <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-2.5 flex gap-1.5">
                    {[0, 1, 2].map(n => (
                      <motion.span
                        key={n}
                        className="w-2 h-2 rounded-full bg-white/60"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: n * 0.15 }}
                      />
                    ))}
                  </div>
                  <span className="text-white/30 text-[10px]">thinking...</span>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-4 pt-2 border-t border-white/10 flex gap-2 items-end">
              <textarea
                id="ai-guide-input"
                ref={inputRef as any}
                rows={1}
                className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-2xl px-4 py-2.5 text-sm font-medium outline-none border border-white/10 focus:border-white/30 transition-colors resize-none"
                placeholder="Ask me anything! ✨"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{ maxHeight: '100px', overflowY: 'auto' }}
              />
              <motion.button
                id="ai-guide-send"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg transition-opacity flex-shrink-0 ${
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

// ─── Fallback: Direct Gemini API (when NLB is offline) ────────────────
const GEMINI_FALLBACK_KEYS: string[] = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3,
].filter(Boolean);

async function callGeminiFallback(
  history: Message[],
  userMessage: string,
  grade: number,
  mascotName: string,
  userName: string,
  xp: number,
  streak: number
): Promise<string> {
  const contents = [
    ...history.filter((_, i) => !(i === 0 && history[0].role === 'assistant')).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const sysPrompt = `You are ${mascotName}, the AI mentor in Focus Quest. 
User: ${userName}, Grade ${grade}, XP: ${xp}, Streak: ${streak}.
Be encouraging, gamified, and educational. Always end with a question.`;

  for (const apiKey of GEMINI_FALLBACK_KEYS) {
    for (const model of ['gemini-2.5-flash', 'gemini-1.5-flash']) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: sysPrompt }] },
              contents,
              generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
            }),
          }
        );
        if (!res.ok) continue;
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch { continue; }
    }
  }
  throw new Error('All fallback keys exhausted');
}
