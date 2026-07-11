/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black + amber minimalist palette
        'brand-background': '#000000', // Pure black
        'brand-surface': '#0D0D0F',    // Near-black surface
        'brand-primary': '#F5B942',    // Amber / gold
        'brand-primary-hover': '#D9A02F', // Darker amber
        'brand-secondary': '#FBCB6B',  // Light amber accent
        'brand-text-primary': '#F4F4F5',    // Off-white
        'brand-text-secondary': '#A1A1AA', // Muted gray
        'brand-border': '#232326',     // Subtle dark border
        'brand-error': '#E5E5E5',       // Neutral (outline-style destructive actions)
        'brand-success': '#22C55E',    // Green (kept for success states)
        'brand-input-bg': '#0A0A0B', // Slightly darker than surface
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ensuring Inter is the default sans-serif
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
