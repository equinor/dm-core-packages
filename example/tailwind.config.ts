/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,js,tsx,jsx}',
    '../packages/dm-core-plugins/src/**/*.{ts,js,tsx,jsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Equinor', 'sans-serif'],
    },
    extend: {
      colors: {
        current: 'currentColor',
        'equinor-green': '#007079',
        'equinor-charcoal': '#6f6f6f',
        'equinor-lightgreen': '#deedee',
        'equinor-lightgray': '#f7f7f7',
      },
    },
  },
  plugins: [],
}
