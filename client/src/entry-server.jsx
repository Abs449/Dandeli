import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import RaftingInDandeli from "./pages/RaftingInDandeli";
import DandeliPackages from "./pages/DandeliPackages";

// Re-exported so scripts/prerender.js can read the catalog data through
// this already-Vite-bundled SSR entry, instead of importing seedData.js
// directly under plain Node — seedData.js imports .webp assets, which Vite
// transforms into URL strings during this SSR build but plain Node can't
// load at all (unknown file extension).
export { seedServices, seedPackages } from "./data/seedData";

// Only the standalone SEO landing pages are prerendered here — they were
// written without scroll-linked motion or DOM-only libraries specifically
// so they're safe to render on the server. Home ("/") stays pure
// client-rendered: its Hero/Services/Packages sections read window/DOM
// state directly in their render paths (viewport width, drag carousels,
// Swiper) and were never built with SSR in mind, so prerendering them
// would risk breaking carefully-tuned, already-working interactions for
// comparatively little SEO benefit — Google already indexes CSR content.
const PAGES = {
  "/rafting-in-dandeli/": RaftingInDandeli,
  "/dandeli-packages/": DandeliPackages,
};

export const prerenderRoutes = Object.keys(PAGES);

export function render(url) {
  const Page = PAGES[url];
  if (!Page) return null;

  return renderToStaticMarkup(
    <StaticRouter location={url}>
      <div className="flex flex-col min-h-screen bg-background text-gray-900 font-body overflow-x-hidden">
        <Navbar />
        <main className="grow">
          <Page />
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    </StaticRouter>,
  );
}
