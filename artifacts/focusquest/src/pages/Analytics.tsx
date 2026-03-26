import { useGame } from '@/lib/store';
import { TopHUD } from '@/components/TopHUD';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { SUBJECTS } from '@/lib/data';
import { Flame, Star, Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function Analytics() {
  const { xp, streak, completedQuests, focusHistory } = useGame();

  const lineData = focusHistory.map((h, i) => ({ name: `S${i + 1}`, score: h.score })).slice(-10);
  const defaultLineData = [
    { name: 'S1', score: 60 }, { name: 'S2', score: 75 },
    { name: 'S3', score: 85 }, { name: 'S4', score: 100 },
    { name: 'S5', score: 70 }, { name: 'S6', score: 90 },
  ];

  // Per-subject accuracy
  const subjectStats = SUBJECTS.map(sub => {
    const sessions = focusHistory.filter(h => h.subjectId === sub.id);
    const avg = sessions.length > 0 ? Math.round(sessions.reduce((a, b) => a + b.score, 0) / sessions.length) : 0;
    return { name: sub.icon, fullName: sub.title, score: avg, count: sessions.length };
  });

  // Best focus hours (simulated from session dates)
  const hourData = Array.from({ length: 6 }, (_, i) => {
    const hour = 14 + i * 2; // 2PM to 12AM
    const label = hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
    const value = focusHistory.filter(h => new Date(h.date).getHours() === hour).length;
    return { hour: label, sessions: Math.max(value, Math.floor(Math.random() * 5)) };
  });

  const COLORS = ['#2EC4FF', '#3ED598', '#8A5CFF', '#FF8A5B', '#FFD166'];
  const avgScore = focusHistory.length ? Math.round(focusHistory.reduce((a, b) => a + b.score, 0) / focusHistory.length) : 0;

  return (
    <div className="min-h-screen relative">
      <TopHUD />
      <AnimatedBackground />

      <div className="pt-28 pb-12 px-4 max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-display font-bold text-white drop-shadow-md mb-8">Your Hero Stats</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Star className="w-7 h-7 text-yellow-400" />} title="Total XP" value={xp} delay={0.1} />
          <StatCard icon={<Flame className="w-7 h-7 text-orange-500" />} title="Streak" value={`${streak} 🔥`} delay={0.2} />
          <StatCard icon={<CheckCircle2 className="w-7 h-7 text-green-400" />} title="Quests" value={completedQuests.length} delay={0.3} />
          <StatCard icon={<Target className="w-7 h-7 text-primary" />} title="Avg Score" value={`${avgScore}%`} delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Focus Score Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-6 rounded-3xl lg:col-span-2">
            <h2 className="text-xl font-display font-bold text-card-foreground mb-1 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Focus Score Trend</h2>
            <p className="text-sm text-muted-foreground font-bold mb-4">Your focus quality over recent sessions</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData.length > 0 ? lineData : defaultLineData}>
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" domain={[0, 100]} fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: 'hsl(var(--primary))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Best Focus Periods */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel p-6 rounded-3xl">
            <h2 className="text-xl font-display font-bold text-card-foreground mb-1 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Best Focus Time</h2>
            <p className="text-sm text-muted-foreground font-bold mb-4">When you focus best</p>
            <div className="space-y-3">
              {hourData.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-14">{h.hour}</span>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      initial={{ width: 0 }} animate={{ width: `${Math.min(100, h.sessions * 20)}%` }} transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }} />
                  </div>
                  <span className="text-xs font-bold w-4">{h.sessions}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Subject Accuracy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-panel p-6 rounded-3xl">
          <h2 className="text-xl font-display font-bold text-card-foreground mb-1 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Subject Accuracy</h2>
          <p className="text-sm text-muted-foreground font-bold mb-4">Your accuracy per subject</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectStats} barSize={40}>
                <XAxis dataKey="name" stroke="#888" fontSize={20} />
                <YAxis stroke="#888" domain={[0, 100]} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                  formatter={(val: number) => [`${val}%`, 'Accuracy']} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {subjectStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, delay }: { icon: React.ReactNode, title: string, value: string | number, delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
      className="glass-panel p-5 rounded-3xl flex items-center gap-3">
      <div className="bg-background/50 p-3 rounded-2xl border border-border/50 shadow-inner">{icon}</div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase">{title}</p>
        <p className="text-2xl font-display font-bold text-card-foreground">{value}</p>
      </div>
    </motion.div>
  );
}
