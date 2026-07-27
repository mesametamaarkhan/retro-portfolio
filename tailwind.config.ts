import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-vt323)', 'VT323', 'monospace'],
        mono: ['var(--font-plex)', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        'crt-bg': '#0a0f0a',
        'crt-bg-soft': '#0e140e',
        'crt-panel': '#0c130c',
        'crt-text': '#c8ffd0',
        'crt-text-dim': '#6fae7a',
        'crt-accent': '#39ff14',
        'crt-accent-dim': '#1f8a16',
        'crt-border': '#39ff14',
        'crt-border-dim': '#1a5a12',
        'crt-amber': '#ffb000',
      },
      boxShadow: {
        'crt-glow': '0 0 8px rgba(57,255,20,0.35), 0 0 20px rgba(57,255,20,0.15)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
