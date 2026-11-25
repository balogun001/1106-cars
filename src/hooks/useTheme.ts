'use client';

import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const isMounted = useThemeStore((state) => state.isMounted);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isMounted,
    setTheme,
    toggleTheme,
  };
}
