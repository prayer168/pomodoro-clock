/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mode colours (sci-fi palette)
        focus: { DEFAULT: '#38bdf8', dim: '#38bdf820', glow: '#38bdf840' },
        short: { DEFAULT: '#34d399', dim: '#34d39920', glow: '#34d39940' },
        long:  { DEFAULT: '#a78bfa', dim: '#a78bfa20', glow: '#a78bfa40' },
        // Space background
        space: { DEFAULT: '#020c1b', card: '#050f1f', line: '#0f2040' },
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'shake':      'shake 0.4s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'ring-spin':  'ringRotate 25s linear infinite',
        'scanline':   'scanline 6s linear infinite',
        'dataflow':   'dataflow 14s linear infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'none' } },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-6px)' },
          '30%': { transform: 'translateX(6px)' },
          '45%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
        },
        ringRotate: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        scanline:   { '0%': { top: '-2px' }, '100%': { top: '100%' } },
        dataflow:   { '0%': { transform: 'translateY(-120%)' }, '100%': { transform: 'translateY(120vh)' } },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
