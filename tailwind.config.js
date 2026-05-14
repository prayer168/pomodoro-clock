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
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'none' } },
      },
    },
  },
  plugins: [],
}
