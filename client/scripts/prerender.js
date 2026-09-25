// Runs after the client + SSR builds. For each SEO landing page and guide, renders its
// real markup server-side and writes it as static HTML (dist/<route>/index.html)
// so crawlers and no-JS clients get full content immediately — the client
// bundle then boots normally and re-renders over it (main.jsx uses
// createRoot().render(), a plain CSR mount, not hydrateRoot(), so there's no
// server/client markup-matching requirement here).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "../src/lib/seo.js";
import { CONTACT } from "../src/lib/contact.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

const { render, prerenderPages, seedServices, seedPackages } = await import(join(root, "dist-ssr", "entry-server.js"));

const template = readFileSync(join(distDir, "index.html"), "utf-8");

const setTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender: expected tag not found in template (pattern: ${pattern})`);
  }
  return html.replace(pattern, replacement);
};

for (const { path, title, description, image, imageAlt, article } of prerenderPages) {
  const appHtml = render(path);
  if (appHtml == null) {
    throw new Error(`prerender: no SSR render registered for route ${path}`);
  }

  const canonicalUrl = `${SITE_URL}${path}`;
  const escapedTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const escapedDescription = description.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  let html = template;
  html = setTag(html, /<title>.*?<\/title>/s, `<title>${escapedTitle}</title>`);
  html = setTag(
    html,
    /<meta\s+name="description"\s+content=".*?"\s*\/>/s,
    `<meta name="description" content="${escapedDescription}" />`,
  );
  html = setTag(html, /<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = setTag(html, /<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = setTag(html, /<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${escapedTitle}" />`);
  html = setTag(
    html,
    /<meta\s+property="og:description"\s+content=".*?"\s*\/>/s,
    `<meta property="og:description" content="${escapedDescription}" />`,
  );
  html = setTag(html, /<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${escapedTitle}" />`);
  html = setTag(
    html,
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/s,
    `<meta name="twitter:description" content="${escapedDescription}" />`,
  );
  if (image) {
    // Per-page share image (guides have their own hero photo); pages without
    // one keep the site-wide og-image.webp from the template.
    const imageUrl = `${SITE_URL}${image}`;
    html = setTag(html, /<meta property="og:image" content=".*?" \/>/s, `<meta property="og:image" content="${imageUrl}" />`);
    html = setTag(html, /<meta name="twitter:image" content=".*?" \/>/s, `<meta name="twitter:image" content="${imageUrl}" />`);
    // The template's width/height and alt describe the site-wide og-image;
    // stale values would mislead scrapers about this page's own image.
    const escapedAlt = (imageAlt || title).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    html = setTag(html, /\s*<meta property="og:image:width" content=".*?" \/>/s, "");
    html = setTag(html, /\s*<meta property="og:image:height" content=".*?" \/>/s, "");
    html = setTag(html, /<meta property="og:image:alt" content=".*?" \/>/s, `<meta property="og:image:alt" content="${escapedAlt}" />`);
    html = setTag(html, /<meta name="twitter:image:alt" content=".*?" \/>/s, `<meta name="twitter:image:alt" content="${escapedAlt}" />`);
  }
  if (article) {
    html = setTag(
      html,
      /<meta property="og:type" content="website" \/>/,
      [
        `<meta property="og:type" content="article" />`,
        `<meta property="article:published_time" content="${article.publishedTime}" />`,
        `<meta property="article:modified_time" content="${article.modifiedTime}" />`,
        `<meta property="article:section" content="${article.section.replace(/&/g, "&amp;")}" />`,
      ].join("\n    "),
    );
  }
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${appHtml}</div>`);

  const outDir = join(distDir, path.replace(/^\/|\/$/g, ""));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log(`prerendered ${path} -> dist/${path.replace(/^\/|\/$/g, "")}/index.html (${(appHtml.length / 1024).toFixed(1)} KB)`);
}

// Every individual activity and package now lives only in the homepage's
// Services/Packages sections, which are client-rendered (Home isn't
// prerendered — see entry-server.jsx for why). Rather than giving each one
// its own crawlable page or component, the full catalog is embedded as
// structured data directly in the homepage's static HTML, generated here
// from the same seedData.js the UI reads — so crawlers see every activity
// and package regardless of whether they execute JS, with no separate page
// or component to keep in sync.
const toNumericPrice = (price) => {
  const digits = String(price || "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : undefined;
};

const toItemList = (name, items, mapItem) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: mapItem(item),
  })),
});

// Asset imports resolve to root-relative URLs (/assets/x-hash.webp) in the SSR
// bundle; schema.org wants absolute image URLs.
const absoluteImage = (image) => (image ? `${SITE_URL}${image}` : undefined);

const provider = { "@type": "Organization", name: CONTACT.businessName, url: `${SITE_URL}/` };

const activitiesCatalog = toItemList("Kali River Rafting Activities", seedServices, (service) => ({
  "@type": "Service",
  name: service.name,
  description: service.shortDescription,
  image: absoluteImage(service.image),
  provider,
  areaServed: { "@type": "City", name: "Dandeli" },
  offers: {
    "@type": "Offer",
    price: toNumericPrice(service.price),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
}));

// Google's Product rich-result check requires `image`; brand/url/availability
// are recommended fields. shippingDetails and hasMerchantReturnPolicy are
// deliberately omitted — they describe shipped physical goods and don't apply
// to a booked experience.
const packagesCatalog = toItemList("Kali River Rafting Packages", seedPackages, (pkg) => ({
  "@type": "Product",
  name: pkg.name,
  description: pkg.description,
  image: absoluteImage(pkg.image),
  url: `${SITE_URL}/dandeli-packages/`,
  brand: { "@type": "Brand", name: CONTACT.businessName },
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}/dandeli-packages/`,
    price: toNumericPrice(pkg.price),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
}));

const catalogScripts = [activitiesCatalog, packagesCatalog]
  .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
  .join("\n    ");

// Preload the Hero background image, but only on dist/index.html — every
// other route below reuses this same `template`, and they don't render
// Hero. Home is the one page that's never prerendered (see the note atop
// entry-server.jsx), so the browser has no way to discover this image until
// React has rendered; Lighthouse measured this as the single largest
// contributor to LCP on this page. Vite already emitted the hashed filename
// into dist/assets/ during the client build (step 1) — read it back rather
// than guessing it, since the hash changes on every image edit.
const heroBgFile = readdirSync(join(distDir, "assets")).find((f) => /^hero-bg-.*\.webp$/.test(f));
let heroPreloadTag = "";
if (heroBgFile) {
  heroPreloadTag = `<link rel="preload" as="image" fetchpriority="high" href="/assets/${heroBgFile}" />\n    `;
} else {
  console.warn("prerender: no hero-bg-*.webp found in dist/assets — skipping LCP preload for dist/index.html");
}

const homeHtml = setTag(template, /<\/head>/, `    ${heroPreloadTag}${catalogScripts}\n  </head>`);
writeFileSync(join(distDir, "index.html"), homeHtml);
console.log(
  `injected activities + packages catalog schema into dist/index.html (${seedServices.length} activities, ${seedPackages.length} packages)`,
);

// public/sitemap.xml used to be a hand-edited file, which drifted out of
// sync every time a page was added (a guide would go live with no <url>
// entry, or vice versa). Generating it here from the exact same
// `prerenderPages` list that drives the prerendered HTML above means the
// sitemap can never disagree with what's actually on the site, and each
// guide's <lastmod> comes from its own real `dateModified` instead of a
// hand-typed date someone forgets to update.
const buildDate = new Date().toISOString().slice(0, 10);

// Static routes that aren't in `prerenderPages` (Home and Booking are
// client-rendered, not prerendered — see entry-server.jsx for why).
//
// /booking is deliberately NOT listed here even though the route is real
// and fully crawlable via internal links. vercel.json serves it by
// rewriting to this same dist/index.html file verbatim (there's no
// prerendering or server logic for it), so a crawler reading its raw,
// pre-JS HTML sees <link rel="canonical" href=".../"> pointing at the
// homepage, not at /booking itself. Asserting /booking in the sitemap
// ("please index this URL") while its own unrendered markup says "actually,
// canonicalize to the homepage" is a contradictory signal — so it's left
// out of the sitemap rather than sent with a self-undermining canonical.
const staticRoutes = [{ path: "/", changefreq: "weekly", priority: "1.0" }];

const priorityFor = (path) => {
  if (path === "/dandeli-guides/") return "0.8";
  if (path.startsWith("/dandeli-guides/")) return "0.7";
  return "0.9"; // the rafting/packages landing pages
};

const sitemapEntries = [
  ...staticRoutes.map((r) => ({ ...r, lastmod: buildDate })),
  ...prerenderPages.map(({ path, article }) => ({
    path,
    lastmod: article?.modifiedTime || buildDate,
    changefreq: path === "/dandeli-guides/" ? "weekly" : "monthly",
    priority: priorityFor(path),
  })),
];

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries.map(
    ({ path, lastmod, changefreq, priority }) =>
      `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
  ),
  "</urlset>",
  "",
].join("\n");

writeFileSync(join(distDir, "sitemap.xml"), sitemapXml);
console.log(`generated dist/sitemap.xml (${sitemapEntries.length} urls, overwriting the static copy from public/)`);
