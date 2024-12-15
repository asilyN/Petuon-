/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}", // update this path as per your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#e0e7e7",
          300: "#b3c1c1",
          500: "#719191",
          700: "#4a6464",
          900: "#2b3e3e",
        },
        secondary: {
          100: "#e5f7f0",
          300: "#b3e7d4",
          500: "#7fd7b7",
          700: "#56b092",
          900: "#34816e",
        },
        neutral: {
          100: "#ececec",
          300: "#c5c5c5",
          500: "#9e9e9e",
          700: "#5f5f5f",
          900: "#3f3f3f",
        },
        semantics: {
          success: "#28A745",
          warning: "#FFE207",
          error: "#DC3545",
        },
        shades: {
          light: "#ffffff",
          dark: "#333333",
        },
      },
    },
  },
  plugins: [],
};

