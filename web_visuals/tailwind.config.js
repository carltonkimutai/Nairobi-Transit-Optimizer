/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          text: '#E5E7EB',
        },
        tier1: '#3B82F6', // Blue for white-collar
        tier3: '#8B5CF6', // Purple for blue-collar
        penalty: '#EF4444', // Red for penalty highlighting
      },
    },
  },
  plugins: [],
}
