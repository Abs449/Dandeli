// Runs after the client + SSR builds. For each SEO landing page, renders its
// real markup server-side and writes it as static HTML (dist/<route>/index.html)
// so crawlers and no-JS clients get full content immediately — the client
// bundle then boots normally and re-renders over it (main.jsx uses
// createRoot().render(), a plain CSR mount, not hydrateRoot(), so there's no
// server/client markup-matching requirement here).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LANDING_PAGES } from "../src/lib/landingPagesMeta.js";
import { SITE_URL } from "../src/lib/seo.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

const { render, seedServices, seedPackages } = await import(join(root, "dist-ssr", "entry-server.js"));

const template = readFileSync(join(distDir, "index.html"), "utf-8");

const setTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender: expected tag not found in template (pattern: ${pattern})`);
  }
  return html.replace(pattern, replacement);
};

for (const { path, title, description } of Object.values(LANDING_PAGES)) {
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

const activitiesCatalog = toItemList("Dandeli Adventure Activities", seedServices, (service) => ({
  "@type": "Service",
  name: service.name,
  description: service.shortDescription,
  areaServed: { "@type": "City", name: "Dandeli" },
  offers: {
    "@type": "Offer",
    price: toNumericPrice(service.price),
    priceCurrency: "INR",
  },
}));

const packagesCatalog = toItemList("Dandeli Adventure Packages", seedPackages, (pkg) => ({
  "@type": "Product",
  name: pkg.name,
  description: pkg.description,
  offers: {
    "@type": "Offer",
    price: toNumericPrice(pkg.price),
    priceCurrency: "INR",
  },
}));

const catalogScripts = [activitiesCatalog, packagesCatalog]
  .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
  .join("\n    ");

const homeHtml = setTag(template, /<\/head>/, `    ${catalogScripts}\n  </head>`);
writeFileSync(join(distDir, "index.html"), homeHtml);
console.log(
  `injected activities + packages catalog schema into dist/index.html (${seedServices.length} activities, ${seedPackages.length} packages)`,
);
