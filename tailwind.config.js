/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black base, warm-shifted so gold sits naturally on it
        ink: {
          DEFAULT: "#0A0908",
          900: "#0A0908",
          800: "#0F0E0C",
          700: "#16140F",
          600: "#1E1B15",
          500: "#2A261D",
        },
        // Warm whites for text
        bone: {
          DEFAULT: "#F4F1EA",
          dim: "#B6B0A4",
          faint: "#8C857A",
        },
        // Champagne -> deep gold scale
        gold: {
          50: "#FBF1D9",
          100: "#F7E3B5",
          200: "#F1D08A",
          300: "#E8B96A",
          400: "#DDA64F",
          500: "#C9923D", // primary
          600: "#A9762E",
          700: "#825922",
          800: "#5C3E18",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Schibsted Grotesk sets tighter than the old sans; -0.045em welds
      // closed apertures at display sizes, so the ladder relaxes a notch.
      letterSpacing: {
        tightest: "-0.03em",
        tighter: "-0.02em",
      },
      maxWidth: {
        container: "1600px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 50%" },
          "100%": { backgroundPosition: "-200% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.9" },
        },
        scanline: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(350%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 6s linear infinite",
        marquee: "marquee 38s linear infinite",
        "pulse-soft": "pulse-soft 3.5s ease-in-out infinite",
        scanline: "scanline 3.2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
};
