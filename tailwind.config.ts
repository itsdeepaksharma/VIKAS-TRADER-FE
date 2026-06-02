import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        vt: {
          blue: 'var(--vt-blue)',
          cyan: 'var(--vt-cyan)',
          'cyan-light': 'var(--vt-cyan-light)',
          'cyan-dark': 'var(--vt-cyan-dark)',
          navy: 'var(--vt-navy)',
          'navy-light': 'var(--vt-navy-light)',
          mint: 'var(--vt-mint)',
          'mint-light': 'var(--vt-mint-light)',
          'mint-pale': 'var(--vt-mint-pale)',
          gold: 'var(--vt-cyan)',
          'gold-light': 'var(--vt-cyan-light)',
          'gold-dark': 'var(--vt-cyan-dark)',
          silver: 'var(--vt-mint)',
          'silver-light': 'var(--vt-mint-light)',
          'silver-dark': 'var(--vt-navy-light)',
          beige: 'var(--vt-mint-pale)',
          'beige-light': 'var(--vt-surface-muted)',
          'beige-warm': 'var(--vt-surface-muted)',
          'light-blue': 'var(--vt-accent-soft)',
          'light-mint': 'var(--vt-mint-light)',
          dark: 'var(--vt-foreground)',
          foreground: 'var(--vt-foreground)',
          muted: 'var(--vt-muted-foreground)',
          surface: 'var(--vt-surface)',
          border: 'var(--vt-border)',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        soft: 'var(--vt-shadow-soft)',
        card: 'var(--vt-shadow-card)',
        elevated: 'var(--vt-shadow-elevated)',
      },
      backgroundImage: {
        'vt-gradient': 'var(--vt-gradient)',
        'vt-gradient-soft': 'var(--vt-page-bg)',
        'vt-gradient-card': 'var(--vt-gradient-card)',
      },
    },
  },
  plugins: [],
} satisfies Config;
