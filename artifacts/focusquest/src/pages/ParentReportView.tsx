/**
 * ParentReportView.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Public parent-facing report page accessible via email/WhatsApp link.
 * URL: /parent-report/:token
 *
 * The token is a JWT pointing to the parent record.
 * Fetches report data from: GET /api/reports/view/:token
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoute } from 'wouter';
import {
  Clock, Star, BookOpen, CheckCircle, XCircle,
  Calendar, Zap, Trophy, Target, TrendingUp
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ReportData {
  studentName: string;
  parentName: string;
  date: string;
  activeSlots: string[];
  focusedHours: number;
  totalActiveHours: number;
  questsSolved: number;
  pointsEarned: number;
  topicsCovered: Array<{ name: string; completed: boolean }>;
  scheduleAdherence: string;
  tomorrowPlan: Array<{ time: string; label: string; subject?: string }>;
  hasData: boolean;
  message?: string;
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, value, label, color, glow }: {
  icon: any; value: string; label: string; color: string; glow: string;
}) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
      className={`${color} border rounded-2xl p-5 text-center relative overflow-hidden`}
      style={{ boxShadow: `0 4px 24px ${glow}33` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <Icon className="w-6 h-6 text-white/70 mx-auto mb-2" />
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-white/60 text-xs font-medium mt-1 uppercase tracking-wide">{label}</p>
    </motion.div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/15 rounded-3xl p-6">
      <h2 className="text-white font-black text-base mb-4 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h2>
      {children}
    </motion.div>
  );
}

export function ParentReportView() {
  const [, params] = useRoute('/parent-report/:token');
  const token = params?.token || '';

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/reports/view/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setReport(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="text-5xl mb-4">⚙️</motion.div>
          <p className="text-white/60 font-semibold">Loading report…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-white text-2xl font-black mb-2">Link Expired</h1>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const adherenceGood = report.scheduleAdherence.includes('✅');
  const completedTopics = report.topicsCovered.filter(t => t.completed).length;
  const totalTopics     = report.topicsCovered.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Gradient background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.1) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 text-sm font-bold text-primary mb-4">
            🎮 FocusQuest Parent Portal
          </div>
          <img src="/background/bg_logo-removebg-preview.png" alt="FocusQuest"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            className="h-16 w-auto mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-black text-white mb-1">
            📊 Daily Progress Report
          </h1>
          <p className="text-white/50 text-sm">{report.date}</p>
        </motion.div>

        {/* ── Student summary banner ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-primary/30 to-violet-500/20 border border-primary/40 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center text-3xl border-2 border-primary/60">
              🎓
            </div>
            <div>
              <p className="text-white/60 text-xs font-bold uppercase mb-0.5">Student Report</p>
              <h2 className="text-white font-black text-xl">{report.studentName}</h2>
              <p className="text-white/50 text-sm">Hi {report.parentName}! Here's today's summary.</p>
            </div>
          </div>
        </motion.div>

        {!report.hasData ? (
          <div className="text-center py-12 bg-white/5 border border-white/15 rounded-3xl">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-white font-bold">No study data recorded today</p>
            <p className="text-white/40 text-sm mt-1">{report.message || 'No sessions were tracked yet.'}</p>
          </div>
        ) : (
          <div className="space-y-5">

            {/* ── Active slots ── */}
            <Section title="Active Study Slots" emoji="🟢">
              {report.activeSlots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {report.activeSlots.map((slot, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {slot}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm">No active sessions recorded today</p>
              )}
            </Section>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Clock} value={`${report.focusedHours}h`} label="Focused Hours"
                color="bg-primary/20 border-primary/40" glow="#6366f1" />
              <StatCard icon={TrendingUp} value={`${report.totalActiveHours}h`} label="Active Hours"
                color="bg-blue-500/20 border-blue-500/40" glow="#3b82f6" />
              <StatCard icon={Trophy} value={String(report.questsSolved)} label="Quests Solved"
                color="bg-amber-500/20 border-amber-500/40" glow="#f59e0b" />
              <StatCard icon={Zap} value={String(report.pointsEarned)} label="XP Earned"
                color="bg-violet-500/20 border-violet-500/40" glow="#8b5cf6" />
            </div>

            {/* ── Topics ── */}
            <Section title={`Topics Covered (${completedTopics}/${totalTopics})`} emoji="📚">
              {report.topicsCovered.length > 0 ? (
                <div className="space-y-2">
                  {report.topicsCovered.map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        t.completed
                          ? 'bg-green-500/15 border-green-500/40 text-green-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}>
                      {t.completed
                        ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        : <XCircle className="w-4 h-4 flex-shrink-0" />
                      }
                      <span className="font-bold text-sm">{t.name}</span>
                      <span className="ml-auto text-xs opacity-70">{t.completed ? 'Completed' : 'Pending'}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm">No topics tracked today</p>
              )}

              {/* Adherence badge */}
              <div className={`mt-4 p-3 rounded-xl border font-bold text-sm flex items-center gap-2
                ${adherenceGood
                  ? 'bg-green-500/15 border-green-500/40 text-green-300'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300'}`}>
                <Target className="w-4 h-4 flex-shrink-0" />
                {report.scheduleAdherence}
              </div>
            </Section>

            {/* ── Tomorrow's plan ── */}
            <Section title="Tomorrow's Plan" emoji="📅">
              {report.tomorrowPlan.length > 0 ? (
                <div className="space-y-2">
                  {report.tomorrowPlan.map((block, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-lg">⚡</span>
                      <div>
                        <p className="text-white font-bold text-sm">{block.label}</p>
                        <p className="text-white/50 text-xs">🕐 {block.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm">No schedule set for tomorrow yet</p>
              )}
            </Section>

            {/* ── Footer ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-center py-4 border-t border-white/10">
              <p className="text-white/30 text-xs">
                Generated by FocusQuest · {report.date}
                <br />Keep encouraging {report.studentName} — every quest counts! 🌟
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
