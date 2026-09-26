import { seedGuides } from "../data/seedGuides";

// Full guide content (sections, faqs — the actual multi-thousand-word
// article bodies) is intentionally kept out of lib/guides.js. This module is
// only imported by GuideArticle.jsx, which is already its own lazy route
// chunk, so seedGuides.js's weight loads only when someone actually opens a
// guide article — never as part of Home's eager bundle.
export const getGuide = (slug) => seedGuides.find((guide) => guide.slug === slug);
