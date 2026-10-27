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
export const RAFTING_STATUS_PATH = "/is-dandeli-rafting-open-today/";

export const LANDING_PAGES = {
  rafting: {
    path: "/rafting-in-dandeli/",
    title: "River Rafting in Dandeli: Prices, Timings & Routes (₹700+)",
    description:
      "River rafting in Dandeli at Ganeshgudi on the Kali River: short 1km (₹700), mid 5km (₹1,350) and long 11km (₹1,750) routes, timings, age limits and safety. Certified guides. Book online.",
  },
  packages: {
    path: "/dandeli-packages/",
    title: "Kali River Packages | Day Trips & Camping Stays",
    description:
      "Compare all-inclusive Kali River Rafting packages — day trips, riverside camping stays, and premium rooms with rafting, kayaking, meals, and resort activities. Transparent pricing, no hidden costs.",
  },
  status: {
    path: RAFTING_STATUS_PATH,
    title: "Is Dandeli River Rafting Open Today? Live Status",
    description:
      "Live Kali River rafting status for Dandeli (Ganeshgudi), from the Supa dam's power output, refreshed every 5 minutes. Check if rafting is running today, the season, and what to do if it's suspended.",
  },
  guides: {
    path: "/dandeli-guides/",
    title: "Dandeli Travel Guides: Best Time, Reach & Itineraries",
    description:
      "Plan your Dandeli trip with our travel guides — best time to visit, how to reach, things to do, a 2-day itinerary and budget, rafting tips, camping, wildlife and places to see nearby.",
  },
};
