/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand: Bosphorus teal
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // CTA: Sunset orange
        cta: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        surface: {
          // Light theme surfaces
          base: '#FFFBF5',
          card: '#FFFFFF',
          // Dark theme surfaces
          'base-dark': '#0F172A',
          'card-dark': '#1E293B',
          'elev-dark': '#334155',
        },
      },
      boxShadow: {
        soft: '0 4px 14px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 12px 32px -8px rgba(15, 23, 42, 0.12), 0 4px 12px -4px rgba(15, 23, 42, 0.06)',
        'inner-glow': 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.6)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
        'shake': 'shake 350ms cubic-bezier(.36,.07,.19,.97)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-3px)' },
          '40%, 60%': { transform: 'translateX(3px)' },
        },
      },
    },
  },
  plugins: [],
}
