'use client';

import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../store/themeStore';

interface ThemeToggleProps {
  variant?: 'icon' | 'segmented';
  className?: string;
}

const THEME_OPTIONS: {
  value: Theme;
  label: string;
  Icon: typeof SunIcon;
}[] = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
  { value: 'system', label: 'System', Icon: ComputerDesktopIcon },
];

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { theme, isDark, isMounted, setTheme, toggleTheme } = useTheme();

  if (!isMounted) {
    return (
      <div
        aria-hidden="true"
        className={classNames(
          'rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse',
          variant === 'segmented' ? 'h-9 w-48' : 'h-9 w-9',
          className
        )}
      />
    );
  }

  if (variant === 'segmented') {
    return (
      <div
        role="radiogroup"
        aria-label="Theme selection"
        className={classNames(
          'inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1',
          className
        )}
      >
        {THEME_OPTIONS.map(({ value, label, Icon }) => {
          const isActive = theme === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setTheme(value)}
              className={classNames(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-gray-600 hover:text-foreground dark:text-gray-400'
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={classNames(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800',
        className
      )}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
