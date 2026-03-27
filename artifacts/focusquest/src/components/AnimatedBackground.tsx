import { useGame } from '@/lib/store';
import { getGradeTheme } from '@/lib/data';

interface AnimatedBackgroundProps {
  themeOverride?: 'ocean' | 'space' | 'future';
}

export function AnimatedBackground({ themeOverride }: AnimatedBackgroundProps = {}) {
  const { grade } = useGame();
  // Always derive theme from grade so all pages stay in sync
  const derivedTheme = getGradeTheme(grade);
  const theme = themeOverride || derivedTheme;
  
  let bgImg = 'ocean-bg.png';
  let bgVid: string | null = null;
  
  if (theme === 'ocean') {
    bgVid = 'background/background 1.mp4';
  } else if (theme === 'space') {
    bgVid = 'background/backgrounds 2.mp4';
  } else if (theme === 'future') {
    bgVid = 'background/backgrounds 3.mp4';
    bgImg = 'future-map-bg.png';
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* AI-generated background image or video */}
      {bgVid ? (
        <video 
          key={bgVid}
          className="absolute inset-[-5%] w-[110%] h-[110%] object-cover opacity-60"
          style={{ filter: 'saturate(1.4) brightness(0.85)' }}
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={`${import.meta.env.BASE_URL}${bgVid}`} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-[-5%] bg-cover bg-center opacity-60"
          style={{ 
            backgroundImage: `url(${import.meta.env.BASE_URL}images/${bgImg})`,
            filter: 'saturate(1.4) brightness(0.85)',
          }}
        />
      )}

      {/* Gradient overlay for readability */}
      {theme === 'ocean' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/50 via-transparent to-cyan-600/60" />

        </>
      )}

      {theme === 'space' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-purple-950/50 to-blue-950/70" />
          {/* Nebula glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-400/15 rounded-full blur-2xl" />
        </>
      )}

      {theme === 'future' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-cyan-950/50 to-slate-950/80" />

          {/* Holographic glow blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </>
      )}
    </div>
  );
}
