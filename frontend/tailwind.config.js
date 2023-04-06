/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./icons/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
      },
    },
    extend: {
      animation: {
        ripple: "ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite",
        "ripple-delay": "ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite 0.5s",
      },
      keyframes: {
        ripple: {
          "0%": {
            top: "50%",
            left: "50%",
            width: 0,
            height: 0,
            opacity: 0,
          },
          "4.9%": { opacity: 0 },
          "5%": { opacity: 1 },
          "100%": {
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
  daisyui: {
    themes: ["winter", "night"],
    darkTheme: "night",
  },
};
