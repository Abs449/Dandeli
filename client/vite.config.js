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
      //
      // Same for vendor-animation (framer-motion) and vendor-swiper: nothing
      // on any page's startup path imports them anymore (the navbar drawer
      // is plain CSS, and everything animated is a lazy chunk), but Vite
      // would still preload them from the HTML. Only the HTML's hints are
      // filtered — a lazy chunk that needs framer still preloads it when
      // that chunk loads.
      resolveDependencies: (_filename, deps, { hostType }) =>
        hostType === "html"
          ? deps.filter((d) => !/guide-content|vendor-animation|vendor-swiper/.test(d))
          : deps.filter((d) => !d.includes("guide-content")),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Exact package directories only. This used to be
            // id.includes("react"), which also swept lucide-react,
            // react-icons and react-hook-form (only used by /booking) into
            // the startup bundle every page preloads. Icon packages are left
            // to Rollup so each chunk carries only the icons it uses.
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) {
              return "vendor-core";
            }
            if (id.includes("framer-motion") || /[\\/]node_modules[\\/]motion-/.test(id)) {
              return "vendor-animation";
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
          // Image imports compile to tiny modules that just export a URL
          // string. Left to Rollup, a URL shared by several chunks gets
          // placed inside one of them — e.g. river-scenery.webp landed in
          // guide-content, so the homepage's About section downloaded all
          // nine guide articles just to read one image URL. One shared,
          // few-hundred-byte chunk of URLs avoids that.
          if (/\.(webp|png|jpe?g|gif|svg|avif)$/.test(id)) {
            return "asset-urls";
          }
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
