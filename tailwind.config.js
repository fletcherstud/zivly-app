/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B8B', // Mid pink
          light: '#FF8FA3',
          dark: '#E64D6D',
        },
        secondary: {
          DEFAULT: '#F8F9FA', // Off white
          light: '#FFFFFF',
          dark: '#E9ECEF',
        },
        accent: {
          DEFAULT: '#6C5CE7', // Purple accent
          light: '#8A7EEF',
          dark: '#5B4CC4',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
} 