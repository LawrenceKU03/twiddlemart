/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframe: {
        bounce: {
          "0%, 100%": {
            transform: "translateY(-15px) scale(0.8,1.2)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)"
          },
          "50%": {
            transform: "translateY(0) scale(1.2,0.8)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)"
          },
        },
      },

      animation: {
        bounce: "bounce 0.8s infinite"
      }
    },
  },
  plugins: [],
};
