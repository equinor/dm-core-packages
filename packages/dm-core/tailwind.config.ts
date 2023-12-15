import { colors } from './src/colors'

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
        ...colors,
      },
    },
  },
  plugins: [],
}
