import { useGame } from '@/lib/store';
import { AnimatedBackground } from '@/components/AnimatedBackground';

interface ThemeBackgroundProps {
  themeOverride?: 'ocean' | 'space' | 'future';
}

/**
 * Renders the animated video background + theme-specific ambient particles/effects
 * for whichever world the current user belongs to.
 */
export function ThemeBackground({ themeOverride }: ThemeBackgroundProps = {}) {
  const { theme: userTheme } = useGame();
  const theme = themeOverride ?? userTheme;

  return (
    <>
      {/* Video background layer */}
      <AnimatedBackground themeOverride={theme} />

      {/* Ocean – waves + rising bubbles */}
      {theme === 'ocean' && (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full">
            <div className="wave wave1" />
            <div className="wave wave2" />
            <div className="wave wave3" />
          </div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bubble"
              style={{
                width: `${8 + Math.random() * 18}px`,
                height: `${8 + Math.random() * 18}px`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 8}s`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Space – twinkling stars + nebula glow */}
      {theme === 'space' && (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                width: `${Math.random() * 2.5 + 0.5}px`,
                height: `${Math.random() * 2.5 + 0.5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${2 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Future – cyber grid + upward data particles */}
      {theme === 'future' && (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-30" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="data-particle"
              style={{
                left: `${10 + i * 11}%`,
                animationDuration: `${4 + i * 1.2}s`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-px bg-primary/30 scan-line"
            style={{ top: 0 }}
          />
        </div>
      )}
    </>
  );
}
