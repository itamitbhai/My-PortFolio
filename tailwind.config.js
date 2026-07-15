/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        bone: "rgb(var(--bone) / <alpha-value>)",
        uv: "#4F2FF0",
        amber: "#FFAE35",
        slate: "rgb(var(--slate) / <alpha-value>)",
        "slate-inverse": "rgb(var(--slate-inverse) / <alpha-value>)",
      },
      fontFamily: {
        display: ['"Clash Display"', "sans-serif"],
        body: ["Satoshi", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        display: "clamp(3rem, 11vw, 12rem)",
      },
    },
  },
  plugins: [],
};
