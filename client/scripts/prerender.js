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

const { render, renderHome, prerenderPages, seedServices, seedPackages } = await import(join(root, "dist-ssr", "entry-server.js"));

const template = readFileSync(join(distDir, "index.html"), "utf-8");

const setTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender: expected tag not found in template (pattern: ${pattern})`);
  }
  return html.replace(pattern, replacement);
};

// Swaps the template's default (homepage) <title>, description, canonical,
// and social tags for one page's own values.
const withPageMeta = (baseHtml, { path, title, description, image, imageAlt, article }) => {
  const canonicalUrl = `${SITE_URL}${path}`;
  const escapedTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const escapedDescription = description.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  let html = baseHtml;
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
  return html;
};

// The site's single stylesheet (~17KB gzipped) is inlined into each page's
// <head> instead of linked. A linked stylesheet is render-blocking: nothing
// paints until a second request for it completes. On a slow mobile
// connection that extra round trip sat directly in front of the first paint
// and the LCP. Its font url()s are absolute (/assets/...), so they resolve
// the same inline.
const inlineCss = (html) => {
  const link = html.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/);
  if (!link) throw new Error("prerender: stylesheet <link> not found in template");
  const css = readFileSync(join(distDir, link[1]), "utf-8");
  if (css.includes("</style")) throw new Error("prerender: stylesheet contains </style — cannot inline safely");
  return html.replace(link[0], () => `<style>${css}</style>`);
};

// Every prerendered page (home, landing pages, guides) arrives with its full
// content already in the HTML, so none of it needs JavaScript to be seen or
// read. Vite's default markup starts downloading the app bundle (~85KB
// gzipped: React, the router, the entry chunk) in the first few
// milliseconds, competing with the CSS and the hero image for bandwidth —
// on a slow phone that pushed back the first paint and the LCP image for
// JS that wasn't needed for either. This moves the bundle, and its
// modulepreload hints, to start after the `load` event and the first paint
// instead: the page paints from HTML first, then becomes interactive. A 3s fallback
// covers a slow straggler resource holding up `load`.
// Not applied to /booking: its shell is empty until JS renders the form.
const deferAppBoot = (html) => {
  const entry = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
  if (!entry) throw new Error("prerender: entry <script type=module> not found in template");
  const preloads = [...html.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">/g)].map((m) => m[1]);
  let out = html.replace(entry[0], "");
  out = out.replace(/\s*<link rel="modulepreload" crossorigin href="[^"]+">/g, "");
  const boot = `<script>
      (function () {
        var started = false;
        function boot() {
          if (started) return;
          started = true;
          ${JSON.stringify(preloads)}.forEach(function (href) {
            var l = document.createElement('link');
            l.rel = 'modulepreload';
            l.crossOrigin = '';
            l.href = href;
            document.head.appendChild(l);
          });
          var s = document.createElement('script');
          s.type = 'module';
          s.crossOrigin = '';
          s.src = ${JSON.stringify(entry[1])};
          document.head.appendChild(s);
        }
        // Wait for the first frame after load to actually paint: rAF runs
        // just before that frame, the setTimeout just after it. With the CSS
        // inlined, load can fire before first paint, and starting the JS
        // then would put it back in front of FCP/LCP.
        function afterPaint() {
          requestAnimationFrame(function () { setTimeout(boot, 0); });
        }
        if (document.readyState === 'complete') afterPaint();
        else window.addEventListener('load', afterPaint);
        setTimeout(boot, 3000);
      })();
    </script>`;
  return setTag(out, /<\/head>/, `  ${boot}\n  </head>`);
};

for (const page of prerenderPages) {
  const { path } = page;
  const appHtml = render(path);
  if (appHtml == null) {
    throw new Error(`prerender: no SSR render registered for route ${path}`);
  }

  let html = withPageMeta(template, page);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${appHtml}</div>`);
  html = inlineCss(deferAppBoot(html));

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

// Preload the Hero background image (the homepage's LCP element), but only
// on dist/index.html — every other route reuses this same `template`, and
// they don't render Hero. Vite already emitted the hashed filename into
// dist/assets/ during the client build (step 1) — read it back rather than
// guessing it, since the hash changes on every image edit.
// Two variants, chosen by screen shape exactly like .hero-bg-position in
// index.css — `media` makes the browser fetch only the one it will use.
const assetFiles = readdirSync(join(distDir, "assets"));
const heroBgFile = assetFiles.find((f) => /^hero-bg-.*\.webp$/.test(f));
const heroPortraitFile = assetFiles.find((f) => /^hero-portrait-.*\.webp$/.test(f));
let heroPreloadTag = "";
if (heroBgFile && heroPortraitFile) {
  heroPreloadTag =
    `<link rel="preload" as="image" fetchpriority="high" href="/assets/${heroPortraitFile}" media="(max-aspect-ratio: 3/4)" />\n    ` +
    `<link rel="preload" as="image" fetchpriority="high" href="/assets/${heroBgFile}" media="(min-aspect-ratio: 3001/4000)" />\n    `;
} else {
  throw new Error("prerender: hero-bg / hero-portrait webp not found in dist/assets — LCP preload would be missing");
}

// /booking stays client-rendered (a form, never built for SSR), and
// vercel.json rewrites it to its own empty shell instead of dist/index.html:
// now that index.html carries the prerendered homepage, serving it for
// /booking would flash homepage content — and give crawlers the homepage's
// markup and canonical — until the booking form's JS took over.
const bookingDir = join(distDir, "booking");
mkdirSync(bookingDir, { recursive: true });
writeFileSync(
  join(bookingDir, "index.html"),
  inlineCss(withPageMeta(template, {
    path: "/booking",
    title: "Book Dandeli Rafting & Adventure Trips | Kali River Rafting",
    description:
      "Reserve white-water rafting, camping, and jungle adventure packages on the Kali River in Dandeli. Fill out the booking form and our team confirms your trip within 24 hours.",
  })),
);
console.log("wrote dist/booking/index.html (client-rendered shell with its own canonical/meta)");

const homeAppHtml = await renderHome();
let homeHtml = setTag(template, /<\/head>/, `    ${heroPreloadTag}${catalogScripts}\n  </head>`);
homeHtml = setTag(homeHtml, /<div id="root"><\/div>/, `<div id="root">${homeAppHtml}</div>`);
homeHtml = inlineCss(deferAppBoot(homeHtml));
writeFileSync(join(distDir, "index.html"), homeHtml);
console.log(
  `prerendered / -> dist/index.html (${(homeAppHtml.length / 1024).toFixed(1)} KB, hydrated on the client) + catalog schema (${seedServices.length} activities, ${seedPackages.length} packages)`,
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
