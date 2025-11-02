import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('zenora-theme') as Theme;
    return stored || 'dark'; // Default to dark as requested
  });

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (themeToApply: 'light' | 'dark') => {
      root.classList.remove('light', 'dark');
      root.classList.add(themeToApply);
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
    }

    localStorage.setItem('zenora-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
