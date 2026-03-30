import { useEffect } from 'react';
import { useGame } from '@/lib/store';
import { getGradeTheme, getMascotThemeProps } from '@/lib/data';

declare global {
  interface Window {
    botpress: any;
  }
}

export function BotpressChat() {
  const { userName, grade, xp, level, streak, theme } = useGame();
  
  // ─── Theme ─────────────────────────────────────────────────────
  const gradeTheme = getGradeTheme(grade);
  const { emoji, name: mascotName } = getMascotThemeProps(gradeTheme);

  useEffect(() => {
    // 1. Inject Botpress Scripts if not present
    if (!document.getElementById('botpress-inject')) {
      const injectScript = document.createElement('script');
      injectScript.id = 'botpress-inject';
      injectScript.src = "https://cdn.botpress.cloud/webchat/v3.6/inject.js";
      document.body.appendChild(injectScript);

      const configScript = document.createElement('script');
      configScript.id = 'botpress-config';
      configScript.src = "https://files.bpcontent.cloud/2026/03/30/10/20260330104644-EN00AXJU.js";
      configScript.defer = true;
      document.body.appendChild(configScript);
    }

    // 2. Sync User Context when Botpress is ready
    const syncUser = () => {
      if (window.botpress && typeof window.botpress.setUserData === 'function') {
        window.botpress.setUserData({
          name: userName || 'Hero',
          grade: grade,
          xp: xp,
          level: level,
          streak: streak,
          theme: theme,
          mascot: mascotName,
          mascotEmoji: emoji
        });
        
        window.botpress.setContext({
          current_grade: grade,
          current_level: level,
          active_mascot: mascotName
        });

        console.info('[FocusQuest] Botpress context synchronized ✅');
      } else {
        // Retry after a short delay if botpress isn't initialized yet
        setTimeout(syncUser, 1000);
      }
    };

    const handleBotLoaded = () => syncUser();
    window.addEventListener('botpress:ready', handleBotLoaded);
    
    // Initial attempt
    syncUser();

    return () => {
      window.removeEventListener('botpress:ready', handleBotLoaded);
    };
  }, [userName, grade, xp, level, streak, theme, mascotName, emoji]);

  return null; // This component handles the global widget, no UI needed
}
