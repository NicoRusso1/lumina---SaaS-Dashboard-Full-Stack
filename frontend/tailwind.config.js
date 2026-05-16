/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Base dark surface
        bg: {
          base: '#0a0a0f',
          surface: '#0f0f17',
          elevated: '#16161f',
          overlay: '#1c1c28',
          border: '#1e1e2e',
        },
        // Accent
        violet: {
          DEFAULT: '#7c6af7',
          dim: '#5b4fd4',
          glow: 'rgba(124,106,247,0.15)',
          subtle: 'rgba(124,106,247,0.08)',
        },
        // Text
        text: {
          primary: '#e8e8f0',
          secondary: '#8888a4',
          muted: '#44445a',
          accent: '#7c6af7',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        skeleton: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(124,106,247,0.15)',
        card: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        modal: '0 24px 64px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
