import { useEffect } from 'react';
import { useGame } from '@/lib/store';
import { getGradeTheme } from '@/lib/data';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { grade } = useGame();
  // Derive theme from grade so it stays consistent across all pages
  const theme = getGradeTheme(grade);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return <>{children}</>;
}
