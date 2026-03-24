import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/store';
import { getMascotThemeProps } from '@/lib/data';

export function Mascot({ message, delay = 0 }: { message: string, delay?: number }) {
  const { theme } = useGame();
  const { emoji, name } = getMascotThemeProps(theme);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, message]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, x: -50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 left-6 z-40 flex items-end gap-4 max-w-sm pointer-events-none"
        >
          {/* Mascot character */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-20 h-20 bg-background border-4 border-primary rounded-full shadow-xl flex items-center justify-center text-4xl"
          >
            {emoji}
          </motion.div>

          {/* Chat bubble */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, originX: 0, originY: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card text-card-foreground p-4 rounded-2xl rounded-bl-none shadow-xl border-2 border-border/50 pointer-events-auto"
          >
            <p className="text-xs font-bold text-primary mb-1">{name}</p>
            <p className="text-sm font-bold">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
