import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        background: "#0B1120",
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        red: {
          400: '#F87171',
          500: '#EF4444',
        },
      },
      opacity: {
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '40': '0.4',
        '60': '0.6',
        '75': '0.75',
        '80': '0.8',
        '90': '0.9',
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config; 