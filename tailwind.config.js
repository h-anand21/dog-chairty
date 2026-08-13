/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F7F4',
        sand: '#F2EFEB',
        card: '#FFFFFF',
        coral: {
          50: '#FFF5F2',
          100: '#FFE8E2',
          200: '#FFD4C9',
          300: '#FFAFA0',
          400: '#FF7E67',
          500: '#FF5A36',
          600: '#ED3F18',
          700: '#C72E0C',
          800: '#9E280E',
          900: '#7F2713',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        obsidian: {
          950: '#0A0B0D',
          900: '#111317',
          800: '#1C1F26',
          700: '#2D323E',
          600: '#4B5565',
          500: '#6E7A8A',
          400: '#9CA3AF',
          300: '#E2E8F0',
          200: '#F1F5F9',
          100: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '44px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(17, 19, 23, 0.04), 0 2px 6px -1px rgba(17, 19, 23, 0.02)',
        'card-hover': '0 20px 40px -12px rgba(255, 90, 54, 0.16), 0 10px 20px -6px rgba(17, 19, 23, 0.06)',
        'elevated': '0 25px 60px -15px rgba(17, 19, 23, 0.12), 0 10px 25px -5px rgba(17, 19, 23, 0.04)',
        'glow-coral': '0 10px 30px -5px rgba(255, 90, 54, 0.4)',
        'glow-sky': '0 10px 30px -5px rgba(14, 165, 233, 0.35)',
        'glow-amber': '0 10px 30px -5px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
