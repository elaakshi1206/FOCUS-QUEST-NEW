/**
 * ScheduleDashboard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The main scheduling hub. Shows:
 * 1. Today's Plan — auto-generated daily timetable with DailyTimeline
 * 2. My Weekly Schedule — interactive WeeklyCalendar (subject/topic modes)
 * 
 * Persists data to backend via /api/schedule/:userId
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useGame } from '@/lib/store';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { TopHUD } from '@/components/TopHUD';
import { WeeklyCalendar, type ScheduleEntry } from '@/components/schedule/WeeklyCalendar';
import { DailyTimeline, type TimeBlock } from '@/components/schedule/DailyTimeline';
import {
  Calendar, Clock, Save, RefreshCw, ChevronLeft,
  LayoutGrid, BookOpen, CheckCircle, Zap, AlertCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ─── Stats card ─────────────────────────────────────────────────────────────

function StatCard({ emoji, value, label, color }: { emoji: string; value: string; label: string; color: string }) {
  return (
    <motion.div whileHover={{ scale: 1.03, y: -2 }}
      className={`${color} border rounded-2xl p-4 text-center`}>
      <p className="text-2xl mb-1">{emoji}</p>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-white/60 text-xs font-medium mt-0.5">{label}</p>
    </motion.div>
  );
}

export function ScheduleDashboard() {
  const [, setLocation] = useLocation();
  const { userName, isHydrated } = useGame();

  // Local state
  const [activeTab, setActiveTab] = useState<'today' | 'weekly'>('today');
  const [scheduleMode, setScheduleMode] = useState<'subject' | 'topic'>('subject');
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [todayBlocks, setTodayBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const userId = typeof window !== 'undefined'
    ? localStorage.getItem('focusquest_user_id') || ''
    : '';

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchSchedule = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/schedule/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          setEntries(data.entries || []);
          setScheduleMode(data.mode || 'subject');
        }
      }
    } catch (err) {
      console.warn('Could not fetch schedule:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchToday = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API}/schedule/${userId}/today`);
      if (res.ok) {
        const data = await res.json();
        setTodayBlocks(data.blocks || []);
      }
    } catch (err) {
      console.warn('Could not fetch today:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchSchedule();
    fetchToday();
  }, [fetchSchedule, fetchToday]);

  // ── Save schedule ──────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!userId) {
      setError('User not logged in. Please sign in again.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API}/schedule/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: scheduleMode, entries }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Regenerate today's timetable
      await fetch(`${API}/schedule/${userId}/generate`, { method: 'POST' });
      await fetchToday();
    } catch {
      setError('Could not save schedule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────

  const focusBlocksToday = todayBlocks.filter(b => b.type === 'focus');
  const focusMinutesToday = focusBlocksToday.reduce((acc, b) => acc + b.duration, 0);
  const subjectsThisWeek = [...new Set(entries.map(e => e.subject))];

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen relative pb-24">
      <AnimatedBackground />
      <TopHUD />

      <div className="pt-20 px-4 max-w-4xl mx-auto">

        {/* ── Hero header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 text-sm font-bold text-primary mb-3">
            <Calendar className="w-4 h-4" /> My Learning Schedule
          </div>
          <h1 className="text-3xl font-black text-white mb-1">📅 Plan Your Quest</h1>
          <p className="text-white/60 text-sm">Structure your week, conquer every subject</p>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard emoji="⚡" value={`${Math.round(focusMinutesToday / 60 * 10) / 10}h`}
            label="Focus Today" color="bg-primary/15 border-primary/30" />
          <StatCard emoji="📚" value={String(subjectsThisWeek.length)}
            label="Subjects" color="bg-violet-500/15 border-violet-500/30" />
          <StatCard emoji="📋" value={String(entries.length)}
            label="Slots This Week" color="bg-emerald-500/15 border-emerald-500/30" />
          <StatCard emoji="🎯" value={String(focusBlocksToday.length)}
            label="Sessions Today" color="bg-amber-500/15 border-amber-500/30" />
        </motion.div>

        {/* ── Tab switcher ── */}
        <div className="flex gap-2 mb-6 bg-white/5 border border-white/15 rounded-2xl p-1.5">
          {(['today', 'weekly'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all
                ${activeTab === tab ? 'bg-primary/30 text-white border border-primary/50' : 'text-white/50 hover:text-white/70'}`}>
              {tab === 'today' ? <><Clock className="w-4 h-4" /> Today's Plan</> : <><LayoutGrid className="w-4 h-4" /> Weekly Schedule</>}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── TODAY'S PLAN TAB ── */}
          {activeTab === 'today' && (
            <motion.div key="today" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} className="space-y-4">

              <div className="bg-white/8 border border-white/15 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-black text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h2>
                  <button onClick={fetchToday}
                    className="p-2 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12 gap-3 text-white/50">
                    <span className="animate-spin text-2xl">⚙️</span> Loading your plan…
                  </div>
                ) : (
                  <DailyTimeline blocks={todayBlocks} />
                )}

                {todayBlocks.length === 0 && !loading && (
                  <div className="mt-4 text-center">
                    <motion.button onClick={() => setActiveTab('weekly')} whileHover={{ scale: 1.02 }}
                      className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-primary/30 transition-all">
                      <Calendar className="w-4 h-4" /> Set Up Weekly Schedule
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Focus session tips */}
              {focusBlocksToday.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-300 font-bold text-sm">
                      {focusBlocksToday.length} focus session{focusBlocksToday.length > 1 ? 's' : ''} planned!
                    </p>
                    <p className="text-emerald-400/70 text-xs mt-0.5">
                      Target: {Math.round(focusMinutesToday / 60 * 10) / 10}h of focused study today 💪
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── WEEKLY SCHEDULE TAB ── */}
          {activeTab === 'weekly' && (
            <motion.div key="weekly" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} className="space-y-4">

              {/* Mode selector */}
              <div className="bg-white/8 border border-white/15 rounded-2xl p-4">
                <p className="text-white/60 text-xs font-bold uppercase mb-3">Schedule Mode</p>
                <div className="flex gap-2">
                  {(['subject', 'topic'] as const).map(m => (
                    <button key={m} onClick={() => setScheduleMode(m)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 border transition-all
                        ${scheduleMode === m ? 'bg-primary/25 border-primary text-white' : 'border-white/20 text-white/50 hover:border-white/40'}`}>
                      {m === 'subject' ? <><BookOpen className="w-4 h-4" /> Subject-wise</> : <><Zap className="w-4 h-4" /> Topic-wise</>}
                    </button>
                  ))}
                </div>
                <p className="text-white/40 text-xs mt-2">
                  {scheduleMode === 'subject'
                    ? 'e.g. Monday → Mathematics, Tuesday → Science'
                    : 'e.g. Monday → Algebra Ch.3 + Quadratic Equations'}
                </p>
              </div>

              {/* Calendar */}
              <div className="bg-white/8 border border-white/15 rounded-3xl p-4 sm:p-6">
                <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-primary" /> Weekly Plan
                </h2>
                {loading ? (
                  <div className="flex items-center justify-center py-12 gap-3 text-white/50">
                    <span className="animate-spin text-2xl">⚙️</span> Loading…
                  </div>
                ) : (
                  <WeeklyCalendar entries={entries} mode={scheduleMode} onChange={setEntries} />
                )}
              </div>

              {/* Error message */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 flex items-center gap-2 text-red-300 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </motion.div>
              )}

              {/* Save button */}
              <motion.button
                onClick={handleSave}
                disabled={saving || entries.length === 0}
                whileHover={entries.length > 0 ? { scale: 1.02 } : {}}
                whileTap={entries.length > 0 ? { scale: 0.98 } : {}}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl
                  ${entries.length > 0
                    ? saveSuccess
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-primary to-violet-500 text-white shadow-primary/30'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                style={entries.length > 0 ? { boxShadow: '0 8px 32px rgba(99,102,241,0.4)' } : undefined}>
                {saving ? (
                  <><span className="animate-spin">⚙️</span> Saving…</>
                ) : saveSuccess ? (
                  <><CheckCircle className="w-6 h-6" /> Schedule Saved! ✅</>
                ) : (
                  <><Save className="w-6 h-6" /> Save My Weekly Schedule</>
                )}
              </motion.button>

              {userId && entries.length > 0 && (
                <p className="text-center text-white/40 text-xs">
                  Schedule saved to your account · Daily timetable auto-generated each morning
                </p>
              )}
              {!userId && (
                <p className="text-center text-amber-400/70 text-xs flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Create an account to sync your schedule and enable daily reports
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom nav */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          <button onClick={() => setLocation('/map')}
            className="flex items-center gap-2 bg-black/60 backdrop-blur border border-white/20 rounded-2xl px-5 py-3 text-white text-sm font-bold hover:bg-black/80 transition-colors shadow-xl">
            <ChevronLeft className="w-4 h-4" /> Back to Map
          </button>
        </motion.div>
      </div>
    </div>
  );
}
