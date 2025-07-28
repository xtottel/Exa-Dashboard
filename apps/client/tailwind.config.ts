import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        outfit: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#f9fafb",
        foreground: "#111827",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
        },
        primary: {
          DEFAULT: "#2e63f5", // Sendexa blue
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#e0e7ff", // Soft indigo
          foreground: "#1e40af",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#f9fafb",
          foreground: "#111827",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        // border: "#b8c2d6",
        // input: "#c3cdd6",
        // ring: "#95a7f0",
        border: "#b8c2d6", // Default border
        borderHover: "#a3b0c8", // Slightly darker on hover
        input: "#c3cdd6", // Input background
        inputFocus: "#e2e8f0", // Lighter when focused
        ring: "#95a7f0", // Default focus ring
        ringHover: "#7d94ee", // More saturated on hover
        chart: {
          "1": "#2e63f5", // primary
          "2": "#10b981", // green
          "3": "#f59e0b", // amber
          "4": "#ef4444", // red
          "5": "#6366f1", // indigo
        },
      },
      // borderRadius: {
      //   // lg: "1rem",
      //   // md: "0.75rem",
      //   // sm: "0.5rem",
      //    lg: "0.95rem",
      //   md: "0.52rem",
      //   sm: "0.2rem",
      // },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
