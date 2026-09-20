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
        cyber: {
          bg: "#000000",
          bgSecondary: "#050505",
          card: "#080808",
          surface: "#0A0A0A",
          elevated: "#101010",
          border: "#151515",
          borderLight: "rgba(255, 255, 255, 0.12)",
          borderHover: "rgba(255, 255, 255, 0.35)",
          white: "#FFFFFF",
          neonWhite: "#FFFFFF",
          textSecondary: "#A3A3A3",
          textMuted: "#666666",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-white-sm': '0 0 15px rgba(255, 255, 255, 0.2)',
        'glow-white': '0 0 25px rgba(255, 255, 255, 0.35)',
        'glow-white-lg': '0 0 45px rgba(255, 255, 255, 0.5)',
        'glow-card': '0 0 30px rgba(255, 255, 255, 0.08)',
        'glow-ring': '0 0 20px rgba(255, 255, 255, 0.45)',
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'pulse-glow': 'pulseGlow 3.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'monochrome-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'glow-radial': 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12), transparent 70%)',
      },
    },
  },
  plugins: [],
}
