/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-yellow': '#FFDD00',
        'neo-pink': '#FF6B9D',
        'neo-blue': '#4ECDC4',
        'neo-green': '#A8E6CF',
        'neo-orange': '#FF8B3D',
        'neo-black': '#1A1A1A',
        'neo-white': '#FAFAFA',
      },
      boxShadow: {
        'neo': '4px 4px 0px #1A1A1A',
        'neo-lg': '6px 6px 0px #1A1A1A',
        'neo-xl': '8px 8px 0px #1A1A1A',
      }
    },
  },
  plugins: [],
}