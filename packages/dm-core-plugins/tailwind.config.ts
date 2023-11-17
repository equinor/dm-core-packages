/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        'equinor-green': '#007079',
      },
    },
  },
  plugins: [],
}
