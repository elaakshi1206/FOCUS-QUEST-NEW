import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useGame } from '@/lib/store';
import { getGradeTheme } from '@/lib/data';
import { AnimatedBackground } from '@/components/AnimatedBackground';

// ── types ──────────────────────────────────────────────────────────
interface TimeBlock {
  label: string;
  time: string;
  duration: number; // minutes
  type: 'school' | 'meal' | 'play' | 'break' | 'activity' | 'focus' | 'sleep';
  subject?: string;
  focusPoints?: number;
  icon: string;
}

const SUBJECT_CHIPS = [
  { id: 'Math', icon: '🔢', color: 'bg-blue-500/20 border-blue-400/40 text-blue-300' },
  { id: 'Science', icon: '🔬', color: 'bg-green-500/20 border-green-400/40 text-green-300' },
  { id: 'English', icon: '📚', color: 'bg-purple-500/20 border-purple-400/40 text-purple-300' },
  { id: 'Hindi', icon: '🪔', color: 'bg-orange-500/20 border-orange-400/40 text-orange-300' },
  { id: 'EVS', icon: '🌿', color: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' },
  { id: 'Social Studies', icon: '🌍', color: 'bg-amber-500/20 border-amber-400/40 text-amber-300' },
  { id: 'Computer', icon: '💻', color: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300' },
  { id: 'Sanskrit', icon: '📜', color: 'bg-rose-500/20 border-rose-400/40 text-rose-300' },
];

const HIGH_SCHOOL_SUBJECT_CHIPS = [
  { id: 'Mathematics', icon: '➗', color: 'bg-blue-500/20 border-blue-400/40 text-blue-300' },
  { id: 'Physics', icon: '⚛️', color: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300' },
  { id: 'Chemistry', icon: '🧪', color: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' },
  { id: 'Biology', icon: '🧬', color: 'bg-lime-500/20 border-lime-400/40 text-lime-300' },
  { id: 'English', icon: '📚', color: 'bg-purple-500/20 border-purple-400/40 text-purple-300' },
  { id: 'Computer Science', icon: '💻', color: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300' },
  { id: 'History', icon: '🌍', color: 'bg-amber-500/20 border-amber-400/40 text-amber-300' },
];

const ACTIVITY_CHIPS = [
  { id: 'Sports', icon: '⚽' },
  { id: 'Tuition', icon: '📖' },
  { id: 'Music', icon: '🎵' },
  { id: 'Dance', icon: '💃' },
  { id: 'Drawing', icon: '🎨' },
  { id: 'Robotics Club', icon: '🤖' },
  { id: 'Karate', icon: '🥋' },
  { id: 'Swimming', icon: '🏊' },
];

const REFERRAL_SOURCES = [
  'School Teacher', 'Friend', 'Parent', 'Instagram', 'YouTube', 'Google', 'Other'
];

const BLOCK_COLORS: Record<TimeBlock['type'], string> = {
  school:   'from-sky-500/30   to-sky-600/20   border-sky-400/40',
  meal:     'from-amber-500/30 to-amber-600/20 border-amber-400/40',
  play:     'from-pink-500/30  to-pink-600/20  border-pink-400/40',
  break:    'from-slate-500/30 to-slate-600/20 border-slate-400/40',
  activity: 'from-violet-500/30 to-violet-600/20 border-violet-400/40',
  focus:    'from-primary/30   to-primary/10   border-primary/50',
  sleep:    'from-indigo-900/40 to-indigo-800/20 border-indigo-400/20',
};

const BLOCK_ICONS: Record<TimeBlock['type'], string> = {
  school:   '🏫',
  meal:     '🍽️',
  play:     '🎮',
  break:    '☕',
  activity: '🏃',
  focus:    '⚡',
  sleep:    '😴',
};

// ── timetable generator ───────────────────────────────────────────
function generateTimetable(
  schoolEndHour: number,
  subjects: string[],
  peakFocus: 'morning' | 'afterschool' | 'evening',
  activities: string[],
  extraMinutes: number,
  theme: 'ocean' | 'space' | 'future',
): TimeBlock[] {
  const sessionLen = theme === 'ocean' ? 20 : theme === 'space' ? 30 : 45;
  const breakLen   = theme === 'ocean' ? 10 : theme === 'space' ? 10 : 15;

  const focusSubs = subjects.length ? subjects : ['Math', 'Science', 'English'];
  // harder subjects first during peak
  const hard = focusSubs.filter(s => ['Math', 'Science', 'Computer'].includes(s));
  const easy = focusSubs.filter(s => !hard.includes(s));
  const orderedSubs = [...hard, ...easy, ...hard, ...easy, ...hard, ...easy];

  const blocks: TimeBlock[] = [];

  // Sleep
  blocks.push({ label: 'Sleep & Wake Up', time: '6:00 AM', duration: 30, type: 'sleep', icon: '😴' });
  // Morning routine
  blocks.push({ label: 'Morning Routine', time: '6:30 AM', duration: 30, type: 'break', icon: '🌅' });

  // Morning focus if peak = morning
  let subIdx = 0;
  if (peakFocus === 'morning') {
    const s1 = orderedSubs[subIdx++ % orderedSubs.length];
    blocks.push({ label: `Focus Quest – ${s1}`, time: '7:00 AM', duration: sessionLen, type: 'focus', subject: s1, focusPoints: Math.round(sessionLen * 3.5), icon: '⚡' });
    blocks.push({ label: 'Break', time: `7:${String(sessionLen).padStart(2,'0')} AM`, duration: breakLen, type: 'break', icon: '☕' });
  }

  // Breakfast
  blocks.push({ label: 'Breakfast', time: '8:00 AM', duration: 30, type: 'meal', icon: '🥞' });
  // School
  const schoolEndLabel = schoolEndHour >= 12 ? `${schoolEndHour > 12 ? schoolEndHour - 12 : schoolEndHour}:00 PM` : `${schoolEndHour}:00 AM`;
  blocks.push({ label: 'School Time', time: '8:30 AM', duration: (schoolEndHour - 8) * 60 - 30, type: 'school', icon: '🏫' });

  // Lunch
  blocks.push({ label: 'Lunch & Rest', time: schoolEndLabel, duration: 60, type: 'meal', icon: '🍱' });

  // After-school activities
  let curHour = schoolEndHour + 1;
  for (const act of activities) {
    blocks.push({
      label: act,
      time: `${curHour > 12 ? curHour - 12 : curHour}:00 PM`,
      duration: 60,
      type: 'activity',
      icon: ACTIVITY_CHIPS.find(a => a.id === act)?.icon ?? '🏃',
    });
    curHour++;
  }

  // After-school focus
  if (peakFocus === 'afterschool') {
    const numSessions = Math.floor(extraMinutes / (sessionLen + breakLen));
    for (let i = 0; i < Math.max(numSessions, 1); i++) {
      const s = orderedSubs[subIdx++ % orderedSubs.length];
      const h = curHour > 12 ? curHour - 12 : curHour;
      blocks.push({ label: `Focus Quest – ${s}`, time: `${h}:00 PM`, duration: sessionLen, type: 'focus', subject: s, focusPoints: Math.round(sessionLen * 3.5), icon: '⚡' });
      blocks.push({ label: 'Break', time: `${h}:${String(sessionLen).padStart(2,'0')} PM`, duration: breakLen, type: 'break', icon: '☕' });
      curHour++;
    }
  }

  // Play / free time
  blocks.push({ label: 'Free Play & Creativity', time: `${curHour > 12 ? curHour - 12 : curHour}:00 PM`, duration: 60, type: 'play', icon: '🎮' });
  curHour++;

  // Dinner
  blocks.push({ label: 'Dinner with Family', time: `${curHour > 12 ? curHour - 12 : curHour}:00 PM`, duration: 45, type: 'meal', icon: '🍛' });
  curHour++;

  // Evening focus
  if (peakFocus === 'evening') {
    const numSessions = Math.floor(extraMinutes / (sessionLen + breakLen));
    for (let i = 0; i < Math.max(numSessions, 1); i++) {
      const s = orderedSubs[subIdx++ % orderedSubs.length];
      const h = curHour > 12 ? curHour - 12 : curHour;
      blocks.push({ label: `Focus Quest – ${s}`, time: `${h}:00 PM`, duration: sessionLen, type: 'focus', subject: s, focusPoints: Math.round(sessionLen * 3.5), icon: '⚡' });
      blocks.push({ label: 'Break', time: `${h}:${String(sessionLen).padStart(2,'0')} PM`, duration: breakLen, type: 'break', icon: '☕' });
      curHour++;
    }
  } else if (peakFocus !== 'afterschool') {
    // fallback evening revision
    const s = orderedSubs[subIdx++ % orderedSubs.length];
    blocks.push({ label: `Revision – ${s}`, time: `${curHour > 12 ? curHour - 12 : curHour}:00 PM`, duration: sessionLen, type: 'focus', subject: s, focusPoints: Math.round(sessionLen * 2), icon: '⚡' });
    curHour++;
  }

  // Wind-down
  blocks.push({ label: 'Wind Down & Reading', time: `${curHour > 12 ? curHour - 12 : curHour}:00 PM`, duration: 30, type: 'break', icon: '📖' });
  // Sleep
  blocks.push({ label: 'Sleep', time: '10:00 PM', duration: 0, type: 'sleep', icon: '🌙' });

  return blocks;
}

// ── theme config ──────────────────────────────────────────────────
const THEME_CONFIG = {
  ocean: {
    name: 'Sea World',
    mascot: '🐬',
    badge: '🌊 Grades 1–4',
    btnText: 'Create My Sea World Timetable! 🌊✨',
    btnClass: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400',
    heroGradient: 'from-cyan-400/20 via-blue-500/10 to-teal-400/20',
    accent: '#06b6d4',
    sessionLabel: '15–25 min sessions',
  },
  space: {
    name: 'Space Adventure',
    mascot: '🚀',
    badge: '🪐 Grades 5–7',
    btnText: 'Create My Space Timetable! 🚀✨',
    btnClass: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500',
    heroGradient: 'from-violet-500/20 via-purple-600/10 to-indigo-500/20',
    accent: '#8b5cf6',
    sessionLabel: '25–40 min sessions',
  },
  future: {
    name: 'Robotics & AI',
    mascot: '🤖',
    badge: '⚡ Grades 8–10',
    btnText: 'Create My Robotics Timetable! 🤖✨',
    btnClass: 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400',
    heroGradient: 'from-emerald-400/20 via-cyan-500/10 to-teal-400/20',
    accent: '#10b981',
    sessionLabel: '35–50 min sessions',
  },
};

// ── Generate Button Animation overlay ────────────────────────────
function BubbleAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full bg-white/20"
          style={{
            width: `${8 + Math.random() * 16}px`,
            height: `${8 + Math.random() * 16}px`,
            left: `${10 + i * 11}%`,
            animation: `rise ${2 + i * 0.4}s ${i * 0.3}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

function RocketAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none flex items-end justify-around pb-0">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="text-lg opacity-60"
          style={{
            animation: `rocketLaunch ${1.5 + i * 0.3}s ${i * 0.4}s ease-out infinite`,
          }}
        >
          🚀
        </div>
      ))}
    </div>
  );
}

function GearAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none flex items-center justify-around">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="text-2xl opacity-30"
          style={{
            animation: `spin ${(2 + i) * 0.8}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }}
        >
          ⚙️
        </div>
      ))}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────
export function TimetableBuilder() {
  const [, setLocation] = useLocation();
  const { grade, focusHistory, addCustomSubject: saveSubject } = useGame();
  const theme = getGradeTheme(grade);
  const cfg = THEME_CONFIG[theme];

  const avgFocusScore = focusHistory.length
    ? Math.round(focusHistory.reduce((s, h) => s + h.score, 0) / focusHistory.length)
    : 0;

  const currentSubjectChips = grade >= 8 ? HIGH_SCHOOL_SUBJECT_CHIPS : SUBJECT_CHIPS;

  // Form state
  const [schoolEndHour, setSchoolEndHour] = useState(15);
  const [selectedSubs, setSelectedSubs] = useState<string[]>(() => grade >= 8 ? ['Mathematics', 'Physics', 'Chemistry'] : ['Math', 'Science', 'English']);
  const [customSub, setCustomSub] = useState('');
  const [peakFocus, setPeakFocus] = useState<'morning' | 'afterschool' | 'evening'>('afterschool');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');
  const [extraMinutes, setExtraMinutes] = useState(60);
  const [focusScore, setFocusScore] = useState(avgFocusScore.toString());
  const [referral, setReferral] = useState('');
  const [timetable, setTimetable] = useState<TimeBlock[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Togglers
  const toggleSub = (id: string) =>
    setSelectedSubs(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const toggleAct = (id: string) =>
    setSelectedActivities(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const addCustomSub = () => {
    if (customSub.trim()) {
      const subject = customSub.trim();
      setSelectedSubs(p => [...p, subject]);
      saveSubject(subject);
      setCustomSub('');
    }
  };
  const addCustomAct = () => {
    if (customActivity.trim()) { setSelectedActivities(p => [...p, customActivity.trim()]); setCustomActivity(''); }
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const tt = generateTimetable(schoolEndHour, selectedSubs, peakFocus, selectedActivities, extraMinutes, theme);
      setTimetable(tt);
      setGenerating(false);
      setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, 1200);
  };

  const handleDownloadImage = () => alert('📸 Download as Image – coming soon! (Requires html2canvas)');
  const handleDownloadPDF   = () => alert('📄 Download as PDF – coming soon! (Requires jsPDF)');
  const handleSave          = () => alert('✅ Timetable saved to My Quests!');

  const firstSubjectId = selectedSubs[0]?.toLowerCase().replace(/\s+/g, '') || 'math';

  return (
    <div className="min-h-screen relative pb-24">
      <AnimatedBackground />

      {/* ── HERO ── */}
      <div className={`relative py-12 px-6 text-center bg-gradient-to-br ${cfg.heroGradient}`}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Theme badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-bold mb-4">
            <span>{cfg.mascot}</span>
            <span>{cfg.badge}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 gradient-text">
            Let's Build Your Perfect Timetable! ✨
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-bold">
            Tell us a few things about your day and we'll create a super fun study plan for you.
          </p>

          {/* Mascot row */}
          <div className="flex justify-center mt-6 gap-6">
            {['📚','⭐',cfg.mascot,'⭐','📚'].map((e, i) => (
              <motion.span
                key={i}
                className="text-3xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              >
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── FORM ── */}
      <div className="max-w-2xl mx-auto px-4 mt-8 space-y-6">

        {/* ── School End Time ── */}
        <motion.div className="glass-panel rounded-3xl p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🕒</span>
            <h2 className="text-xl font-display font-bold">School End Time</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {[13,14,15,16,17,18].map(h => (
              <button
                key={h}
                onClick={() => setSchoolEndHour(h)}
                className={`rounded-2xl py-3 font-bold text-sm border-2 transition-all duration-200 ${
                  schoolEndHour === h
                    ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-lg shadow-primary/30'
                    : 'bg-background/40 border-border hover:border-primary/50'
                }`}
              >
                {h > 12 ? `${h-12}:00 PM` : '12:00 PM'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Subjects ── */}
        <motion.div className="glass-panel rounded-3xl p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📖</span>
            <h2 className="text-xl font-display font-bold">Main Subjects This Week</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {currentSubjectChips.map(s => (
              <button
                key={s.id}
                onClick={() => toggleSub(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm transition-all duration-200 ${
                  selectedSubs.includes(s.id)
                    ? 'bg-primary/20 border-primary scale-105 shadow-md shadow-primary/20 text-foreground'
                    : `${s.color} hover:scale-102`
                }`}
              >
                {s.icon} {s.id}
                {selectedSubs.includes(s.id) && <span className="text-xs">✓</span>}
              </button>
            ))}
            {/* Custom subjects added */}
            {selectedSubs.filter(s => !currentSubjectChips.find(c => c.id === s)).map(s => (
              <button
                key={s}
                onClick={() => toggleSub(s)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 bg-accent/20 border-accent font-bold text-sm"
              >
                ✏️ {s} ✓
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <input
              value={customSub}
              onChange={e => setCustomSub(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomSub()}
              placeholder="Add your own subject…"
              className="flex-1 bg-background/40 border-2 border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all"
            />
            <button onClick={addCustomSub} className="game-button game-button-primary px-4 py-2 text-sm">+ Add</button>
          </div>
        </motion.div>

        {/* ── Peak Focus Time ── */}
        <motion.div className="glass-panel rounded-3xl p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🧠</span>
            <h2 className="text-xl font-display font-bold">When Do You Focus Best?</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {([
              { key: 'morning', emoji: '🌅', label: 'Morning', sub: '6–8 AM' },
              { key: 'afterschool', emoji: '🏠', label: 'After School', sub: 'Post lunch' },
              { key: 'evening', emoji: '🌙', label: 'Evening', sub: '7–9 PM' },
            ] as const).map(opt => (
              <button
                key={opt.key}
                onClick={() => setPeakFocus(opt.key)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 font-bold transition-all duration-300 ${
                  peakFocus === opt.key
                    ? 'border-primary bg-primary/15 scale-105 shadow-xl shadow-primary/20'
                    : 'border-border bg-background/30 hover:border-primary/40'
                }`}
              >
                <span className="text-4xl">{opt.emoji}</span>
                <span className="text-sm">{opt.label}</span>
                <span className="text-xs text-muted-foreground">{opt.sub}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Fixed Activities ── */}
        <motion.div className="glass-panel rounded-3xl p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏃</span>
            <h2 className="text-xl font-display font-bold">Any Fixed Activities?</h2>
            <span className="text-xs text-muted-foreground">(optional)</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {ACTIVITY_CHIPS.map(a => (
              <button
                key={a.id}
                onClick={() => toggleAct(a.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm transition-all duration-200 ${
                  selectedActivities.includes(a.id)
                    ? 'bg-secondary/20 border-secondary scale-105'
                    : 'bg-background/30 border-border hover:border-secondary/50'
                }`}
              >
                {a.icon} {a.id}
                {selectedActivities.includes(a.id) && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <input
              value={customActivity}
              onChange={e => setCustomActivity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomAct()}
              placeholder="Add your own activity…"
              className="flex-1 bg-background/40 border-2 border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all"
            />
            <button onClick={addCustomAct} className="game-button game-button-secondary px-4 py-2 text-sm">+ Add</button>
          </div>
        </motion.div>

        {/* ── Study Time Slider ── */}
        <motion.div className="glass-panel rounded-3xl p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⏱️</span>
            <h2 className="text-xl font-display font-bold">Extra Study Time Daily</h2>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">30 min</span>
            <div className="text-center">
              <span className="text-3xl font-display font-bold text-primary">
                {extraMinutes >= 60 ? `${Math.floor(extraMinutes/60)}h ${extraMinutes%60 > 0 ? extraMinutes%60+'m' : ''}` : `${extraMinutes}m`}
              </span>
              <p className="text-xs text-muted-foreground mt-1">{cfg.sessionLabel}</p>
            </div>
            <span className="text-sm text-muted-foreground">2 hrs</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min={30} max={120} step={15}
              value={extraMinutes}
              onChange={e => setExtraMinutes(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-lg mt-2">
              {['😤','😊','🔥','💪','🚀'].map((e,i) => (
                <span key={i} className={`transition-all duration-200 ${Math.floor((extraMinutes-30)/22.5) >= i ? 'opacity-100 scale-125' : 'opacity-30'}`}>{e}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Focus Score & Referral ── */}
        <motion.div className="glass-panel rounded-3xl p-6 grid sm:grid-cols-2 gap-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎯</span>
              <label className="font-bold">Current Focus Score</label>
            </div>
            <input
              type="number"
              value={focusScore}
              onChange={e => setFocusScore(e.target.value)}
              placeholder="e.g. 72"
              min={0} max={100}
              className="w-full bg-background/40 border-2 border-border rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-primary transition-all"
            />
            {focusHistory.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">✓ Auto-filled from your history</p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📣</span>
              <label className="font-bold">How did you find us?</label>
            </div>
            <select
              value={referral}
              onChange={e => setReferral(e.target.value)}
              className="w-full bg-background/40 border-2 border-border rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-primary transition-all"
            >
              <option value="">Select…</option>
              {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </motion.div>

        {/* ── GENERATE BUTTON ── */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`relative w-full py-6 rounded-2xl text-white font-display font-bold text-2xl shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden ${cfg.btnClass} disabled:opacity-70`}
            style={{ boxShadow: `0 8px 32px ${cfg.accent}55` }}
          >
            {theme === 'ocean' && <BubbleAnimation />}
            {theme === 'space' && <RocketAnimation />}
            {theme === 'future' && <GearAnimation />}

            <span className="relative z-10">
              {generating ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin text-2xl">⚙️</span>
                  Building your perfect timetable…
                </span>
              ) : cfg.btnText}
            </span>
          </button>
        </motion.div>

        {/* ── TIMETABLE PREVIEW ── */}
        <AnimatePresence>
          {timetable && (
            <motion.div
              ref={previewRef}
              key="timetable"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-panel rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-display font-bold gradient-text">Your Daily Focus Quest Plan {cfg.mascot}</h2>
                  <p className="text-sm text-muted-foreground">Tap any Focus Quest block to self-rate after completing!</p>
                </div>
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                  {timetable.filter(b => b.type === 'focus').length} Focus Sessions
                </span>
              </div>

              <div className="space-y-3">
                {timetable.map((block, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r border-l-4 ${BLOCK_COLORS[block.type]} cursor-pointer hover:scale-[1.01] transition-transform duration-200`}
                  >
                    {/* Time */}
                    <div className="text-center min-w-[70px]">
                      <p className="text-xs font-bold text-muted-foreground">{block.time}</p>
                      {block.duration > 0 && <p className="text-xs text-muted-foreground">{block.duration}m</p>}
                    </div>

                    {/* Icon */}
                    <span className="text-2xl">{block.icon}</span>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="font-bold text-sm">{block.label}</p>
                      {block.type === 'focus' && block.focusPoints && (
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 font-bold text-primary">
                            +{block.focusPoints} Focus Points ⚡
                          </span>
                          <span className="text-xs text-muted-foreground">Rate yourself after!</span>
                        </div>
                      )}
                    </div>

                    {/* Duration bar */}
                    {block.duration > 0 && (
                      <div className="hidden sm:block w-24">
                        <div className="bg-white/10 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${Math.min(100, (block.duration / 90) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-right mt-1">{block.duration}m</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Total focus points */}
              <div className="mt-6 p-4 rounded-2xl bg-primary/10 border border-primary/30 text-center">
                <p className="text-sm text-muted-foreground">Total Focus Points Available Today</p>
                <p className="text-3xl font-display font-bold text-primary">
                  +{timetable.reduce((sum, b) => sum + (b.focusPoints || 0), 0)} ⚡
                </p>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                <button onClick={handleSave} className="game-button game-button-primary py-3 text-sm col-span-2 sm:col-span-1">
                  💾 Save to My Quests
                </button>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="game-button bg-secondary/20 border border-secondary/40 text-foreground py-3 text-sm">
                  ✏️ Edit Timetable
                </button>
                <button onClick={handleDownloadImage} className="game-button bg-white/10 border border-white/20 text-foreground py-3 text-sm">
                  🖼️ Save as Image
                </button>
                <button onClick={handleDownloadPDF} className="game-button bg-white/10 border border-white/20 text-foreground py-3 text-sm">
                  📄 Download PDF
                </button>
                <button onClick={handleGenerate} className="game-button bg-accent/20 border border-accent/40 text-foreground py-3 text-sm">
                  🔄 Regenerate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FOOTER / NEXT STEPS ── */}
        <motion.div
          className={`glass-panel rounded-3xl p-8 text-center bg-gradient-to-br ${cfg.heroGradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-5xl mb-4 block">{cfg.mascot}</span>
          <h2 className="text-2xl font-display font-bold mb-2">Ready to Begin Your Quest? 🌟</h2>
          <p className="text-muted-foreground mb-6">Your timetable is set. Now let's unlock your potential!</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setLocation('/map')}
              className="flex-1 py-5 rounded-2xl font-display font-bold text-lg border-2 border-primary/40 bg-primary/10 hover:bg-primary/20 transition-all duration-200 active:scale-95"
            >
              🗺️ Select Subjects &amp; Begin the Journey
            </button>
          </div>
        </motion.div>
      </div>

      {/* Inline keyframes for generate button animations */}
      <style>{`
        @keyframes rocketLaunch {
          0%   { transform: translateY(0)   opacity(1); }
          70%  { transform: translateY(-60px); opacity: 0.8; }
          100% { transform: translateY(-80px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
