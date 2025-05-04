/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'calculator-darkblue': '#0a0b0f',
        'calculator-card': '#141625',
        'calculator-primary': '#7c5dfa',
        'calculator-secondary': '#9277ff',
      },
    },
  },
  plugins: [],
};