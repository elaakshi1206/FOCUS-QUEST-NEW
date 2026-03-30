import { useGame } from '@/lib/store';
import { getGradeTheme } from '@/lib/data';

interface AnimatedBackgroundProps {
  themeOverride?: 'ocean' | 'space' | 'future';
  forceDefault?: boolean;
}

const DEFAULT_BG = 'background/Untitled%20design%20(1).jpg.jpeg';

export function AnimatedBackground({ themeOverride, forceDefault }: AnimatedBackgroundProps = {}) {
  const { grade, userName } = useGame();

  // Show the default background image:
  // 1. When explicitly forced (Landing, Login pages)
  // 2. When the user hasn't completed setup yet AND no grade preview is active
  const showDefault = forceDefault || (!userName && !themeOverride);

  if (showDefault) {
    return (
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}${DEFAULT_BG}')` }}
      />
    );
  }

  // After grade is selected in Setup (themeOverride set) or user is logged in, show theme video
  const derivedTheme = getGradeTheme(grade);
  const theme = themeOverride || derivedTheme;

  let bgVid: string | null = null;

  if (theme === 'ocean') {
    bgVid = 'background/background 1.mp4';
  } else if (theme === 'space') {
    bgVid = 'background/backgrounds 2.mp4';
  } else if (theme === 'future') {
    bgVid = 'background/backgrounds 3.mp4';
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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
