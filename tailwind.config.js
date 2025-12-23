/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ui: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-10%)" },
          "100%": { transform: "translateY(110%)" },
        },
        noiseShift: {
          "0%": { transform: "translate3d(0,0,0)" },
          "20%": { transform: "translate3d(-1%, 1%, 0)" },
          "40%": { transform: "translate3d(1%, -1%, 0)" },
          "60%": { transform: "translate3d(-1%, -1%, 0)" },
          "80%": { transform: "translate3d(1%, 1%, 0)" },
          "100%": { transform: "translate3d(0,0,0)" },
        },
        flicker: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.15" },
        },
      },
      animation: {
        scan: "scan 2.8s linear infinite",
        noiseShift: "noiseShift 0.55s steps(2) infinite",
        flicker: "flicker 2.6s ease-in-out infinite",
      },
      boxShadow: {
        neonG: "0 0 0 1px rgba(45,255,122,0.55), 0 0 22px rgba(45,255,122,0.18)",
        neonY: "0 0 0 1px rgba(214,255,0,0.60), 0 0 24px rgba(214,255,0,0.16)",
        deep: "0 18px 40px rgba(0,0,0,0.55)",
      },
      colors: {
        b0: {
          bg: "#0A0A0A",
          fg: "#EAEAEA",
          g: "#2DFF7A",
          y: "#D6FF00",
          r: "#FF2E2E",
        },
      },
    },
  },
  plugins: [],
};
