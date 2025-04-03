const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "#7FB3D5",
        input: "#A9CCE3",
        ring: "#5499C7",
        background: {
          DEFAULT: "#EBF5FB",
          dark: "#17202A",
        },
        foreground: "#21618C",
        primary: {
          DEFAULT: "#5499C7",
          foreground: "#FFFFFF",
          light: "#A9CCE3",
          dark: "#2980B9",
          darker: "#1A5276",
        },
        secondary: {
          DEFAULT: "#85C1E9",
          foreground: "#FFFFFF",
          light: "#D6EAF8",
          dark: "#3498DB",
        },
        destructive: {
          DEFAULT: "#D32F2F",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#D4E6F1",
          darker: "#566573",
          foreground: "#797D7F",
        },
        accent: {
          DEFAULT: "#AED6F1",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#EBF5FB",
          foreground: "#5499C7",
        },
        card: {
          DEFAULT: "#EBF5FB",
          foreground: "#5499C7",
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
