/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,js,tsx,jsx}'],
  theme: {
    fontFamily: {
      sans: ['Equinor', 'sans-serif'],
    },
    extend: {
      colors: {
        current: 'currentColor',
        'equinor-green': '#007079',
        'equinor-charcoal': '#6f6f6f',
        'equinor-hover-light-green': '#deedee',
        'equinor-light-gray-background': '#f7f7f7',
      },
    },
  },
  plugins: [],
}
