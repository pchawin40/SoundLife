import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C1917",
        paper: "#FAFAF8",
        surface: "#FFFFFF",
        cream: "#FAFAF8",
        muted: "#78716C",
        subtle: "#A8A29E",
        border: "#E7E5E4",
        brand: {
          teal: "#0D9488",
          tealSoft: "#14B8A6",
          violet: "#7C3AED",
          violetSoft: "#8B5CF6",
          amber: "#D97706",
          amberSoft: "#F59E0B",
          coral: "#DC2626",
          lime: "#16A34A",
          gold: "#CA8A04",
          pink: "#DB2777",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"Segoe UI"',
          "Inter",
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.05)",
        "card-lg": "0 12px 40px -8px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06)",
        glow: "0 0 48px -8px rgba(13, 148, 136, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
