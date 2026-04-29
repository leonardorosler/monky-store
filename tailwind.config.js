/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        ivory: '#FAFAF7',
        charcoal: '#1A1A1A',
        muted: '#6B6B6B',
        accent: '#B5883A',
        'accent-light': '#F5EDD8',
        border: '#E8E8E2',
      },
    },
  },
  plugins: [],
}
