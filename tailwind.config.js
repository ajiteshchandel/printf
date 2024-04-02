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
        brand: {
          50: '#f4f3ff',
          100: '#ebe9fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        dark: {
          bg: '#0b0f19',
          card: '#161e2e',
          sidebar: '#111827',
          border: '#232d3f',
          hover: '#1d273a',
          text: '#f8fafc',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'dark-card': '0 8px 25px -4px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.2)',
        'purple-glow': '0 8px 25px -4px rgba(99, 102, 241, 0.35)',
      }
    },
  },
  plugins: [],
}
