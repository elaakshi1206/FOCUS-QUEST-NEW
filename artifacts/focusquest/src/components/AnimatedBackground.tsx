import { useGame } from '@/lib/store';

interface AnimatedBackgroundProps {
  themeOverride?: 'ocean' | 'space' | 'future';
}

export function AnimatedBackground({ themeOverride }: AnimatedBackgroundProps = {}) {
  const { theme: storeTheme } = useGame();
  const theme = themeOverride || storeTheme;
  
  let bgImg = 'ocean-bg.png';
  if (theme === 'space') bgImg = 'space-bg.png';
  if (theme === 'future') bgImg = 'future-map-bg.png';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* AI-generated background image */}
      <div 
        className="absolute inset-[-5%] bg-cover bg-center opacity-60"
        style={{ 
          backgroundImage: `url(${import.meta.env.BASE_URL}images/${bgImg})`,
          filter: 'saturate(1.4) brightness(0.85)',
        }}
      />

      {/* Gradient overlay for readability */}
      {theme === 'ocean' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/50 via-transparent to-cyan-600/60" />
          {/* Animated waves */}
          <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
            <div className="wave wave1" />
            <div className="wave wave2" />
            <div className="wave wave3" />
          </div>
          {/* Floating bubbles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bubble"
              style={{
                left: `${(i * 8.3) % 100}%`,
                width: `${8 + (i % 3) * 6}px`,
                height: `${8 + (i % 3) * 6}px`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${4 + (i % 4)}s`,
              }}
            />
          ))}
        </>
      )}

      {theme === 'space' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-purple-950/50 to-blue-950/70" />
          {/* Twinkling stars */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${(i * 17.3) % 100}%`,
                top: `${(i * 11.7) % 100}%`,
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                animationDelay: `${(i * 0.3) % 3}s`,
              }}
            />
          ))}
          {/* Nebula glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </>
      )}

      {theme === 'future' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-cyan-950/50 to-slate-950/80" />
          {/* Cyber grid */}
          <div className="absolute inset-0 cyber-grid opacity-20" />
          {/* Scanning line */}
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent scan-line" />
          {/* Data particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="data-particle"
              style={{
                left: `${(i * 5.1) % 100}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${5 + (i % 4)}s`,
              }}
            />
          ))}
          {/* Holographic glow blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </>
      )}
    </div>
  );
}
