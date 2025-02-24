/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        'nba-blue': '#1d428a',
        'nba-red': '#c8102e',
        'electric-blue': '#00a0dc',
        'gold': '#fdb927',
        'silver': '#b4b4b4',
      },
      animation: {
        'scoreboard-flip': 'scoreboardFlip 0.5s ease-out',
        'correct-answer': 'correctAnswer 1s ease',
        'wrong-answer': 'wrongAnswer 0.5s ease',
      },
    },
  },
  plugins: [],
};