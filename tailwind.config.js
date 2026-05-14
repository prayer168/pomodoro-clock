/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        focus:  { DEFAULT: '#ef4444', ring: '#fca5a5' },
        short:  { DEFAULT: '#22c55e', ring: '#86efac' },
        long:   { DEFAULT: '#3b82f6', ring: '#93c5fd' },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'shake': 'shake 0.4s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'none' } },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '15%':     { transform: 'translateX(-6px)' },
          '30%':     { transform: 'translateX(6px)' },
          '45%':     { transform: 'translateX(-4px)' },
          '60%':     { transform: 'translateX(4px)' },
          '75%':     { transform: 'translateX(-2px)' },
        },
      },
    },
  },
  plugins: [],
}
