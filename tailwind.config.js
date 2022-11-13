module.exports = {
  content: [
    './src/renderer/**/*.{html,js,jsx,tsx,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans'],
      },
      gridTemplateColumns: {
        '1/5': '1fr 5fr',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
