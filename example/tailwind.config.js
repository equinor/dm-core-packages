/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,js,tsx,jsx}',
    '../packages/dm-core/src/**/*.{ts,js,tsx,jsx}',
    '../packages/dm-core-plugins/src/**/*.{ts,js,tsx,jsx}',
  ],
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
