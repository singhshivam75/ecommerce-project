import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        dark: "#0f172a",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;