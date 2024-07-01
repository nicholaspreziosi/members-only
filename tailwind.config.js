/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.ejs", "./public/javascripts/*.js"],
  theme: {
    fontFamily: {
      inter: ["inter", "sans-serif"],
      nunito: ["nunito_sans", "sans-serif"],
      figtree: ["figtree", "sans-serif"],
    },
  },
  plugins: [],
};
