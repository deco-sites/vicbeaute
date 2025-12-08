import daisyui from "daisyui";

export default {
  plugins: [
    daisyui
  ],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        gray: {
          5: "#777777",
          10: "#2D2D2C",
          15: "#F3F3F3",
          20: "#707070",
          25: "#8D8D8D",
          30: "#F6F6F6",
          35: "#5E5E5E",
          40: "#CCCCCC",
          45: "#919198",
          50: "#F8F8F8",
          55: "#D6D6D6",
          60: "#ABABAB",
        },
        black: {
          5: "#191C1F",
          10: "#212121",
          15: "#2D2D2C"
        },
        blue: {
          5: "#006EFF",
        },
        green: {
          5: "#48C993"
        },
        orange: {
          5: "#FF4B1D",
          10: "#EF781C",
          15: "#F5A266"
        }
      },
      spacing: {
        "ft-1": "0.25rem",
        "ft-2": "0.5rem",
        "ft-3": "0.75rem",
        "ft-4": "1rem",
        "ft-5": "1.25rem",
        "ft-6": ".375rem",
        "ft-7": "1.75rem",
        "ft-8": "2rem",
        "ft-9": "2.25rem",
        "ft-10": ".625rem",
        "ft-11": "2.75rem",
        "ft-12": "3rem",
        "ft-13": "3.25rem",
        "ft-14": "3.5rem",
        "ft-15": ".9375rem",
        "ft-16": "4rem",
        "ft-17": "4.25rem",
        "ft-18": "4.375rem",
        "ft-19": "4.8125rem",
        "ft-20": "5rem",
        "ft-51": "51px",
        "g-ft-2": ".125rem",
        "g-ft-10": ".625rem",
        "g-ft-105": "6.5625rem",
        "w-ft-150": "150px",
        "w-ft-300": "300px",
        "p-ft-10": ".625rem"
      },
      maxWidth: {
        "ft-40": "40px",
        "ft-106": "106px",
        "ft-130": "130px",
        "ft-160": "160px",
        "ft-200": "200px",
        "ft-210": "210px",
        "ft-223": "223px",
        "ft-337": "337px",
        "ft-348": "348px",
        "ft-350": "350px",
        "ft-351": "351px",
        "ft-1041": "1041px",
        "ft-1130": "1130px",
        "ft-1280": "1280px",
        "ft-1344": "1344px",
        "ft-1452": "1452px",
        "ft-1920": "1920px",
      },
      fontSize: {
        "ft-10": ".625rem",
        "ft-13": ".8125rem",
        "ft-15": ".9375rem",
        "ft-22": "1.375rem",
        "ft-28": "1.75rem",
        "ft-30": "1.875rem",
        "ft-35": "2.1875rem",
        "ft-45": "2.8125rem",
      },
      fontFamily: {
        "Figtree": ["Figtree", "sans-serif"],
        "Inter": ["Inter", "sans-serif"],
        "Poppins": ["Poppins", "sans-serif"],
      },
      width: {
        "ft-150": "150px",
      },
      animation: {
        sliding: "sliding 30s linear infinite",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
};
