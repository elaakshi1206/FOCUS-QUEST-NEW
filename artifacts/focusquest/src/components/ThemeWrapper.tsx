import { useEffect } from 'react';
import { useGame } from '@/lib/store';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useGame();

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return <>{children}</>;
}
