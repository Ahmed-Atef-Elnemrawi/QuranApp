/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: [
    "./src/**/*.{scss,html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'text': 'var(--text)',
        'background': 'var(--background)',
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'accent': 'var(--accent)',
       },
       fontSize: {
        sm: '0.750rem',
        base: '1rem',
        xl: '1.333rem',
        '2xl': '1.777rem',
        '3xl': '2.369rem',
        '4xl': '3.158rem',
        '5xl': '4.210rem',
      },
      fontFamily: {
        heading: 'NotoSerif',
        body: 'Rubik',
      },
      fontWeight: {
        normal: '400',
        medium:'500',
        bold: '700',
        extraBold:'900'
      },
    },
  },
  plugins: [],
}

