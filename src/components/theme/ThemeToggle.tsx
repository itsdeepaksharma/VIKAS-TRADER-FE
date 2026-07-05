import { Moon, Sun } from 'lucide-react';

import { cn } from '../../lib/utils';
import { useThemeStore } from '../../store/themeStore';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to night mode'}
      title={isDark ? 'Light mode' : 'Night mode'}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl border border-vt-border bg-vt-surface text-vt-foreground shadow-vt-card transition-colors hover:bg-vt-surface-hover',
        className,
      )}
    >
      {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-vt-blue" />}
    </button>
  );
}
