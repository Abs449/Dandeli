import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "vendor-core";
            }
            if (id.includes("framer-motion") || id.includes("motion")) {
              return "vendor-animation";
            }
            if (id.includes("lucide-react") || id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (id.includes("swiper")) {
              return "vendor-swiper";
            }
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
          }
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dandeli-backend-proxy.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
