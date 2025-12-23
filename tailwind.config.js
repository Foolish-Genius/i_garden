/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backwards-compatible aliases
        'base-primary': '#0D1117',
        'base-secondary': '#161B22',

        // Core
        'base-900': '#0D1117',
        'base-800': '#161B22',
        'bg': '#0B0F13',
        'surface': '#0F151A',
        'border': '#21262B',
        'glass': 'rgba(255,255,255,0.03)',

        // Typography & accents
        'text-primary': '#E6EDF3',
        'text-muted': '#94A3B8',
        'accent-primary': '#58A6FF',
        'accent-primary-600': '#2C8DFF',
        'accent-secondary': '#3FB950',

        // Semantic
        'success': '#3FB950',
        'danger': '#FF6B6B',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '720px',
          lg: '960px',
          xl: '1140px',
        }
      },
      boxShadow: {
        'muted-sm': '0 1px 2px rgba(2,6,23,0.6)',
        'muted-md': '0 6px 24px rgba(2,6,23,0.4)',
      },
      borderRadius: {
        lg: '12px',
      },
    },
  },
  plugins: [
    // Optional plugins (install when ready): require('@tailwindcss/typography'), require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp')
  ],
}
