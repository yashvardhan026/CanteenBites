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
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
        food: {
          veg: "#16A34A",
          nonveg: "#DC2626",
          accent: "#F97316",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(99, 102, 241, 0.12)',
        'card': '0 2px 12px -2px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(99, 102, 241, 0.08)',
        'elevated': '0 16px 36px -6px rgba(15, 23, 42, 0.14)',
        'glow': '0 0 25px rgba(99, 102, 241, 0.28)',
        'glow-sm': '0 0 14px rgba(99, 102, 241, 0.20)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' },
        },
        'badge-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.2)' },
          '70%': { transform: 'scale(0.92)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slide-up 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'badge-bounce': 'badge-bounce 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;
