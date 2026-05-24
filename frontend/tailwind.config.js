/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mulish', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          cream: '#f9f5f0',
          burgundy: '#3d2030',
          'burgundy-deep': '#2a1520',
          rose: '#a86874',
          'rose-dark': '#8a4f5c',
          'rose-light': '#f5e8ea',
          blush: '#eedcdf',
          gold: '#c49a5e',
          'gold-dark': '#a07840',
          'gold-light': '#fdf5e8',
          muted: '#8a7074',
          dark: '#2a1520',
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
