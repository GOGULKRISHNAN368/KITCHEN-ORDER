/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#ff8c00', // Kitchen Orange
        },
        green: {
          500: '#22c55e', // Completion Green
        }
      }
    },
  },
  plugins: [],
}
