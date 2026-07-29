/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      colors: {
        // 南京六朝古都主题色
        cinnabar: {
          // 朱砂红 - 明城墙红
          50: "#fdf3f3",
          100: "#fbe4e5",
          200: "#f7cccc",
          300: "#f0a6a7",
          400: "#e67375",
          500: "#d94a4d",
          600: "#C1272D", // 主色
          700: "#a01e24",
          800: "#851c21",
          900: "#701d21",
          950: "#3d0a0d",
        },
        jinling: {
          // 金陵金 - 皇家金
          50: "#fcfaf1",
          100: "#f8f2d9",
          200: "#f1e4b2",
          300: "#e8d082",
          400: "#e0bc58",
          500: "#D4AF37", // 主色
          600: "#c29426",
          700: "#a17320",
          800: "#845c22",
          900: "#6d4c20",
          950: "#3d280e",
        },
        celadon: {
          // 青瓷灰 - 江南烟雨
          50: "#f5f8f7",
          100: "#e7eeee",
          200: "#d4ddd9",
          300: "#b6c5c1",
          400: "#93a7a3",
          500: "#8FA8A4", // 主色
          600: "#65867f",
          700: "#536d68",
          800: "#465956",
          900: "#3c4b49",
          950: "#232d2c",
        },
        xuanzhi: {
          // 宣纸米白
          50: "#FBF9F4",
          100: "#F5F1E8", // 主色
          200: "#E9E0CC",
          300: "#D9CBA9",
          400: "#C6B081",
        },
        moyu: {
          // 墨玉黑
          900: "#1A1614", // 主色
          800: "#26211E",
          700: "#352E2A",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"Songti SC"', "SimSun", "serif"],
        sans: ['"LXGW WenKai"', '"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', "sans-serif"],
        kai: ['"LXGW WenKai"', '"KaiTi"', '"STKaiti"', "serif"],
      },
      backgroundImage: {
        "paper-texture": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        "hero-gradient":
          "linear-gradient(135deg, rgba(193,39,45,0.85) 0%, rgba(160,30,36,0.7) 40%, rgba(212,175,55,0.6) 100%)",
      },
      boxShadow: {
        seal: "0 2px 4px rgba(193,39,45,0.3), 0 0 0 2px rgba(193,39,45,0.15)",
        classic:
          "0 4px 6px -1px rgba(26,22,20,0.08), 0 2px 4px -2px rgba(26,22,20,0.06), inset 0 1px 0 rgba(212,175,55,0.15)",
        gold: "0 10px 25px -5px rgba(212,175,55,0.25), 0 8px 10px -6px rgba(212,175,55,0.2)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "stamp-in": "stampIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stampIn: {
          "0%": { opacity: "0", transform: "scale(1.5) rotate(-8deg)" },
          "60%": { opacity: "1", transform: "scale(0.95) rotate(2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
