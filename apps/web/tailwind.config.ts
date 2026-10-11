import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // FamilyConnect premium tokens: soft rose/blush primary + warm plum neutrals.
        brand: {
          50: '#fff1f5',
          100: '#ffe4ee',
          200: '#fbcfe0',
          300: '#f9a8cb',
          400: '#f472b6',
          500: '#db2777',
          600: '#be185d',
          700: '#9d174d',
          800: '#831843',
          900: '#5b1233',
          950: '#3a0a20',
        },
        ink: {
          50: '#fbf8fa',
          100: '#f3edf1',
          200: '#e6dbe2',
          300: '#cbb6c4',
          400: '#a98a9e',
          500: '#8a6a7e',
          600: '#6e5262',
          700: '#543e4b',
          800: '#3b2b35',
          900: '#2a1e26',
          950: '#1a1218',
        },
      },
      fontFamily: {
        display: ['Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'pill': '999px',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'count-up': 'countUp 1.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Content width for consistent max layout across the site.
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
