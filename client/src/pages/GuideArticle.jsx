import { Link, Navigate, useParams } from "react-router-dom";
import { Clock, CalendarDays, ArrowLeft, Lightbulb } from "lucide-react";
import LandingHero from "../components/landing/LandingHero";
import LandingCta from "../components/landing/LandingCta";
import FaqSection from "../components/landing/FaqSection";
import GuidePost from "../components/guides/GuidePost";
import RichText from "../components/guides/RichText";
import { GUIDES_PATH, formatGuideDate, getRelatedGuideSummaries, guidePath, headingId } from "../lib/guides";
import { getGuide } from "../lib/guideContent";
import { useSEO, SITE_URL } from "../lib/seo";
import { CONTACT } from "../lib/contact";

const GuideArticle = () => {
  const { slug } = useParams();
  const guide = getGuide(slug);

  useSEO({
    title: guide?.seoTitle ?? "Dandeli Travel Guides",
    description: guide?.metaDescription ?? "",
    path: guide ? guidePath(guide.slug) : GUIDES_PATH,
  });

  if (!guide) return <Navigate to={GUIDES_PATH} replace />;

  const canonicalUrl = `${SITE_URL}${guidePath(guide.slug)}`;
  const relatedGuides = getRelatedGuideSummaries(guide);
  const wordCount = guide.sections
    .flatMap((section) => [...section.paragraphs, ...(section.list || [])])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  const publisher = { "@type": "Organization", name: CONTACT.businessName, url: `${SITE_URL}/` };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    image: [`${SITE_URL}${guide.image}`],
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    articleSection: guide.category,
    inLanguage: "en-IN",
    wordCount,
    author: publisher,
    publisher,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <>
      <LandingHero
        key={guide.slug}
        eyebrow={guide.category}
        current={guide.title}
        parent={{ name: "Travel Guides", path: GUIDES_PATH }}
        intro={guide.excerpt}
        bgImage={guide.image}
      >
        {guide.title}
      </LandingHero>

      <article className="bg-[#021915] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10 text-xs font-body text-gray-300">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1.5 text-cyan-300">
                <Clock size={14} />
                {guide.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                Updated {formatGuideDate(guide.dateModified)}
              </span>
            </div>
            <Link
              to={GUIDES_PATH}
              className="inline-flex items-center gap-1.5 font-heading font-bold uppercase tracking-wider text-gray-300 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={14} />
              All guides
            </Link>
          </div>

          <nav
            aria-label="In this guide"
            className="mb-12 bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-8"
          >
            <h2 className="text-xs font-heading font-extrabold uppercase tracking-wider text-cyan-300 mb-4">
              In this guide
            </h2>
            <ul className="space-y-2.5 text-sm font-body text-gray-200">
              {guide.sections.map((section) => (
                <li key={section.heading} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <a href={`#${headingId(section.heading)}`} className="hover:text-amber-300 transition-colors">
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-12">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2
                  id={headingId(section.heading)}
                  className="scroll-mt-28 text-2xl sm:text-3xl font-heading font-black text-white tracking-tight leading-snug mb-5"
                >
                  {section.heading}
                </h2>

                <div className="space-y-4 text-gray-200 font-body text-base leading-relaxed">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>

                {section.list && (
                  <ul className="mt-5 space-y-3 text-gray-200 font-body text-base leading-relaxed">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                        <span>
                          <RichText text={item} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.tip && (
                  <aside className="mt-6 flex gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm font-body leading-relaxed text-amber-50">
                    <Lightbulb size={18} className="mt-0.5 shrink-0 text-amber-400" />
                    <p>
                      <span className="font-heading font-bold uppercase tracking-wider text-amber-300 text-xs">Tip · </span>
                      <RichText text={section.tip} />
                    </p>
                  </aside>
                )}

                {section.image && (
                  <figure className="mt-8">
                    <img
                      src={section.image}
                      alt={section.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-3xl border border-white/15 object-cover shadow-xl"
                    />
                    {section.caption && (
                      <figcaption className="mt-3 text-center text-xs font-body text-gray-400">{section.caption}</figcaption>
                    )}
                  </figure>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>

      <FaqSection faqs={guide.faqs} />

      {relatedGuides.length > 0 && (
        <section className="bg-[#021915] border-t border-white/10 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-white mb-8 tracking-wider text-center">
              Keep <span className="text-amber-400">Reading</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
              {relatedGuides.map((related) => (
                <GuidePost key={related.slug} guide={related} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      <LandingCta
        heading="Ready to Plan Your Dandeli Trip?"
        subheading="Message us on WhatsApp or book online — we'll confirm your date, package and pickup within 24 hours."
      />

      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
    </>
  );
};

export default GuideArticle;
