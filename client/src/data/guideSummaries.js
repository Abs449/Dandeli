// Lightweight preview metadata for every guide — everything a GuidePost card
// needs (title, summary, image, category, readTime) but none of the actual
// article body (sections/faqs), which is the bulk of each guide's weight.
//
// This exists so pages that only show guide PREVIEWS (Home's "Plan Your
// Dandeli Trip" section via GuideLinks, and the related-guides strip at the
// bottom of each article) don't have to load full-length guide text through
// seedGuides.js just to render a title and a two-line summary. Home renders
// 3 of these cards, and until this file existed, doing so pulled in all 9
// guides' complete ~700-1000-word article bodies (~64KB) as part of the
// homepage's critical JS.
//
// Must stay in sync with seedGuides.js — these fields are duplicated (not
// derived) so this file has zero dependency on the full-content module. If
// you add/edit a guide's title, excerpt, summary, image, category, readTime,
// or dates in seedGuides.js, mirror the same fields here.

import imgAboutBg from "../assets/Backgroundimg/aboutus-bg.webp";
import imgDrone from "../assets/Backgroundimg/gallery-drone.webp";
import imgJungle from "../assets/Backgroundimg/gallery-jungle.webp";
import imgLongRafting from "../assets/Backgroundimg/gallery-raft1.webp";
import imgNature from "../assets/Backgroundimg/Nature_trails.webp";
import imgReviewsBg from "../assets/Backgroundimg/reviews-bg.webp";
import imgScenery from "../assets/Backgroundimg/river-scenery.webp";
import imgZip from "../assets/Backgroundimg/zipline.webp";
import imgcampfire from "../assets/Backgroundimg/campfire.webp";

export const seedGuideSummaries = [
  {
    slug: "best-time-to-visit-dandeli",
    title: "Best Time to Visit Dandeli: A Month-by-Month Guide",
    excerpt: "Weather, river levels, crowds and rafting availability month by month — so you can pick the right season for your Dandeli trip.",
    summary: "Dandeli changes character completely through the year. Winter brings cool evenings and full-throttle river adventure, summer trades crowds for hot days and gentler rapids, and the monsoon turns the Western Ghats emerald while rafting usually takes a break. Here is what each month really feels like, how the river behaves, and how to time your trip.",
    category: "Trip Planning",
    readTime: "8 min read",
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
    image: imgAboutBg,
    imageAlt: "Mist over the Kali River in Dandeli with rafts resting on the bank",
  },
  {
    slug: "how-to-reach-dandeli",
    title: "How to Reach Dandeli: By Road, Train & Air",
    excerpt: "The easiest ways to get to Dandeli from Bengaluru, Goa, Pune, Hubballi and Belagavi — plus where the rafting base actually is.",
    summary: "Dandeli is tucked deep in the Western Ghats, so a little planning goes a long way. This guide walks through the road routes from Bengaluru, Goa, Pune, Hubballi and Belagavi, the nearest railway stations and airports, and the one detail that trips up almost every first-timer — the rafting base is at Ganeshgudi, not in Dandeli town.",
    category: "Getting There",
    readTime: "8 min read",
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
    image: imgDrone,
    imageAlt: "Aerial view of rafts on the Kali River surrounded by forest in Dandeli",
  },
  {
    slug: "things-to-do-in-dandeli",
    title: "12 Best Things to Do in Dandeli",
    excerpt: "White-water rafting, ziplines, kayaking, jungle safaris and campfire nights — the best adventure and nature activities in Dandeli, with prices and tips.",
    summary: "River rapids, treetop ziplines, misty forest trails and campfire nights — Dandeli packs a lot into a small area. We break down the twelve best things to do, what each one really involves, who it suits, what it costs, and how to combine them into a day or weekend that fits your group.",
    category: "Things To Do",
    readTime: "10 min read",
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
    image: imgZip,
    imageAlt: "Traveller ziplining through dense green forest in Dandeli",
  },
  {
    slug: "dandeli-2-day-itinerary-and-trip-cost",
    title: "Dandeli 2-Day Itinerary & Trip Cost",
    excerpt: "An hour-by-hour weekend plan covering rafting, camping and sightseeing, plus a realistic budget so there are no surprises.",
    summary: "Two days is the perfect length for a first Dandeli trip. Here is a practical, hour-by-hour plan that packs in rafting, kayaking, a campfire night and a slow forest morning, along with an honest breakdown of what a weekend costs, where you can save, and what to pack so nothing catches you off guard.",
    category: "Itinerary & Budget",
    readTime: "9 min read",
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
    image: imgJungle,
    imageAlt: "Rafts gathered on the Kali River below forested hills in Dandeli",
  },
  {
    slug: "kali-river-rafting-first-timers-guide",
    title: "Kali River Rafting for First-Timers: What to Expect",
    excerpt: "How a rafting trip on the Kali River works, which route to choose, how safety is handled and what to wear — everything a beginner needs to know.",
    summary: "Never been rafting? You are in good company. We walk you through a Kali River trip from arrival to the final splash — the three routes and how to choose, the safety briefing and gear, the commands you will hear, what to wear and bring, who should skip it, and how dam releases decide whether the river is running on your day.",
    category: "Rafting",
    readTime: "10 min read",
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
    image: imgLongRafting,
    imageAlt: "Guide and rafters in a blue raft paddling through Kali River rapids",
  },
  {
    slug: "dandeli-camping-and-riverside-stays-guide",
    title: "Dandeli Camping Guide: Riverside, Jungle & Resort Stays",
    excerpt: "Riverside or jungle? Tent or room? What a camp night in Dandeli looks like, what is usually included and how to pack for it.",
    summary: "A night in the forest is half the magic of Dandeli. This guide compares riverside and jungle camps, tents and rooms, and shows what an evening actually looks like from arrival to a chilly morning cup of tea — plus what is usually included, how to stay safe, and exactly what to pack.",
    category: "Camping & Stays",
    readTime: "8 min read",
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
    image: imgcampfire,
    imageAlt: "Group of friends around a campfire beside tents in the Dandeli forest",
  },
  {
    slug: "dandeli-wildlife-and-jungle-safari-guide",
    title: "Dandeli Wildlife & Jungle Safari Guide: What You Can Spot",
    excerpt: "What lives in Dandeli's forests, when to go, how to improve your chances of a sighting and how to behave on safari.",
    summary: "Dandeli sits in one of the richest wildlife regions in India, but seeing that wildlife takes patience and good habits. This guide covers what actually lives in the forest, which sightings are common and which are rare, the best season and time of day, how safaris, treks and bird walks differ, and the etiquette that keeps both you and the animals safe.",
    category: "Wildlife",
    readTime: "8 min read",
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
    image: imgNature,
    imageAlt: "Trekkers walking a green forest trail beside the Kali River in Dandeli",
  },
  {
    slug: "places-to-visit-near-dandeli",
    title: "Places to Visit Near Dandeli: Caves, Waterfalls & Viewpoints",
    excerpt: "Beyond rafting: the caves, gorges, temples and waterfalls worth adding to your Dandeli trip, with approximate distances and half-day and full-day combinations.",
    summary: "There is more to Dandeli than the river. Within an hour or two you can reach a towering rock gorge, ancient limestone caves, a peaceful reservoir, a historic temple town and two of the region's best waterfalls. Here is what each place is like, roughly how far it is, and how to string them into half-day and full-day outings.",
    category: "Sightseeing",
    readTime: "9 min read",
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
    image: imgReviewsBg,
    imageAlt: "Aerial view of the Kali River flowing between forested islands near Dandeli",
  },
  {
    slug: "dandeli-river-guide",
    title: "The Dandeli River: A Complete Guide to the Kali River",
    excerpt: "What everyone calls the 'Dandeli River' is officially the Kali River — here's its route, rapids, dam, wildlife, and the best places to experience it.",
    summary: "Most visitors call it the Dandeli River, but its official name is the Kali River — the water that shapes every trip here. This guide covers where the river comes from and goes, why its mood changes daily with the dam release, what its rapids actually feel like, the wildlife along its banks, and the best spots to see it without getting in a raft.",
    category: "River Guide",
    readTime: "8 min read",
    datePublished: "2026-09-24",
    dateModified: "2026-09-24",
    image: imgScenery,
    imageAlt: "The Dandeli River flowing through forested rocks near Ganeshgudi, Dandeli",
  },
];
