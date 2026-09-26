import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import FaqSection from "../components/landing/FaqSection";
import GuideLinks from "../components/guides/GuideLinks";
import { scrollToElement } from "../utils/Smoothscroll";
import { useSEO } from "../lib/seo";

// Everything below the hero is its own lazy chunk behind its own Suspense
// boundary. This is not about hiding content: the homepage is prerendered
// with React's static prerender API, which waits for every lazy chunk, so
// all of these sections are fully present in the HTML crawlers receive.
// On the client, hydrateRoot keeps that server HTML on screen and hydrates
// each boundary independently as its chunk arrives, instead of executing
// every section's code in one long task before the page can respond —
// that single long task was most of the homepage's mobile Total Blocking
// Time.
//
// Each section also waits to even fetch its code until it's near the
// viewport (or the visitor first interacts with the page). While it waits,
// React simply leaves that section's prerendered HTML in place — visible,
// readable, and crawlable, just not yet interactive. Without this, React
// requests and hydrates every section at startup regardless of whether
// it's anywhere near the screen.
const whenNear = (id) =>
  new Promise((resolve) => {
    // Server render, or a client-side navigation to "/" (no prerendered
    // section to watch): load right away.
    if (typeof document === "undefined") return resolve();
    const el = document.getElementById(id);
    if (!el || typeof IntersectionObserver === "undefined") return resolve();

    const events = ["pointerdown", "keydown", "touchstart", "wheel"];
    const done = () => {
      observer.disconnect();
      events.forEach((e) => window.removeEventListener(e, done));
      resolve();
    };
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && done(), {
      rootMargin: "300px 0px",
    });
    observer.observe(el);
    // Any interaction also counts — e.g. a nav click that jumps down the
    // page, or leaving and coming back before this section was reached.
    events.forEach((e) => window.addEventListener(e, done, { once: true, passive: true }));
  });

const lazyNear = (id, load) => lazy(() => whenNear(id).then(load));

const About = lazyNear("about", () => import("../components/About"));
const Services = lazyNear("services", () => import("../components/Services"));
const Packages = lazyNear("packages", () => import("../components/Packages"));
const Location = lazyNear("location", () => import("../components/Location"));
const ReviewCarousel = lazyNear("reviews", () => import("../components/ReviewCarousel"));

// Broad, brand-level questions — distinct from the topic-specific FAQs on
// the rafting/packages landing pages, so this reinforces
// different search queries instead of competing with them. The homepage is
// the highest-authority page on the site, so its own FAQPage schema (added
// by FaqSection) carries more weight than any single landing page's.
const homeFaqs = [
  {
    q: "Does rafting happen in Dandeli town, or somewhere else?",
    a: "Rafting takes place on the Kali River at Ganeshgudi, not in Dandeli town itself — a common surprise for first-time visitors. We handle pickup and drop so it's one less thing to plan around.",
  },
  {
    q: "What activities and packages do you offer?",
    a: "White-water rafting, kayaking, zipline, water zorbing, trekking, jungle safaris, riverside and jungle camping, and all-inclusive day and overnight packages. Browse our rafting and packages pages for full details and pricing, or read our travel guides for planning tips.",
  },
  {
    q: "Is rafting suitable for beginners and families with kids?",
    a: "Yes. Our Short Rafting route (1km, about 40 minutes) is rated Beginner and is a popular choice for first-timers and families, with a certified guide, life jacket, and helmet on every raft.",
  },
  {
    q: "Is pricing transparent, or are there hidden costs?",
    a: "Pricing is upfront on every activity and package — what you see is what you pay, with any optional add-ons like accommodation, transportation, or food clearly listed separately during booking.",
  },
  {
    q: "How do I book, and how quickly will you confirm?",
    a: "Fill out our booking form or message us on WhatsApp with your preferred date, package, and group size — our team confirms availability within 24 hours.",
  },
];

// Only ever seen on client-side navigation back to "/" (e.g. from a guide),
// never on first load — there, the prerendered HTML stays visible until each
// section hydrates.
const SectionFallback = () => <div className="min-h-[70vh] bg-[#021915]" aria-hidden="true" />;

const Deferred = ({ children }) => (
  <div className="cv-auto">
    <Suspense fallback={<SectionFallback />}>{children}</Suspense>
  </div>
);

const Home = () => {
  const location = useLocation();

  useSEO({
    title: "Dandeli Rafting on the Dandeli River | Kali River Rafting",
    description:
      "Dandeli rafting on the Dandeli River (Kali River) — white-water rafting, kayaking, zipline, camping and jungle adventures. 12+ years' experience, 10,000+ happy travelers.",
    path: "/",
  });

  useEffect(() => {
    const targetId =
      location.state?.scrollTo ||
      location.hash?.replace('#', '');

    if (!targetId) return;

    // Sections are lazy chunks, so the target may not exist yet when we
    // arrive here from another page — keep checking briefly instead of a
    // single fixed delay.
    let attempts = 0;
    let timer = setTimeout(function tryScroll() {
      if (document.getElementById(targetId)) {
        scrollToElement(targetId);
      } else if (++attempts < 30) {
        timer = setTimeout(tryScroll, 100);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Hero />
      <Deferred><About /></Deferred>
      <Deferred><Services /></Deferred>
      <Deferred><Packages /></Deferred>
      <Deferred><Location /></Deferred>
      <Deferred><ReviewCarousel /></Deferred>
      <div className="cv-auto">
        <GuideLinks
          heading="Plan Your Dandeli"
          highlight="Trip"
          slugs={["best-time-to-visit-dandeli", "things-to-do-in-dandeli", "dandeli-2-day-itinerary-and-trip-cost"]}
        />
      </div>
      <section className="cv-auto bg-[#021915] border-t border-white/10">
        <FaqSection faqs={homeFaqs} />
      </section>
    </>
  );
};

export default Home;