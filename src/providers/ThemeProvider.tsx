'use client';

import { useEffect } from 'react';
import {
  THEME_STORAGE_KEY,
  isValidTheme,
  useThemeStore,
} from '../store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initTheme = useThemeStore((state) => state.initTheme);
  const syncSystemTheme = useThemeStore((state) => state.syncSystemTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    initTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      syncSystemTheme();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const nextTheme = isValidTheme(event.newValue)
        ? event.newValue
        : 'system';
      setTheme(nextTheme);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initTheme, syncSystemTheme, setTheme]);

  return children;
}
