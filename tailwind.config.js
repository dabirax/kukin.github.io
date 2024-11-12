/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/*.jsx", "./src/**/*.jsx", "index.html", "./src/**/**/*.jsx"],
  darkMode: "class",
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
    },
  },
  plugins: [],
};
