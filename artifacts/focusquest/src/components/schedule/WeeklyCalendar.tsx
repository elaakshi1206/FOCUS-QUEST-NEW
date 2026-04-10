/**
 * WeeklyCalendar.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive weekly schedule grid.
 * • 7-column layout (Mon-Sun)
 * • Click any cell to add/edit a schedule entry
 * • Supports both Subject-wise and Topic-wise modes
 * • Drag visual hint on entries (full DnD would require react-beautiful-dnd)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Clock, BookOpen, ChevronDown } from 'lucide-react';

export interface ScheduleEntry {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  subject: string;
  topic?: string;
  startTime?: string;
  duration?: number;
  icon?: string;
}

const DAYS: ScheduleEntry['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

const SUBJECTS = [
  { id: 'Math', icon: '🔢' }, { id: 'Science', icon: '🔬' }, { id: 'English', icon: '📚' },
  { id: 'Hindi', icon: '🪔' }, { id: 'Social Studies', icon: '🌍' }, { id: 'Computer', icon: '💻' },
  { id: 'Physics', icon: '⚛️' }, { id: 'Chemistry', icon: '🧪' }, { id: 'Biology', icon: '🧬' },
  { id: 'Mathematics', icon: '➗' }, { id: 'EVS', icon: '🌿' }, { id: 'Sanskrit', icon: '📜' },
];

const SUBJECT_COLORS: Record<string, string> = {
  Math: 'from-blue-500/40 to-blue-600/30 border-blue-400/50',
  Mathematics: 'from-blue-500/40 to-blue-600/30 border-blue-400/50',
  Science: 'from-emerald-500/40 to-emerald-600/30 border-emerald-400/50',
  English: 'from-purple-500/40 to-purple-600/30 border-purple-400/50',
  Hindi: 'from-orange-500/40 to-orange-600/30 border-orange-400/50',
  Physics: 'from-cyan-500/40 to-cyan-600/30 border-cyan-400/50',
  Chemistry: 'from-lime-500/40 to-lime-600/30 border-lime-400/50',
  Biology: 'from-green-500/40 to-green-600/30 border-green-400/50',
  Computer: 'from-indigo-500/40 to-indigo-600/30 border-indigo-400/50',
};

const DEFAULT_COLOR = 'from-slate-500/40 to-slate-600/30 border-slate-400/50';

interface SlotModalProps {
  day: ScheduleEntry['day'];
  entry?: ScheduleEntry;
  mode: 'subject' | 'topic';
  onSave: (e: ScheduleEntry) => void;
  onDelete?: () => void;
  onClose: () => void;
}

function SlotModal({ day, entry, mode, onSave, onDelete, onClose }: SlotModalProps) {
  const [subject, setSubject] = useState(entry?.subject || '');
  const [topic, setTopic] = useState(entry?.topic || '');
  const [startTime, setStartTime] = useState(entry?.startTime || '16:00');
  const [duration, setDuration] = useState(entry?.duration || 45);

  const handleSave = () => {
    if (!subject) return;
    const sub = SUBJECTS.find(s => s.id === subject);
    onSave({ day, subject, topic: mode === 'topic' ? topic : undefined, startTime, duration, icon: sub?.icon });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-black text-lg">
            {entry ? 'Edit' : 'Add'} Slot — {DAY_LABELS[day]}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject picker */}
        <div className="mb-4">
          <label className="text-white/60 text-xs font-bold uppercase mb-2 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Subject
          </label>
          <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto">
            {SUBJECTS.map(s => (
              <button key={s.id} onClick={() => setSubject(s.id)}
                className={`px-2 py-2 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all
                  ${subject === s.id ? 'bg-primary/30 border-primary text-white' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}>
                <span>{s.icon}</span> <span className="truncate">{s.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Topic (topic mode only) */}
        {mode === 'topic' && (
          <div className="mb-4">
            <label className="text-white/60 text-xs font-bold uppercase mb-2 block">Specific Topic</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Quadratic Equations, Chapter 3..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-primary transition-all"
            />
          </div>
        )}

        {/* Time + Duration */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-white/60 text-xs font-bold uppercase mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Start Time
            </label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-primary transition-all" />
          </div>
          <div>
            <label className="text-white/60 text-xs font-bold uppercase mb-2 block">Duration (min)</label>
            <select value={duration} onChange={e => setDuration(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-primary transition-all">
              {[20,30,45,60,90,120].map(d => (
                <option key={d} value={d} className="bg-slate-900">{d} min</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          {onDelete && (
            <button onClick={onDelete}
              className="px-4 py-3 rounded-xl border border-red-500/40 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-colors">
              Delete
            </button>
          )}
          <button onClick={handleSave} disabled={!subject}
            className={`flex-1 py-3 rounded-xl font-black text-sm transition-all
              ${subject ? 'bg-primary text-white shadow-lg' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
            {entry ? 'Update Slot' : 'Add Slot'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface Props {
  entries: ScheduleEntry[];
  mode: 'subject' | 'topic';
  onChange: (entries: ScheduleEntry[]) => void;
}

export function WeeklyCalendar({ entries, mode, onChange }: Props) {
  const [modal, setModal] = useState<{ day: ScheduleEntry['day']; entryIdx?: number } | null>(null);

  const entriesForDay = (day: ScheduleEntry['day']) => entries.filter(e => e.day === day);

  const handleSave = (entry: ScheduleEntry) => {
    if (modal?.entryIdx !== undefined) {
      // Edit existing
      const dayEntries = entriesForDay(entry.day);
      const globalIdx  = entries.indexOf(dayEntries[modal.entryIdx]);
      if (globalIdx >= 0) {
        const updated = [...entries];
        updated[globalIdx] = entry;
        onChange(updated);
      }
    } else {
      onChange([...entries, entry]);
    }
    setModal(null);
  };

  const handleDelete = () => {
    if (modal?.entryIdx === undefined || !modal.day) return;
    const dayEntries = entriesForDay(modal.day);
    const globalIdx  = entries.indexOf(dayEntries[modal.entryIdx]);
    if (globalIdx >= 0) {
      const updated = entries.filter((_, i) => i !== globalIdx);
      onChange(updated);
    }
    setModal(null);
  };

  return (
    <>
      {/* Calendar grid */}
      <div className="overflow-x-auto -mx-2">
        <div className="min-w-[640px] px-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center">
                <span className="text-white/60 text-xs font-bold uppercase">{day}</span>
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map(day => {
              const dayEntries = entriesForDay(day);
              return (
                <div key={day}
                  className="min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col gap-1.5">
                  {dayEntries.map((entry, idx) => {
                    const color = SUBJECT_COLORS[entry.subject] || DEFAULT_COLOR;
                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setModal({ day, entryIdx: idx })}
                        className={`w-full text-left p-2 rounded-xl bg-gradient-to-br border text-white text-[10px] font-bold ${color} hover:opacity-90 transition-all cursor-pointer`}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span>{entry.icon || '📖'}</span>
                          <span className="truncate">{entry.subject}</span>
                        </div>
                        {entry.topic && <div className="text-white/60 truncate text-[9px]">{entry.topic}</div>}
                        {entry.startTime && (
                          <div className="text-white/50 text-[9px] mt-0.5">⏰ {entry.startTime} · {entry.duration}m</div>
                        )}
                      </motion.button>
                    );
                  })}

                  {/* Add button */}
                  <button
                    onClick={() => setModal({ day })}
                    className="mt-auto w-full flex items-center justify-center gap-1 py-1.5 rounded-lg border border-dashed border-white/20 text-white/30 text-xs hover:border-primary/50 hover:text-primary/70 transition-all">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <SlotModal
            day={modal.day}
            entry={modal.entryIdx !== undefined ? entriesForDay(modal.day)[modal.entryIdx] : undefined}
            mode={mode}
            onSave={handleSave}
            onDelete={modal.entryIdx !== undefined ? handleDelete : undefined}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
