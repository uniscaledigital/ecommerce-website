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
        commerce: {
          DEFAULT: "#214D3B",
          dark: "#1A3E2F",
          light: "#2B634D",
        },
        forest: {
          DEFAULT: "#17392D",
          dark: "#0F261E",
        },
        ivory: {
          DEFAULT: "#FAF7EF",
          card: "#FDFBF7",
          muted: "#F3EDE0",
        },
        christmas: {
          cream: "#F8F3E6",
          badge: "#962D2D",
        },
        gold: {
          DEFAULT: "#E5C781",
          hover: "#D6B467",
          dark: "#8D7017",
        },
        offer: {
          DEFAULT: "#962D2D",
          light: "#B83B3B",
        },
        ink: {
          DEFAULT: "#1F2421",
          muted: "#5A655F",
          light: "#7B8680",
        },
        irishBorder: {
          DEFAULT: "#E8E5DF",
          subtle: "#F0EDE8",
          dark: "#D1CDBF",
        },
        spotlight: "#121413",
      },
      fontFamily: {
        serif: ["Georgia", "Lora", "serif"],
        heading: ["Urbanist", "sans-serif"],
        commerce: ["Outfit", "sans-serif"],
        nav: ["Arial", "Arimo", "sans-serif"],
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(31, 36, 33, 0.06), 0 1px 4px -1px rgba(31, 36, 33, 0.04)",
        dropdown: "0 10px 25px -5px rgba(23, 57, 45, 0.1), 0 8px 10px -6px rgba(23, 57, 45, 0.08)",
        modal: "0 20px 40px -10px rgba(23, 57, 45, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;

