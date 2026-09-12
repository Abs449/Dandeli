// Single source of truth for the standalone SEO landing pages' route,
// <title>, and meta description — imported by each page component (via
// useSEO) and by scripts/prerender.js so the client-side tags and the
// build-time static HTML never drift out of sync.
// Paths use a trailing slash so the canonical/sitemap URL always matches a
// prerendered dist/<route>/index.html file on disk — the one directory
// convention every static host (Vercel, Netlify, nginx, Apache, S3...)
// resolves without needing host-specific rewrite config. React Router
// matches routes regardless of a trailing slash, so client-side nav is
// unaffected either way.
export const LANDING_PAGES = {
  rafting: {
    path: "/rafting-in-dandeli/",
    title: "White-Water Rafting in Dandeli | Kali River Rafting Prices & Timings",
    description:
      "Short, mid, and long white-water rafting routes on the Kali River at Ganeshgudi, Dandeli. Certified guides, safety gear included, prices from ₹700. Check live river status and book online.",
  },
  packages: {
    path: "/dandeli-packages/",
    title: "Dandeli Adventure Packages | Day Trips & Overnight Rafting + Camping Stays",
    description:
      "Compare all-inclusive Dandeli adventure packages — day trips, riverside camping stays, and premium rooms with rafting, kayaking, meals, and resort activities. Transparent pricing, no hidden costs.",
  },
};
