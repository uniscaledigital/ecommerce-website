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
        // Official Brand Color Tokens (Specification)
        brand: {
          background: "#FDF4E3",
          surface: "#FFFAF1",
          card: "#FFFFFF",
          "soft-green": "#E8F5E9",
          "soft-cream": "#F7EBD8",
          border: "#E8DFCF",
          primary: "#14532D",
          dark: "#064E3B",
          accent: "#22C55E",
          text: "#1F2937",
          muted: "#64748B",
        },
        // Core Theme Tokens
        primary: {
          DEFAULT: "#14532D",
          hover: "#064E3B",
          light: "#1B6B3B",
        },
        accent: {
          DEFAULT: "#22C55E",
          hover: "#16A34A",
          light: "#86EFAC",
        },
        surface: {
          DEFAULT: "#FFFAF1",
          card: "#FFFFFF",
          cream: "#FDF4E3",
          muted: "#F7EBD8",
        },
        irish: {
          bg: "#FDF4E3",
          card: "#FFFAF1",
          text: "#1F2937",
          muted: "#4B5563",
          border: "#E8DFCF",
        },
        commerce: {
          DEFAULT: "#14532D",
          dark: "#064E3B",
          light: "#1B6B3B",
        },
        forest: {
          DEFAULT: "#14532D",
          dark: "#064E3B",
        },
        ivory: {
          DEFAULT: "#FDF4E3",
          card: "#FFFAF1",
          muted: "#F7EBD8",
        },
        christmas: {
          cream: "#FDF4E3",
          badge: "#962D2D",
        },
        gold: {
          DEFAULT: "#22C55E",
          hover: "#16A34A",
          dark: "#14532D",
        },
        offer: {
          DEFAULT: "#DC2626",
          light: "#EF4444",
        },
        ink: {
          DEFAULT: "#1F2937",
          muted: "#4B5563",
          light: "#6B7280",
        },
        irishBorder: {
          DEFAULT: "#E8DFCF",
          subtle: "#F5EFE4",
          dark: "#D9CDBA",
        },
        spotlight: "#FFFAF1",
        product: {
          cardBg: "#EDF8E9",
          imageBg: "#DDF1D5",
          contentBg: "#EDF8E9",
          border: "#D0E7C9",
          text: "#14532D",
          muted: "#42634A",
          accent: "#22C55E",
          stock: "#22C55E",
          buttonBorder: "#62A86A",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        heading: ["Manrope", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        commerce: ["Inter", "sans-serif"],
        nav: ["Inter", "sans-serif"],
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
        product: "0 6px 18px rgba(20, 83, 45, 0.09)",
        productHover: "0 10px 24px rgba(20, 83, 45, 0.12)",
        card: "0 2px 10px -2px rgba(31, 41, 55, 0.05), 0 1px 4px -1px rgba(31, 41, 55, 0.03)",
        cardHover: "0 10px 25px -5px rgba(20, 83, 45, 0.08), 0 8px 10px -6px rgba(20, 83, 45, 0.04)",
        dropdown: "0 10px 25px -5px rgba(20, 83, 45, 0.1), 0 8px 10px -6px rgba(20, 83, 45, 0.08)",
        modal: "0 25px 50px -12px rgba(20, 83, 45, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
