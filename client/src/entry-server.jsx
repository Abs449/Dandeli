import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import RaftingInDandeli from "./pages/RaftingInDandeli";
import DandeliPackages from "./pages/DandeliPackages";
import Guides from "./pages/Guides";
import GuideArticle from "./pages/GuideArticle";
import { seedGuides } from "./data/seedData";
import { shouldShowFooter } from "./lib/layout";
import { guidePath } from "./lib/guides";
import { LANDING_PAGES } from "./lib/landingPagesMeta";

// Re-exported so scripts/prerender.js can read the catalog data through
// this already-Vite-bundled SSR entry, instead of importing seedData.js
// directly under plain Node — seedData.js imports .webp assets, which Vite
// transforms into URL strings during this SSR build but plain Node can't
// load at all (unknown file extension).
export { seedServices, seedPackages, seedGuides } from "./data/seedData";

// Only the standalone SEO landing pages and travel guides are prerendered
// here — they were written without scroll-linked motion or DOM-only
// libraries specifically so they're safe to render on the server. Home ("/")
// stays pure client-rendered: its Hero/Services/Packages sections read
// window/DOM state directly in their render paths (viewport width, drag
// carousels, Swiper) and were never built with SSR in mind, so prerendering
// them would risk breaking carefully-tuned, already-working interactions for
// comparatively little SEO benefit — Google already indexes CSR content.
export const prerenderPages = [
  ...Object.values(LANDING_PAGES),
  ...seedGuides.map((guide) => ({
    path: guidePath(guide.slug),
    title: guide.seoTitle,
    description: guide.metaDescription,
    image: guide.image,
    imageAlt: guide.imageAlt,
    article: {
      section: guide.category,
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
    },
  })),
];

export const prerenderRoutes = prerenderPages.map((page) => page.path);

export function render(url) {
  if (!prerenderRoutes.includes(url)) return null;

  return renderToStaticMarkup(
    <StaticRouter location={url}>
      <div className="flex flex-col min-h-screen bg-background text-gray-900 font-body overflow-x-hidden">
        <Navbar />
        <main className="grow">
          <Routes>
            <Route path="/rafting-in-dandeli" element={<RaftingInDandeli />} />
            <Route path="/dandeli-packages" element={<DandeliPackages />} />
            <Route path="/dandeli-guides" element={<Guides />} />
            <Route path="/dandeli-guides/:slug" element={<GuideArticle />} />
          </Routes>
        </main>
        {shouldShowFooter(url) && <Footer />}
        <FloatingButtons />
      </div>
    </StaticRouter>,
  );
}
