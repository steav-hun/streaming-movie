/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red:    '#E50914', // Netflix-style primary
          dark:   '#141414',
          card:   '#1a1a1a',
          muted:  '#6b7280',
        },
      },
      fontFamily: {
        khmer: ['var(--font-khmer)', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, rgba(0,0,0,0.9) 40%, transparent)',
        'card-gradient': 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
      },
    },
  },
  plugins: [],
};