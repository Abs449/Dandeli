import { seedGuides } from "../data/seedData";

export const GUIDES_PATH = "/dandeli-guides/";

export const guidePath = (slug) => `${GUIDES_PATH}${slug}/`;

export const getGuide = (slug) => seedGuides.find((guide) => guide.slug === slug);

export const getRelatedGuides = (guide) =>
  (guide.related || []).map(getGuide).filter(Boolean);

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
