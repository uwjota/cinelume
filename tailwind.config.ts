import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cine: {
          brand: "#E50914",
          "brand-hover": "#C40812",
          bg: "#09090B",
          surface: "#111114",
          "surface-elevated": "#19191D",
          border: "#29292F",
          "text-primary": "#FFFFFF",
          "text-secondary": "#A1A1AA",
          "text-muted": "#8A8A94",
          success: "#22C55E",
          warning: "#F59E0B",
        },
      },
      borderRadius: {
        cineSmall: "8px",
        cineMedium: "10px",
        cineCard: "12px",
        cineLarge: "16px",
        cinePill: "999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        smooth: "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
