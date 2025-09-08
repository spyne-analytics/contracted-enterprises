/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0efff',
          100: '#e5e2ff',
          200: '#ccc8ff',
          300: '#a8a1ff',
          400: '#7d6fff',
          500: '#3F37E6',
          600: '#3529d9',
          700: '#2b1fb8',
          800: '#241a95',
          900: '#201877',
        }
      }
    },
  },
  plugins: [],
}
