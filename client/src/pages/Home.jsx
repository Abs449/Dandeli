import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Packages from "../components/Packages";
import Location from "../components/Location";
import FaqSection from "../components/landing/FaqSection";
import { scrollToElement } from "../utils/Smoothscroll";
import { useSEO } from "../lib/seo";

const ReviewCarousel = lazy(() => import("../components/ReviewCarousel"));

// Broad, brand-level questions — distinct from the topic-specific FAQs on
// the rafting/packages/camping/activities landing pages, so this reinforces
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
    a: "White-water rafting, kayaking, zipline, water zorbing, trekking, jungle safaris, riverside and jungle camping, and all-inclusive day and overnight packages. Browse our rafting, packages, camping, and adventure activities pages for full details and pricing.",
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

const ReviewFallback = () => (
  <section className="py-24 bg-green-100/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-3xl bg-white/60 animate-pulse h-64" />
        ))}
      </div>
    </div>
  </section>
);

const Home = () => {
  const location = useLocation();

  useSEO({
    title: "Dandeli River Rafting & Jungle Adventures | Book Kali River Rafting, Camping & Zipline",
    description:
      "Book white-water rafting, kayaking, zipline, jungle safaris, and riverside camping in Dandeli, Karnataka with Dandeli Kali River Rafting. 8+ years' experience, 5000+ happy travelers, transparent pricing.",
    path: "/",
  });

  useEffect(() => {
    const targetId =
      location.state?.scrollTo ||
      location.hash?.replace('#', '');

    if (!targetId) return;

    // Small delay lets the route's sections mount/layout before we measure
    // their position.
    const timer = setTimeout(() => {
      scrollToElement(targetId);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Packages />
      <Location />
      <Suspense fallback={<ReviewFallback />}>
        <ReviewCarousel />
      </Suspense>
      <section className="bg-[#021915] border-t border-white/10">
        <FaqSection faqs={homeFaqs} />
      </section>
    </>
  );
};

export default Home;