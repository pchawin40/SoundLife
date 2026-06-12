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
        ink: "#0F0D0B",
        cream: "#F5F1EA",
        brand: {
          teal: "#00897B",
          tealSoft: "#26A69A",
          violet: "#5C35A0",
          violetSoft: "#7E57C2",
          amber: "#D4860A",
          amberSoft: "#F0A82E",
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
        card: "0 24px 48px -16px rgba(0, 0, 0, 0.55)",
        glow: "0 0 48px -8px rgba(0, 137, 123, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
