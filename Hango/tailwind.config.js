/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#2997FF",
        gray: {
          DEFAULT: "#86868b",
          100: "#1d1d1f",
          200: "#424245",
          300: "#e5e5ea70",
        },
        zinc: "#f5f5f7",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      fontFamily: {
        k2d: ["K2D", "sans-serif"],
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      fontFamily: {
        inter: ["menulis", "sans-serif"],
      },
    },
  },
  plugins: [],
};