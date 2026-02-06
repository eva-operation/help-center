/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"]
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "10px"
      }
    }
  },
  plugins: []
};
