/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#F8F7F4',
        card: '#FFFFFF',
        coral: {
          50: '#FFF4F1',
          100: '#FFE7E1',
          200: '#FFD0C4',
          300: '#FFAEA0',
          400: '#FF8874',
          500: '#FF6B4A',
          600: '#EA4F2C',
          700: '#C53B1C',
          800: '#9B311A',
          900: '#7B2C1C',
        },
        sky: {
          50: '#F0F8FE',
          100: '#DCF0FD',
          400: '#56B3EE',
          500: '#4EA8DE',
          600: '#2684C2',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        obsidian: {
          900: '#141416',
          800: '#23262F',
          700: '#353945',
          600: '#777E90',
          500: '#B1B5C3',
          400: '#E6E8EC',
          300: '#F4F5F6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.06), 0 4px 12px -4px rgba(0, 0, 0, 0.04)',
        'soft-hover': '0 20px 40px -15px rgba(255, 107, 74, 0.18), 0 8px 16px -6px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px rgba(255, 107, 74, 0.35)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
      }
    },
  },
  plugins: [],
}
