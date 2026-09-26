import LandingHero from "../components/landing/LandingHero";
import LandingCta from "../components/landing/LandingCta";
import GuidePost from "../components/guides/GuidePost";
import { seedGuideSummaries } from "../data/guideSummaries";
import { guidePath } from "../lib/guides";
import { useSEO, SITE_URL } from "../lib/seo";
import { LANDING_PAGES } from "../lib/landingPagesMeta";
import bgImage from "../assets/Backgroundimg/reviews-bg.webp";

const Guides = () => {
  useSEO({ ...LANDING_PAGES.guides });

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dandeli Travel Guides",
    url: `${SITE_URL}${LANDING_PAGES.guides.path}`,
    description: LANDING_PAGES.guides.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: seedGuideSummaries.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${guidePath(guide.slug)}`,
        name: guide.title,
      })),
    },
  };

  return (
    <>
      <LandingHero
        eyebrow="Travel Guides"
        current="Travel Guides"
        intro="Everything you need to plan a trip to Dandeli — when to go, how to get here, what to do, what it costs and what to pack — written by the locals who run the river."
        bgImage={bgImage}
      >
        Dandeli Travel Guides
      </LandingHero>

      <section className="bg-[#021915] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-16 sm:gap-y-20">
            {seedGuideSummaries.map((guide) => (
              <GuidePost key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      <LandingCta
        heading="Ready to Plan Your Dandeli Trip?"
        subheading="Message us on WhatsApp or book online — we'll confirm your date, package and pickup within 24 hours."
      />

      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  );
};

export default Guides;
