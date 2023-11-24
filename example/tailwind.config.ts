/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,js,tsx,jsx}',
    '../packages/dm-core/src/**/*.{ts,js,tsx,jsx}',
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
        'equinor-green-light': 'rgba(230, 250, 236, 1)',
      },
    },
  },
  plugins: [],
}
