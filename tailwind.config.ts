import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vt: {
          blue: '#00A3FF',
          green: '#39FF6A',
          'light-blue': '#E8F6FF',
          'light-mint': '#DFFCF0',
          dark: '#1F2937',
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
        soft: '0 4px 24px rgba(0, 163, 255, 0.08)',
        card: '0 8px 32px rgba(31, 41, 55, 0.08)',
        elevated: '0 12px 40px rgba(0, 163, 255, 0.15)',
      },
      backgroundImage: {
        'vt-gradient': 'linear-gradient(135deg, #00A3FF 0%, #39FF6A 100%)',
        'vt-gradient-soft':
          'linear-gradient(180deg, #00A3FF 0%, #00C4FF 40%, #39FF6A 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
