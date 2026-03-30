import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useGame } from '@/lib/store';
import { SUBJECTS, TOPICS, QUESTS, Subject, Topic, getGradeTheme, THEME_MAP_CONFIG, getSubjectsForGrade } from '@/lib/data';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { TopHUD } from '@/components/TopHUD';
import { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────
// Topic map positions per subject (random-ish spread)
// ─────────────────────────────────────────────
const TOPIC_POSITIONS: Record<string, { x: number; y: number }[]> = {
  math: [
    { x: 20, y: 18 },
    { x: 65, y: 12 },
    { x: 45, y: 55 },
    { x: 18, y: 70 },
  ],
  science: [
    { x: 15, y: 20 },
    { x: 60, y: 18 },
    { x: 38, y: 58 },
    { x: 75, y: 62 },
  ],
  english: [
    { x: 22, y: 20 },
    { x: 68, y: 16 },
    { x: 44, y: 62 },
  ],
  social: [
    { x: 18, y: 16 },
    { x: 63, y: 22 },
    { x: 38, y: 64 },
  ],
  logic: [
    { x: 20, y: 18 },
    { x: 66, y: 14 },
    { x: 42, y: 60 },
  ],
  math_high: [
    { x: 20, y: 18 },
    { x: 65, y: 12 },
    { x: 45, y: 55 },
  ],
  physics: [
    { x: 15, y: 20 },
    { x: 60, y: 18 },
    { x: 38, y: 58 },
  ],
  chemistry: [
    { x: 22, y: 20 },
    { x: 68, y: 16 },
    { x: 44, y: 62 },
  ],
  biology: [
    { x: 18, y: 16 },
    { x: 63, y: 22 },
    { x: 38, y: 64 },
  ],
  computer: [
    { x: 20, y: 18 },
    { x: 66, y: 14 },
    { x: 42, y: 60 },
  ],
  math_mid: [
    { x: 30, y: 30 },
    { x: 60, y: 50 },
  ],
  science_mid: [
    { x: 25, y: 40 },
    { x: 70, y: 30 },
  ],
  english_mid: [
    { x: 35, y: 25 },
    { x: 55, y: 65 },
  ],
  social_mid: [
    { x: 20, y: 50 },
    { x: 65, y: 40 },
  ],
  logic_mid: [
    { x: 40, y: 30 },
    { x: 50, y: 60 },
  ],
};

// Path connections between topics (by index pairs)
const TOPIC_PATHS: Record<string, [number, number][]> = {
  math: [[0, 1], [1, 2], [2, 3]],
  science: [[0, 1], [1, 2], [2, 3]],
  english: [[0, 1], [1, 2]],
  social: [[0, 1], [1, 2]],
  logic: [[0, 1], [1, 2]],
  math_high: [[0, 1], [1, 2]],
  physics: [[0, 1], [1, 2]],
  chemistry: [[0, 1], [1, 2]],
  biology: [[0, 1], [1, 2]],
  computer: [[0, 1], [1, 2]],
  math_mid: [[0, 1]],
  science_mid: [[0, 1]],
  english_mid: [[0, 1]],
  social_mid: [[0, 1]],
  logic_mid: [[0, 1]],
};

// Distinct bright palette per subject
const SUBJECT_PALETTE: Record<string, { bg: string; border: string; glow: string; btnGrad: string }> = {
  math:    { bg: 'from-blue-400 to-indigo-600',    border: 'border-blue-300',   glow: '#60A5FA', btnGrad: 'from-blue-500 to-indigo-600' },
  science: { bg: 'from-emerald-400 to-teal-600',   border: 'border-emerald-300', glow: '#34D399', btnGrad: 'from-emerald-500 to-teal-600' },
  english: { bg: 'from-purple-400 to-violet-600',  border: 'border-purple-300', glow: '#A78BFA', btnGrad: 'from-purple-500 to-violet-600' },
  social:  { bg: 'from-orange-400 to-amber-600',   border: 'border-orange-300', glow: '#FB923C', btnGrad: 'from-orange-500 to-amber-600' },
  logic:   { bg: 'from-pink-400 to-rose-600',      border: 'border-pink-300',   glow: '#F472B6', btnGrad: 'from-pink-500 to-rose-600' },
  math_high: { bg: 'from-blue-400 to-indigo-600',    border: 'border-blue-300',   glow: '#60A5FA', btnGrad: 'from-blue-500 to-indigo-600' },
  physics:   { bg: 'from-cyan-400 to-teal-600',      border: 'border-cyan-300',   glow: '#22D3EE', btnGrad: 'from-cyan-500 to-teal-600' },
  chemistry: { bg: 'from-emerald-400 to-green-600',  border: 'border-emerald-300', glow: '#34D399', btnGrad: 'from-emerald-500 to-green-600' },
  biology:   { bg: 'from-lime-400 to-green-500',     border: 'border-lime-300',   glow: '#A3E635', btnGrad: 'from-lime-500 to-green-600' },
  computer:  { bg: 'from-indigo-400 to-violet-600',  border: 'border-indigo-300', glow: '#818CF8', btnGrad: 'from-indigo-500 to-violet-600' },
  math_mid:    { bg: 'from-blue-500 to-indigo-500',   border: 'border-blue-300',   glow: '#60A5FA', btnGrad: 'from-blue-500 to-indigo-600' },
  science_mid: { bg: 'from-green-500 to-teal-500',    border: 'border-green-300',  glow: '#34D399', btnGrad: 'from-green-500 to-teal-600' },
  english_mid: { bg: 'from-purple-500 to-fuchsia-500',border: 'border-purple-300', glow: '#A78BFA', btnGrad: 'from-purple-500 to-fuchsia-600' },
  social_mid:  { bg: 'from-orange-500 to-red-500',    border: 'border-orange-300', glow: '#FB923C', btnGrad: 'from-orange-500 to-red-600' },
  logic_mid:   { bg: 'from-cyan-500 to-blue-500',     border: 'border-cyan-300',   glow: '#22D3EE', btnGrad: 'from-cyan-500 to-blue-600' },
};

// Subject metadata for the Pick Subjects panel
const SUBJECT_META: Record<string, { icon: string; emoji: string; label: string }> = {
  english: { icon: '📚', emoji: '📚', label: 'ENGLISH' },
  math:    { icon: '🧮', emoji: '🧮', label: 'MATHS' },
  social:  { icon: '📜', emoji: '📜', label: 'HISTORY' },
  logic:   { icon: '💡', emoji: '💡', label: 'LOGIC AND THINKING' },
  science: { icon: '🔬', emoji: '🔬', label: 'SCIENCE' },
  math_high: { icon: '➗', emoji: '➗', label: 'ADVANCED MATHS' },
  physics:   { icon: '⚛️', emoji: '⚛️', label: 'PHYSICS' },
  chemistry: { icon: '🧪', emoji: '🧪', label: 'CHEMISTRY' },
  biology:   { icon: '🧬', emoji: '🧬', label: 'BIOLOGY' },
  computer:  { icon: '💻', emoji: '💻', label: 'COMPUTER SCIENCE' },
  math_mid:    { icon: '📐', emoji: '📐', label: 'PRE-ALGEBRA' },
  science_mid: { icon: '🌍', emoji: '🌍', label: 'SCIENCE' },
  english_mid: { icon: '📖', emoji: '📖', label: 'LANGUAGE ARTS' },
  social_mid:  { icon: '🗺️', emoji: '🗺️', label: 'WORLD HISTORY' },
  logic_mid:   { icon: '💻', emoji: '💻', label: 'CODING & LOGIC' },
};

// ─────────────────────────────────────────────
// Floating decorations on the map background
// ─────────────────────────────────────────────
const MAP_DECO = ['⭐', '✨', '🌟', '💫', '🌈', '☁️', '🌤️', '🍀'];

function FloatingDeco() {
  return (
    <>
      {MAP_DECO.map((d, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none select-none opacity-30"
          style={{
            left: `${(i * 13 + 5) % 90}%`,
            top:  `${(i * 17 + 8) % 85}%`,
          }}
          animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.4, delay: i * 0.3 }}
        >
          {d}
        </motion.div>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────
// SVG dotted-line path between two % positions
// ─────────────────────────────────────────────
function DottedPath({ from, to, color }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string }) {
  const mx = (from.x + to.x) / 2 + (Math.random() * 10 - 5);
  const my = (from.y + to.y) / 2 + (Math.random() * 10 - 5);
  return (
    <path
      d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      strokeDasharray="3 2.5"
      strokeLinecap="round"
      opacity="0.7"
    />
  );
}

// ─────────────────────────────────────────────
// Topic Node
// ─────────────────────────────────────────────
function TopicNode({
  topic,
  pos,
  isCompleted,
  palette,
  index,
  onClick,
}: {
  topic: Topic;
  pos: { x: number; y: number };
  isCompleted: boolean;
  palette: typeof SUBJECT_PALETTE[string];
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="absolute flex flex-col items-center cursor-pointer select-none"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%,-50%)' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: index * 0.1 }}
      whileHover={{ scale: 1.13, y: -4 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
    >
      {/* +XP badge */}
      <motion.div
        className="absolute -top-3 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg border-2 border-yellow-300 z-20"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.8, delay: index * 0.2 }}
      >
        +XP
      </motion.div>

      {/* Circle */}
      <div
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${palette.bg} flex items-center justify-center shadow-2xl border-4
          ${isCompleted ? 'border-green-300' : palette.border}
          map-node-active
        `}
        style={{
          boxShadow: `0 0 22px 6px ${isCompleted ? '#4ade80aa' : palette.glow + '88'}`,
          animationDelay: `${index * 0.6}s`,
        }}
      >
        <span className="text-3xl sm:text-4xl drop-shadow-lg z-10 relative">{topic.icon}</span>

        {/* Shine overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-white/10 to-transparent pointer-events-none" />

        {/* Completed badge */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-20"
          >
            <span className="text-white text-xs font-black">✓</span>
          </motion.div>
        )}
      </div>

      {/* Label bubble */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="mt-2 bg-white/95 backdrop-blur-sm text-gray-800 text-center font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl shadow-xl border-2 border-white max-w-[110px] leading-tight"
        style={{ fontFamily: "'Fredoka', sans-serif" }}
      >
        {topic.title}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Pick Subjects Panel
// ─────────────────────────────────────────────
function PickSubjectsPanel({
  grade,
  selectedId,
  onSelect,
  onEnter,
  onBack,
  customSubjects = [],
}: {
  grade: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEnter: () => void;
  onBack: () => void;
  customSubjects?: string[];
}) {
  const orderedSubjects = getSubjectsForGrade(grade);

  // Merge built-in subjects with custom subjects
  const allSubjects = [
    ...orderedSubjects,
    ...customSubjects.map(s => ({
      id: s,
      title: s,
      icon: '📝', 
      color: 'from-slate-400 to-slate-600',
      description: 'Your custom subject.'
    }))
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md z-30 px-4"
    >
      <div
        className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.97) 0%, rgba(240,245,255,0.97) 100%)',
          boxShadow: '0 10px 50px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.5)',
        }}
      >
        {/* Header */}
        <div
          className="px-5 pt-4 pb-3"
          style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)' }}
        >
          <h2 className="font-black text-white text-xl sm:text-2xl tracking-wide" style={{ fontFamily: "'Fredoka', sans-serif", textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            🗺️ Pick Subjects
          </h2>
          <p className="text-white/80 text-sm font-semibold mt-0.5">What do you want to master?</p>
        </div>

        {/* Subject buttons */}
        <div className="p-3 space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar">
          {allSubjects.map((subject, i) => {
            const meta = SUBJECT_META[subject.id] || { icon: '📝', emoji: '📝', label: subject.title.toUpperCase() };
            const palette = SUBJECT_PALETTE[subject.id] || { bg: 'from-slate-400 to-slate-600', border: 'border-slate-300', glow: '#94A3B8', btnGrad: 'from-slate-500 to-slate-600' };
            const isSelected = selectedId === subject.id;

            return (
              <motion.button
                key={subject.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(subject.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all font-black text-sm sm:text-base
                  ${isSelected
                    ? `bg-gradient-to-r ${palette.btnGrad} text-white border-white shadow-lg`
                    : 'bg-white/70 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-white'
                  }
                `}
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  boxShadow: isSelected ? `0 4px 15px ${palette.glow}66` : undefined,
                }}
              >
                <span className="text-xl w-7 text-center">{meta.icon}</span>
                <span className="flex-1 text-left tracking-wider">{meta.label}</span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-white font-black text-xs"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="px-3 pb-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-300 bg-gray-100 text-gray-600 font-black text-sm hover:bg-gray-200 transition-colors"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            ← Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 6px 24px rgba(59,130,246,0.5)' }}
            whileTap={{ scale: 0.96 }}
            onClick={onEnter}
            disabled={!selectedId}
            className={`flex-[2.5] py-3 rounded-2xl font-black text-white text-sm sm:text-base transition-all
              ${selectedId
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:from-blue-400 hover:to-indigo-500 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed opacity-60'
              }
            `}
            style={{ fontFamily: "'Fredoka', sans-serif", boxShadow: selectedId ? '0 5px 20px rgba(99,102,241,0.45)' : undefined }}
          >
            🌍 Enter World Map
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN MAP PAGE
// ─────────────────────────────────────────────
export function Map() {
  const { xp, completedQuests, grade, userName, isHydrated, customSubjects } = useGame();
  const mapTheme = getGradeTheme(grade);
  const [, setLocation] = useLocation();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [mapSubjectId, setMapSubjectId] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(true);
  const pathRef = useRef<SVGSVGElement>(null);

  // Auth guard: redirect to landing if not logged in
  useEffect(() => {
    if (isHydrated && !userName) {
      setLocation('/');
    }
  }, [isHydrated, userName, setLocation]);

  if (!isHydrated || !userName) return null;

  // Compute positions for the active subject's paths
  const activeTopics = mapSubjectId
    ? TOPICS.filter(t => t.subjectId === mapSubjectId)
    : [];

  const positions = mapSubjectId ? (TOPIC_POSITIONS[mapSubjectId] || []) : [];
  const paths = mapSubjectId ? (TOPIC_PATHS[mapSubjectId] || []) : [];
  const palette = mapSubjectId ? SUBJECT_PALETTE[mapSubjectId] : null;

  // Determine if a topic is completed
  const isTopicCompleted = (topic: Topic) => {
    const questsForTopic = QUESTS.filter(q => {
      if (q.subjectId !== topic.subjectId) return false;
      const seg = topic.id.split('_')[1];
      return q.id.includes(seg) || q.title.toLowerCase().includes(topic.title.toLowerCase().split(' ')[0]);
    });
    return questsForTopic.length > 0 && questsForTopic.every(q => completedQuests.includes(q.id));
  };

  const handleEnterMap = () => {
    if (!selectedSubjectId) return;
    setMapSubjectId(selectedSubjectId);
    setShowPanel(false);
  };

  const handleTopicClick = (topic: Topic) => {
    const quest = QUESTS.find(q => {
      if (q.subjectId !== topic.subjectId) return false;
      const seg = topic.id.split('_')[1];
      return q.id.includes(seg) || q.title.toLowerCase().includes(topic.title.toLowerCase().split(' ')[0]);
    });
    if (quest && xp >= quest.requiredXp) {
      setLocation(`/quest/${topic.subjectId}/${quest.id}`);
    }
  };

  // When map subject changes, animate in new topics
  const activeSubject = mapSubjectId ? SUBJECTS.find(s => s.id === mapSubjectId) : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TopHUD />
      <AnimatedBackground themeOverride={mapTheme} />

      {/* ── Map canvas ── */}
      <div className="absolute inset-0 pt-16 flex flex-col items-center overflow-hidden">

        {/* Map title bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 mb-2 px-5 py-2 rounded-2xl font-black text-white text-base sm:text-lg shadow-xl border border-white/30 backdrop-blur-md"
          style={{
            background: activeSubject
              ? `linear-gradient(90deg, ${SUBJECT_PALETTE[activeSubject.id]?.glow}cc, rgba(30,30,80,0.9))`
              : 'rgba(30,30,80,0.8)',
            fontFamily: "'Fredoka', sans-serif",
          }}
        >
          {activeSubject
            ? `${SUBJECT_META[activeSubject.id]?.icon} ${SUBJECT_META[activeSubject.id]?.label} — ${THEME_MAP_CONFIG[mapTheme]?.mapTitle ?? 'World Map'}`
            : `${THEME_MAP_CONFIG[mapTheme]?.mapTitle ?? '🗺️ World Map'} — Pick a Subject!`}
        </motion.div>

        {/* Map area */}
        <div className="relative w-full max-w-2xl flex-1"
          style={{ minHeight: showPanel ? 'calc(100vh - 280px)' : 'calc(100vh - 120px)' }}
        >
          <FloatingDeco />

          {/* SVG dotted paths */}
          <AnimatePresence>
            {!showPanel && mapSubjectId && palette && (
              <motion.svg
                key={mapSubjectId + '_svg'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                ref={pathRef}
              >
                {paths.map(([a, b], i) => (
                  <DottedPath
                    key={i}
                    from={positions[a]}
                    to={positions[b]}
                    color={palette.glow}
                  />
                ))}
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Topic nodes */}
          <AnimatePresence>
            {!showPanel && activeTopics.map((topic, i) => {
              const pos = positions[i];
              if (!pos || !palette) return null;
              return (
                <TopicNode
                  key={topic.id + '_' + mapSubjectId}
                  topic={topic}
                  pos={pos}
                  isCompleted={isTopicCompleted(topic)}
                  palette={palette}
                  index={i}
                  onClick={() => handleTopicClick(topic)}
                />
              );
            })}
          </AnimatePresence>

          {/* Empty-state prompt when panel is visible */}
          {showPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <motion.div
                  className="text-6xl sm:text-8xl mb-4"
                  animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  🗺️
                </motion.div>
                <p className="font-black text-white/60 text-lg sm:text-xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Choose a subject below!
                </p>
              </div>
            </motion.div>
          )}

          {/* Change Subject button (when on map) */}
          {!showPanel && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPanel(true)}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xl border-2 border-white z-20 hover:bg-white transition-colors"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              🔄 Change Subject
            </motion.button>
          )}
        </div>
      </div>

      {/* Pick Subjects Panel */}
      <AnimatePresence>
        {showPanel && (
          <PickSubjectsPanel
            grade={grade}
            selectedId={selectedSubjectId}
            onSelect={setSelectedSubjectId}
            onEnter={handleEnterMap}
            onBack={() => setLocation('/')}
            customSubjects={customSubjects}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
