/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media", // or 'class'
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        secondary: "var(--secondary)",
        gold: "var(--gold)",
        "gold-light": "var(--gold-light)",
        bamboo: "var(--bamboo)",
        matcha: "var(--matcha)",
        umber: "var(--umber)",
        gray: {
          50: "var(--color-gray-50)",
          100: "var(--color-gray-100)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
          600: "var(--color-gray-600)",
          700: "var(--color-gray-700)",
          800: "var(--color-gray-800)",
          900: "var(--color-gray-900)",
        },
      },
      backgroundImage: {
        "paper-texture-light": "var(--paper-texture-light)",
        "paper-texture-dark": "var(--paper-texture-dark)",
        "ink-texture": "var(--ink-texture)",
        "kanji-bg": "var(--kanji-bg)",
        "jpaper": "var(--paper-texture-light)",
        "jpaper-dark": "var(--paper-texture-dark)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        jp: ["var(--font-noto-serif-jp)"],
      },
    },
  },
  plugins: [],
}; 