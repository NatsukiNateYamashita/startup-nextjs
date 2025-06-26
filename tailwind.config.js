/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        white: "var(--color-white)",
        black: "var(--color-black)",
        dark: "var(--color-dark)",
        "body-color": "var(--color-body-color)",
        "body-color-dark": "var(--color-body-color-dark)",
      },
    },
  },
  plugins: [],
} 