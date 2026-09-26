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
    modulePreload: {
      // Vite blanket-preloads every `manualChunks`-named chunk from every
      // HTML entry, unlike its own automatically-split chunks (which it only
      // preloads where actually reachable). Without this override, that
      // meant guide-content.js — the ~65KB of full guide article bodies,
      // manually chunked below purely to stop Rollup's automatic splitter
      // from duplicating it — got a <link rel="modulepreload"> on the
      // homepage too, even though Home never renders a guide article and
      // only reaches it through a genuinely lazy route (GuideArticle.jsx).
      // It still loads correctly on demand via the route's own dynamic
      // import(); this only removes the eager, unwanted preload hint.
      resolveDependencies: (_filename, deps) => deps.filter((d) => !d.includes("guide-content")),
    },
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
            return;
          }
          // Home statically imports seedData.js (via Services/Packages), while
          // RaftingInDandeli/DandeliPackages/Guides reach it through a lazy
          // route chunk — that mix of static + dynamic importers is exactly
          // the case Rollup's automatic chunking heuristic handles worst, and
          // it was observed duplicating seedData's content across the main
          // bundle and a separate chunk instead of cleanly sharing one.
          // Pinning it to an explicit chunk makes the split deterministic.
          if (id.includes("/src/data/seedData.js")) {
            return "seed-data";
          }
          // seedGuides.js (full article bodies) and guideContent.js (its only
          // consumer) are pinned together, away from guideSummaries.js — see
          // the comments in src/lib/guides.js / guideContent.js for why the
          // split exists and must stay this way.
          if (id.includes("/src/data/seedGuides.js") || id.includes("/src/lib/guideContent.js")) {
            return "guide-content";
          }
          if (id.includes("/src/data/guideSummaries.js")) {
            return "guide-summaries";
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
