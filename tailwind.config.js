/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFDF0',
          100: '#FFF8D4',
          200: '#FFEDA8',
          300: '#FFDF7B',
          400: '#FFD447',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#9C7916',
          800: '#805F12',
          900: '#6B4F0F'
        },
        bronze: {
          50: '#FAF8F5',
          100: '#F3EDE5',
          200: '#E8D9CB',
          300: '#D4BFA5',
          400: '#B89E7A',
          500: '#8B7355',
          600: '#746049',
          700: '#5D4E3D',
          800: '#4A3E32',
          900: '#3D3329'
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif']
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.6s ease-in-out',
        'pulse-gentle': 'pulse-gentle 2s infinite'
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      }
    },
  },
  plugins: [],
}