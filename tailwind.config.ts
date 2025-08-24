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
        // Primary color palette
        primary: {
          50: '#f4f0f0',   // Light gray background
          100: '#ebe7e7',   // Hover state
          200: '#d0252d',   // Darker red hover
          500: '#ea2a33',   // Primary red
          900: '#181111',   // Dark text
        },
        // Secondary color palette  
        secondary: {
          100: '#886364',   // Muted text
          200: '#f4f0f0',  // Light background
          300: '#ebe7e7',   // Hover background
        },
        // Semantic colors
        success: {
          500: '#10b981',   // Green for success states
        },
        warning: {
          500: '#f59e0b',   // Amber for warnings
        },
        error: {
          500: '#ef4444',   // Red for errors
        },
      },
      // Custom button styles
      button: {
        primary: 'bg-primary-500 text-white hover:bg-primary-200 disabled:opacity-60 disabled:cursor-not-allowed',
        secondary: 'bg-primary-50 text-primary-900 hover:bg-primary-100',
        outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50',
        ghost: 'text-primary-500 hover:bg-primary-50',
      },
    },
  },
  plugins: [],
};

export default config; 