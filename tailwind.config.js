/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      colors: {
        indigo: {
          25: '#f5f5ff',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 70%)',
        'hero-glow-dark': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
      },
      boxShadow: {
        'pill': '0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(99,102,241,0.08)',
        'card': '0 4px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(99,102,241,0.07)',
        'card-hover': '0 16px 48px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.15)',
        'nav': '0 8px 32px rgba(99,102,241,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        'nav-base': '0 2px 12px rgba(0,0,0,0.04)',
        'cta': '0 4px 20px rgba(67,56,202,0.35)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
