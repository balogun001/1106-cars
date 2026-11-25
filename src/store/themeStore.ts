import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  isMounted: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  syncSystemTheme: () => void;
  initTheme: () => void;
}

export function isValidTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

export function applyThemeToDom(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidTheme(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

function writeStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  resolvedTheme: 'light',
  isMounted: false,

  setTheme: (theme) => {
    const resolved = resolveTheme(theme);
    writeStoredTheme(theme);
    applyThemeToDom(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const nextTheme: Theme = get().resolvedTheme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },

  syncSystemTheme: () => {
    const { theme } = get();
    if (theme !== 'system') return;
    const resolved = getSystemTheme();
    applyThemeToDom(resolved);
    set({ resolvedTheme: resolved });
  },

  initTheme: () => {
    const stored = readStoredTheme();
    const resolved = resolveTheme(stored);
    applyThemeToDom(resolved);
    set({ theme: stored, resolvedTheme: resolved, isMounted: true });
  },
}));
