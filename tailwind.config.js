/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        "appear-to-left": {
          "0%": { opacity: "0%", transform: "translate(200%, 0%)" },
          "75%": { opacity: "100%" },
          "100%": { opacity: "100%", transform: "translate(0%, 0%)" }
        }
      }
    },
  },
  plugins: [],
}

