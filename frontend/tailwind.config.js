/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quant: {
          bg: "#0B0F17",
          card: "#111827",
          cardHover: "#161F33",
          border: "#1F293D",
          green: "#10B981",
          red: "#EF4444",
          cyan: "#06B6D4",
          purple: "#8B5CF6",
          amber: "#F59E0B",
          textMuted: "#9CA3AF",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
