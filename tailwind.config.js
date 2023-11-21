/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1530px",
    },
    extend: {
      fontFamily: {
        sans: ["'Source Sans 3'", "Segoe UI","sans-serif"],
      }
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#48BF84",
          "primary-content": "#DFDFDF",
          "secondary": "#1D9BF0",
          "secondary-content": "#DFDFDF",
          "accent": "#404045",
          "neutral": "#303035",
          "base-100": "#1D1E20",
          "base-200": "#303035",
          "base-300": "#404045",
          "base-content": "#F7F7F7",
          "info": "#3ABFF8",
          "success": "#3DA35D",
          "warning": "#E6B749",
          "error": "#FA646B",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}

