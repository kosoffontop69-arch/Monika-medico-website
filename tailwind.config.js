/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f0',
          100: '#dceddc',
          200: '#bbdabc',
          300: '#8ec090',
          400: '#5fa062',
          500: '#3d8040',
          600: '#2d6530',
          700: '#245227',
          800: '#1e4220',
          900: '#193620',
          950: '#0c1f10',
        },
        crimson: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ffa0a0',
          400: '#ff6767',
          500: '#f83737',
          600: '#e51919',
          700: '#c11010',
          800: '#9f1010',
          900: '#831414',
          950: '#480505',
        },
        navy: {
          800: '#1a2744',
          900: '#0f1a33',
          950: '#080d1a',
        }
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
