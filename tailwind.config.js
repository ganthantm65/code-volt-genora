/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        canvas: {
          base: '#f8fafc',      // Slate 50 (App canvas background)
          panel: '#ffffff',     // Pure White (Cards, elevated panels)
          subtle: '#f1f5f9',    // Slate 100 (Code block surfaces, inactive tiles)
          dark: '#090d16',      // Inset dark console terminal surface
        },
        border: {
          subtle: '#e2e8f0',    // Slate 200 (Standard card borders)
          active: '#cbd5e1',    // Slate 300 (Hover/focus borders)
        },
        content: {
          primary: '#0f172a',   // Slate 900 (Headings, primary text)
          secondary: '#334155', // Slate 700 (Body text, problem description)
          muted: '#64748b',     // Slate 500 (Labels, helpers, timestamps)
        },
        brand: {
          DEFAULT: '#4f46e5',   // Indigo 600 (Primary CTAs, focus rings)
          hover: '#4338ca',     // Indigo 700
          subtle: '#eef2ff',    // Indigo 50 (Badges, active states)
        },
        status: {
          pass: '#16a34a',      // Emerald 600
          passBg: '#f0fdf4',    // Emerald 50
          fail: '#e11d48',      // Rose 600
          failBg: '#fff1f2',    // Rose 50
          warn: '#d97706',      // Amber 600
          warnBg: '#fffbeb',    // Amber 50
        }
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        floating: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}