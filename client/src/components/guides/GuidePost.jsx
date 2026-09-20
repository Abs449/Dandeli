import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { formatGuideDate, guidePath } from "../../lib/guides";

// Editorial blog-post entry: big photo, then date / title / a full descriptive
// summary — deliberately not a boxed card. `compact` is for "keep reading"
// rows where space is tighter.
const GuidePost = ({ guide, compact = false }) => (
  <article className="group">
    <Link to={guidePath(guide.slug)} className="block">
      <div className="overflow-hidden bg-slate-900">
        <img
          src={guide.image}
          alt={guide.imageAlt}
          loading="lazy"
          decoding="async"
          className="w-full aspect-[5/3] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-body font-semibold uppercase tracking-widest text-gray-400">
        <time dateTime={guide.datePublished}>{formatGuideDate(guide.datePublished, "short")}</time>
        <span aria-hidden="true" className="text-cyan-400">•</span>
        <span className="text-cyan-300">{guide.category}</span>
        <span aria-hidden="true" className="text-cyan-400">•</span>
        <span>{guide.readTime}</span>
      </p>

      <h3
        className={`mt-3 font-display font-black uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-amber-300 ${
          compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl lg:text-4xl"
        }`}
      >
        {guide.title}
      </h3>

      <p
        className={`mt-4 font-body text-gray-300 leading-relaxed ${
          compact ? "text-sm line-clamp-4" : "text-base"
        }`}
      >
        {guide.summary}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-amber-400">
        Read the guide
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" />
      </span>
    </Link>
  </article>
);

export default GuidePost;
