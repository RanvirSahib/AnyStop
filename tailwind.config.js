/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5ec',
          100: '#ffe8d5',
          500: '#ff5a4e',
          600: '#e8433a',
          700: '#c52e26',
        },
        transit: {
          ink: '#231f3d',
          night: '#15122b',
          surface: '#211c40',
          muted: '#6b6585',
          line: '#ebddd0',
          teal: '#0b8f82',
          tealbg: '#d8f5f0',
          sun: '#ffb020',
          sunbg: '#fff0d0',
        }
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        display: ['Bricolage Grotesque', 'Georgia', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
