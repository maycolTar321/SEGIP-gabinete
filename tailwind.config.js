/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        segip: {
          50: '#F0F6FE',
          100: '#DCEBFC',
          200: '#BFDCFA',
          300: '#91C4F6',
          400: '#5DA5F0',
          500: '#2E81E6',
          600: '#1765CB',
          700: '#0F4EA5',
          800: '#0C3F85',
          900: '#082E64',
          950: '#041B3E',
        },
        navy: {
          800: '#0a2347',
          900: '#061730',
          950: '#030c1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
