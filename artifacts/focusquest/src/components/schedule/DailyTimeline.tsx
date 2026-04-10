/**
 * DailyTimeline.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Compact today's-plan timeline used on the map/dashboard.
 * Shows time blocks with completion status and focus indicators.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { motion } from 'framer-motion';
import { Clock, CheckCircle, Zap } from 'lucide-react';

export interface TimeBlock {
  label: string;
  time: string;
  duration: number;
  type: 'school' | 'meal' | 'play' | 'break' | 'activity' | 'focus' | 'sleep';
  subject?: string;
  topic?: string;
  focusPoints?: number;
  icon: string;
  completed?: boolean;
}

const TYPE_COLORS: Record<TimeBlock['type'], string> = {
  focus:    'bg-primary/20 border-primary/50 text-primary',
  school:   'bg-sky-500/20 border-sky-400/50 text-sky-300',
  meal:     'bg-amber-500/20 border-amber-400/50 text-amber-300',
  play:     'bg-pink-500/20 border-pink-400/50 text-pink-300',
  break:    'bg-slate-500/20 border-slate-400/50 text-slate-300',
  activity: 'bg-violet-500/20 border-violet-400/50 text-violet-300',
  sleep:    'bg-indigo-900/30 border-indigo-400/20 text-indigo-300',
};

interface Props {
  blocks: TimeBlock[];
  compact?: boolean;
  onBlockClick?: (block: TimeBlock, idx: number) => void;
}

export function DailyTimeline({ blocks, compact = false, onBlockClick }: Props) {
  if (!blocks.length) {
    return (
      <div className="text-center py-8 text-white/40">
        <p className="text-3xl mb-2">📅</p>
        <p className="text-sm font-medium">No schedule for today yet</p>
        <p className="text-xs mt-1">Go to My Schedule to set your plan</p>
      </div>
    );
  }

  // In compact mode show only focus blocks + nearest upcoming
  const displayed = compact
    ? blocks.filter(b => b.type === 'focus').slice(0, 4)
    : blocks;

  return (
    <div className={`space-y-2 ${compact ? 'max-h-64 overflow-y-auto' : ''}`}>
      {displayed.map((block, idx) => {
        const colors = TYPE_COLORS[block.type];
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onBlockClick?.(block, idx)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all
              ${colors}
              ${onBlockClick ? 'cursor-pointer hover:opacity-90' : ''}
              ${block.completed ? 'opacity-60' : ''}`}>
            {/* Icon */}
            <span className="text-xl flex-shrink-0">{block.icon}</span>

            {/* Time */}
            <div className="text-xs font-bold min-w-[52px] flex-shrink-0">
              <p>{block.time}</p>
              {block.duration > 0 && <p className="opacity-60">{block.duration}m</p>}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{block.label}</p>
              {block.type === 'focus' && block.focusPoints && (
                <p className="text-[10px] opacity-70 flex items-center gap-0.5 mt-0.5">
                  <Zap className="w-2.5 h-2.5" /> +{block.focusPoints} pts
                </p>
              )}
            </div>

            {/* Completion status */}
            {block.completed && (
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            )}
          </motion.div>
        );
      })}

      {compact && blocks.filter(b => b.type === 'focus').length > 4 && (
        <p className="text-white/40 text-xs text-center font-medium">
          +{blocks.filter(b => b.type === 'focus').length - 4} more focus sessions
        </p>
      )}
    </div>
  );
}
