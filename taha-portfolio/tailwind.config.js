/** @type {import('tailwindcss').Config} */
const renk = (degisken) => `rgb(var(--${degisken}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: renk("bg"),
        surface: renk("surface"),
        fg: renk("fg"),
        muted: renk("muted"),
        line: renk("line"),
        accent: renk("accent"),
        "accent-2": renk("accent-2"),
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      keyframes: {
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        ilerle: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 8s linear infinite",
        blink: "blink 1s step-end infinite",
        ilerle: "ilerle 4s linear forwards",
      },
    },
  },
  plugins: [],
};
