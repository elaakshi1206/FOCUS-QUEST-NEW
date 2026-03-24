import { useGame } from '@/lib/store';
import { TopHUD } from '@/components/TopHUD';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SUBJECTS } from '@/lib/data';
import { Flame, Star, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Analytics() {
  const { xp, streak, completedQuests, focusHistory } = useGame();

  // Process data for charts
  const lineData = focusHistory.map((h, i) => ({
    name: `Session ${i + 1}`,
    score: h.score
  })).slice(-10); // last 10

  // Fallback data if empty
  const defaultLineData = [
    { name: 'S1', score: 60 }, { name: 'S2', score: 75 }, 
    { name: 'S3', score: 85 }, { name: 'S4', score: 100 }
  ];

  const subjectCounts = focusHistory.reduce((acc, curr) => {
    acc[curr.subjectId] = (acc[curr.subjectId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(subjectCounts).map(([id, count]) => {
    const sub = SUBJECTS.find(s => s.id === id);
    return { name: sub?.title || id, value: count, color: sub?.color.split(' ')[1].replace('to-', '') || 'gray-500' };
  });

  const COLORS = ['#2EC4FF', '#FF8A5B', '#3ED598', '#8A5CFF', '#FFD166'];

  return (
    <div className="min-h-screen relative">
      <TopHUD />
      <AnimatedBackground />

      <div className="pt-28 pb-12 px-4 max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-display font-bold text-white drop-shadow-md mb-8">Your Hero Stats</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Star className="w-8 h-8 text-yellow-400" />} title="Total XP" value={xp} delay={0.1} />
          <StatCard icon={<Flame className="w-8 h-8 text-orange-500" />} title="Focus Streak" value={streak} delay={0.2} />
          <StatCard icon={<CheckCircle2 className="w-8 h-8 text-green-400" />} title="Quests Done" value={completedQuests.length} delay={0.3} />
          <StatCard icon={<Target className="w-8 h-8 text-primary" />} title="Avg Score" value={
            focusHistory.length ? Math.round(focusHistory.reduce((a, b) => a + b.score, 0) / focusHistory.length) + '%' : '0%'
          } delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-6 rounded-3xl lg:col-span-2">
            <h2 className="text-xl font-display font-bold text-card-foreground mb-6">Focus Score Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData.length > 0 ? lineData : defaultLineData}>
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 6, fill: 'hsl(var(--primary))' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel p-6 rounded-3xl">
            <h2 className="text-xl font-display font-bold text-card-foreground mb-6">Subject Mastery</h2>
            <div className="h-64 flex flex-col items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground font-bold">
                  <p className="text-4xl mb-2">🧭</p>
                  <p>Complete quests to see your mastery breakdown!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, delay }: { icon: React.ReactNode, title: string, value: string | number, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
      className="glass-panel p-6 rounded-3xl flex items-center gap-4"
    >
      <div className="bg-background/50 p-4 rounded-2xl border border-border/50 shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-muted-foreground uppercase">{title}</p>
        <p className="text-3xl font-display font-bold text-card-foreground">{value}</p>
      </div>
    </motion.div>
  );
}
