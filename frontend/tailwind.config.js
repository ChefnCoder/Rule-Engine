/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // All JavaScript/TypeScript files in the src folder
    "./public/index.html",         // If using Tailwind classes in index.html
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
