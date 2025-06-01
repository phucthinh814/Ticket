/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Bật dark mode với class 'dark'
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a202c',
        'dark-text': '#e2e8f0',
        'dark-border': '#2d3748',
      },
    },
  },
  plugins: [],
};