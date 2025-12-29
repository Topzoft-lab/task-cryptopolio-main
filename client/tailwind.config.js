/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Unique color palette - warm/amber accents on deep slate
        primary: {
          50: '#fef7ec',
          100: '#fdecd3',
          200: '#fad5a5',
          300: '#f7b86d',
          400: '#f49332',
          500: '#f17a13', // Main accent - warm amber
          600: '#e25f09',
          700: '#bc440a',
          800: '#963610',
          900: '#792e11',
        },
        secondary: {
          50: '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d4',
          300: '#86efb3',
          400: '#4ade88',
          500: '#22c563', // Teal/green for positive
          600: '#16a34f',
          700: '#15803f',
          800: '#166535',
          900: '#14532c',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b', // Card background
          900: '#0f172a', // Main background
          950: '#020617', // Deepest
        },
        accent: {
          red: '#ef4444',
          green: '#22c55e',
          blue: '#3b82f6',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(241, 122, 19, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(241, 122, 19, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(241, 122, 19, 0.15)',
        'glow-md': '0 0 25px rgba(241, 122, 19, 0.25)',
        'glow-lg': '0 0 40px rgba(241, 122, 19, 0.35)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
}
