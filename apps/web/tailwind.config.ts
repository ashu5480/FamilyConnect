import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // FamilyConnect accent tokens (deep ink + warm coral/amber + soft sky).
        brand: {
          50: '#fdf6ef',
          100: '#f8e6d4',
          200: '#f2cdae',
          300: '#e8a47a',
          400: '#dd7f55',
          500: '#c66b3f',
          600: '#a8542f',
          700: '#854024',
          800: '#63321a',
          900: '#402111',
          950: '#1f1109',
        },
        ink: {
          50: '#f6f4f0',
          100: '#ece6df',
          200: '#ddd2c2',
          300: '#bca88a',
          400: '#9c7b5c',
          500: '#7d5a3f',
          600: '#5f422f',
          700: '#452e1f',
          800: '#2d1d11',
          900: '#1b1108',
          950: '#0f0804',
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
