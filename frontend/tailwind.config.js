/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          cream: '#fef9f5',
          burgundy: '#2d4282',
          'burgundy-deep': '#1e2f62',
          rose: '#eb5e44',
          'rose-dark': '#c94a32',
          'rose-light': '#fdf0ec',
          blush: '#f0e0d6',
          gold: '#f5b945',
          'gold-dark': '#c47d0e',
          'gold-light': '#fef8e7',
          muted: '#7a6960',
          dark: '#1c1410',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease both',
        'fade-in': 'fadeIn 0.3s ease both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
