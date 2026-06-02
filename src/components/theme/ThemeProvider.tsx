import { useEffect, type ReactNode } from 'react';

const THEME_COLOR_META = 'theme-color';
const APPLE_STATUS_META = 'apple-mobile-web-app-status-bar-style';

function applySystemTheme() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--vt-theme-color').trim();

  document.querySelector(`meta[name="${THEME_COLOR_META}"]`)?.setAttribute('content', themeColor || (isDark ? '#0A1F35' : '#ECF7F4'));
  document
    .querySelector(`meta[name="${APPLE_STATUS_META}"]`)
    ?.setAttribute('content', isDark ? 'black-translucent' : 'default');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applySystemTheme();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applySystemTheme();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return children;
}
