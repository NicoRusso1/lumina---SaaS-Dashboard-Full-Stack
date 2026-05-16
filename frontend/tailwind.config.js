/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: {
          base: '#09090f',
          surface: '#0f0f17',
          elevated: '#141420',
          overlay: '#1a1a28',
          border: '#1e1e30',
        },
        violet: {
          DEFAULT: '#7c6af7',
          light: '#9d8ff9',
          dim: '#5b4fd4',
          glow: 'rgba(124,106,247,0.2)',
          subtle: 'rgba(124,106,247,0.08)',
          border: 'rgba(124,106,247,0.25)',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#8888a4',
          muted: '#44445a',
          accent: '#7c6af7',
        },
        success: {
          DEFAULT: '#22c55e',
          subtle: 'rgba(34,197,94,0.08)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          subtle: 'rgba(245,158,11,0.08)',
        },
        danger: {
          DEFAULT: '#ef4444',
          subtle: 'rgba(239,68,68,0.08)',
        },
        info: {
          DEFAULT: '#3b82f6',
          subtle: 'rgba(59,130,246,0.08)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-slow': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'skeleton': 'skeleton 1.6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        skeleton: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.7' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(124,106,247,0.2)' },
          '50%': { boxShadow: '0 0 24px rgba(124,106,247,0.4)' },
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(124,106,247,0.2)',
        'glow-sm': '0 0 12px rgba(124,106,247,0.15)',
        'glow-lg': '0 0 40px rgba(124,106,247,0.25)',
        card: '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,106,247,0.15)',
        modal: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backdropBlur: {
        xs: '4px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
