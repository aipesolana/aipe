/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        metallic: {
          dark: '#0a0a0f',
          darker: '#050507',
          light: '#1a1a2e',
          accent: '#2a2a4a',
          highlight: '#4a4a7a',
          success: '#00ff66',
          error: '#ff1a1a',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pop-in': 'popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '50%': { opacity: '1', transform: 'scale(1.1) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        glow: {
          '0%, 100%': { 
            'filter': 'brightness(1) drop-shadow(0 0 15px currentColor)',
          },
          '50%': { 
            'filter': 'brightness(1.2) drop-shadow(0 0 30px currentColor)',
          },
        },
      },
    },
  },
  plugins: [],
}
