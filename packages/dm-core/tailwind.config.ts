import {
  isolateInsideOfContainer,
  scopedPreflightStyles,
} from 'tailwindcss-scoped-preflight'

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
        'equinor-lightgreen': '#deedee',
        'equinor-lightgray': '#f7f7f7',
      },
    },
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer('.dm-preflight'),
    }),
  ],
}
