/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    fontFamily: {
      trans: ["transducer", "sans-serif"],
      extended: ["transducer-extended", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
