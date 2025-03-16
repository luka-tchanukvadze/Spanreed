import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "backdrop-blur",
    "backdrop-blur-sm",
    "backdrop-blur-md",
    "backdrop-blur-lg",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
