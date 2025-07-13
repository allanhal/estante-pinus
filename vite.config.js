import { defineConfig } from "vite";
import Fonts from "vite-plugin-fonts";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        tiktok: ["TikTok Sans", "sans-serif"],
      },
    },
  },
  plugins: [react()],
});
