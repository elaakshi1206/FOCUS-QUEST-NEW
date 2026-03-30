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
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={`${import.meta.env.BASE_URL}${bgVid}`} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
