/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B5B95',
        secondary: '#88B04B',
        accent: '#F7CAC9',
        background: '#FAF9F7',
        'text-primary': '#2D2D2D',
        'text-secondary': '#6B6B6B',
        mood: {
          happy: '#FFD93D',
          calm: '#6BCB77',
          anxious: '#FF9F45',
          sad: '#4D96FF',
          angry: '#FF6B6B',
          fearful: '#9B59B6',
          surprised: '#00D2D3',
        },
        category: {
          relaxation: '#9B59B6',
          exercise: '#27AE60',
          creative: '#E74C3C',
          social: '#3498DB',
          growth: '#F39C12',
          sensory: '#FF69B4',
          organize: '#00BCD4',
          nature: '#4CAF50',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
