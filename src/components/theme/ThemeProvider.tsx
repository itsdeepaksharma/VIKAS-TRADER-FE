import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { ThemeToggle } from './ThemeToggle';
import { applyThemeClass, useThemeStore } from '../../store/themeStore';
import { cn } from '../../lib/utils';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = useThemeStore.persist.onFinishHydration(() => {
      applyThemeClass(useThemeStore.getState().theme);
    });

    if (useThemeStore.persist.hasHydrated()) {
      applyThemeClass(useThemeStore.getState().theme);
    }

    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      <div
        className={cn(
          'fixed right-4 top-4 z-[70]',
          isAdminRoute && 'hidden lg:block',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <ThemeToggle />
      </div>
    </>
  );
}
