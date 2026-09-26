import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import RaftingInDandeli from "./pages/RaftingInDandeli";
import DandeliPackages from "./pages/DandeliPackages";
import Guides from "./pages/Guides";
import GuideArticle from "./pages/GuideArticle";
import { seedGuides } from "./data/seedGuides";
import { shouldShowFooter } from "./lib/layout";
import { guidePath } from "./lib/guides";
import { LANDING_PAGES } from "./lib/landingPagesMeta";
import { AppShell } from "./App";

// Re-exported so scripts/prerender.js can read the catalog data through
// this already-Vite-bundled SSR entry, instead of importing seedData.js
// directly under plain Node — seedData.js imports .webp assets, which Vite
// transforms into URL strings during this SSR build but plain Node can't
// load at all (unknown file extension).
export { seedServices, seedPackages } from "./data/seedData";
export { seedGuides } from "./data/seedGuides";

// The standalone SEO landing pages and travel guides are rendered to plain
// static markup (render() below) and client-rendered over on load. The
// homepage is handled separately by renderHome(), because it's hydrated
// rather than re-rendered — see the notes there.
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

// The homepage is rendered in two passes:
//  1. React's static prerender API, only to resolve every React.lazy()
//     section. Its own output is discarded: React 19.2 "outlines" Suspense
//     boundaries there (fallbacks inline, real content in hidden segments
//     moved into place by inline scripts), which is wrong for crawlers
//     without JS and for hydration.
//  2. renderToString on the same tree. Nothing suspends anymore because
//     every lazy module is already resolved, so it emits complete, inline
//     HTML — with the plain Suspense boundary markers main.jsx's
//     hydrateRoot needs to hydrate each section in place instead of
//     discarding and re-rendering it.
// It renders the exact same AppShell tree the client hydrates.
const homeTree = () => (
  <StaticRouter location="/">
    <AppShell />
  </StaticRouter>
);

export async function renderHome() {
  const { prelude } = await prerenderToNodeStream(homeTree());
  // eslint-disable-next-line no-unused-vars
  for await (const _chunk of prelude) {
    // drain — only resolving the lazy modules matters here
  }

  const html = renderToString(homeTree());
  if (html.includes("<!--$?-->") || html.includes("<!--$!-->")) {
    throw new Error("renderHome: a Suspense boundary still suspended — homepage HTML would be incomplete");
  }
  return html;
}
