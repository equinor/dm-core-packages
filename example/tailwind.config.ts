/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,js,ts,tsx}'],
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
