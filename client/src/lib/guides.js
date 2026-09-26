import { seedGuideSummaries } from "../data/guideSummaries";

export const GUIDES_PATH = "/dandeli-guides/";

export const guidePath = (slug) => `${GUIDES_PATH}${slug}/`;

// Preview-only lookup — everything a GuidePost card needs, none of the
// article body. This file must stay light: it's imported by GuideLinks,
// which Home renders (via its "Plan Your Dandeli Trip" section), so
// anything pulled in here loads on every homepage visit. The full guide
// content (sections/faqs) lives in the separate, much heavier
// seedGuides.js — reached only through lib/guideContent.js, which only
// GuideArticle.jsx (its own lazy route chunk) imports.
export const getGuideSummary = (slug) => seedGuideSummaries.find((guide) => guide.slug === slug);

export const getRelatedGuideSummaries = (guide) =>
  (guide.related || []).map(getGuideSummary).filter(Boolean);

// Anchor ids for the in-page table of contents — derived from the heading so
// the seed data doesn't need to store them.
export const headingId = (heading) =>
  heading
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Fixed locale + UTC so the date renders identically on the server and the client.
export const formatGuideDate = (iso, month = "long") =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month, year: "numeric", timeZone: "UTC" });
