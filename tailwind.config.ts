import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#111827",
        steel: "#334155",
        coolant: "#00a7b5",
        signal: "#f5b700",
        oxide: "#d6502a"
      },
      boxShadow: {
        panel: "0 16px 45px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
