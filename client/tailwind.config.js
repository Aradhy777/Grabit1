/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        base: "#F8FAFC",
        surface: "#FFFFFF",
        "border-subtle": "#E2E8F0",
        "accent-primary": "#3B82F6",
        "accent-secondary-lavender": "#8B5CF6",
        "accent-secondary-mint": "#10B981",
        "accent-glow": "rgba(59, 130, 246, 0.15)",
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        "text-muted": "#94A3B8",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
         "abstract-waves": "url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 1440 320\\'%3E%3Cpath fill=\\'%23f1f5f9\\' fill-opacity=\\'1\\' d=\\'M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,101.3C672,96,768,128,864,133.3C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z\\'%3E%3C/path%3E%3C/svg%3E')"
      }
    },
  },
  plugins: [],
};
