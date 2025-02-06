/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "animMenu": "menu 0.5s ease 1",
      },
      keyframes: {
        menu: {
          "0%": { transform: 'translateY(-100%)', opacity: "0" },
          "100%": { transform: 'translateY(0%)', opacity: "1" },
        },
      },
      colors: {
        'footer': 'rgb(43, 33, 31)',
        'myRed': '',
      },
      screens: {
        'xs': '400px'
      },
      fontFamily: {
        cursive: ['"Great Vibes"', 'cursive'], // Exemple de police cursive
        serif: ['Georgia', 'serif'], // Exemple de police sérif classique
      },
      colors: {
        primary: "#00C2FF",
        secondary: "#DD0BFF",
      },
      container: {
        padding: {
          center: true,
          default: "1rem",
          sm: "3rem",
        }
      },
      animation: {
        'move-wrapper': 'move-wrapper 25s ease-in-out infinite forwards',
      },
      keyframes: {
        'move-wrapper': {
          '0%': {
            transform: 'translate(150%, 30%) rotate(0) scale(0.8)',
          },
          '50%': {
            transform: 'translate(60vw, 0vh) rotate(150deg) scale(1.2)',
          },
          '100%': {
            transform: 'translate(40vw, 40vh) rotate(0deg) scale(0.8)',
          },
        }
      },
    },
  },
  plugins: [],
};
