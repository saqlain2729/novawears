import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        "ink-soft": "#161618",
        paper: "#FAFAF9",
        "paper-dim": "#F1F0EE",
        silver: "#B8BCC2",
        "silver-light": "#E4E6E9",
        "silver-dark": "#7B8087",
        line: "#26262A",
        "line-light": "#E3E2DF",
        signal: "#C9A24B",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.8s ease forwards",
        scan: "scan 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
