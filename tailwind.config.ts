import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
  	extend: {
  		colors: {
        // Primary colors (Purple)
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          950: "var(--primary-950)",
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        // Secondary colors (Teal)
        secondary: {
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
          950: "var(--secondary-950)",
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        // Base colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Border colors
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
          accent: "var(--border-accent)",
          secondary: "var(--border-secondary)",
        },
      },
      backgroundImage: {
        'card-1': 'var(--card-bg-1)',
        'card-2': 'var(--card-bg-2)',
        'card-3': 'var(--card-bg-3)',
        'card-4': 'var(--card-bg-4)',
        'card-5': 'var(--card-bg-5)',
        'card-6': 'var(--card-bg-6)',
        'card-7': 'var(--card-bg-7)',
        'card-8': 'var(--card-bg-8)',
      },
  		borderRadius: {
  		}
  	}
  },
  plugins: [],
} satisfies Config;
