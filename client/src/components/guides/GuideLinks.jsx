import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import GuidePost from "./GuidePost";
import { GUIDES_PATH, getGuide } from "../../lib/guides";

// A "read more" strip linking a page to a handpicked set of guides. Gives the
// prerendered landing pages real, crawlable internal links into the guides
// (the footer is hidden on those pages, so they'd otherwise have none).
const GuideLinks = ({ slugs, heading = "Plan Your Trip", highlight = "Guides" }) => {
  const guides = slugs.map(getGuide).filter(Boolean);
  if (guides.length === 0) return null;

  return (
    <section className="bg-[#021915] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-white mb-10 tracking-wider text-center">
          {heading} <span className="text-amber-400">{highlight}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {guides.map((guide) => (
            <GuidePost key={guide.slug} guide={guide} compact />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to={GUIDES_PATH}
            className="inline-flex items-center gap-2 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300 hover:text-amber-300 transition-colors"
          >
            View all Dandeli travel guides
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GuideLinks;
