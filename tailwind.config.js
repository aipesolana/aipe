/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        metallic: {
          darker: '#1a1c1e',
          dark: '#23262d',
          base: '#2d3139',
          light: '#3a3f4b',
          highlight: '#8b92a5',
          accent: '#c0c7db',
          shine: '#e8ecf7'
        }
      },
      backgroundImage: {
        'gradient-metallic': 'linear-gradient(145deg, var(--tw-gradient-from), var(--tw-gradient-to))',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pop-in': 'pop-in 0.3s ease-out forwards'
      },
      keyframes: {
        glow: {
          '0%': { filter: 'brightness(100%) drop-shadow(0 0 5px currentColor)' },
          '100%': { filter: 'brightness(120%) drop-shadow(0 0 15px currentColor)' }
        },
        'pop-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      boxShadow: {
        'metallic': '0 4px 12px -1px rgba(0, 0, 0, 0.3), 0 2px 6px -1px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'metallic-hover': '0 6px 16px -1px rgba(0, 0, 0, 0.4), 0 3px 8px -1px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
      }
    },
  },
  plugins: [],
};
