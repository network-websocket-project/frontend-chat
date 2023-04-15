/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
      serif: ["Georgia", "serif"],
      'montserrat': ["Montserrat", "sans-serif"],
      'ps2p': ["Press Start 2P", "cursive"],
    },
  },
  plugins: [],
};
