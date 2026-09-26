import { useRef } from "react";
import faqBg from "../../assets/Backgroundimg/faq-1920.webp";
import { useNearViewport } from "../../lib/useNearViewport";

// Native <details>/<summary> accordion — content stays in the DOM even when
// collapsed (unlike a JS-toggled show/hide), so it's fully crawlable and
// needs no client-side state, which keeps this safe to prerender.
const FaqSection = ({ faqs }) => {
  const sectionRef = useRef(null);
  const bgNear = useNearViewport(sectionRef);
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#021915]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={bgNear ? { backgroundImage: `url(${faqBg})` } : undefined}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#021915]/85 via-[#021915]/55 to-[#021915]/90 pointer-events-none"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-white mb-8 tracking-wider text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-slate-900/90 border border-white/15 open:border-cyan-400/40 rounded-2xl px-5 py-4 transition-colors"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-heading font-bold text-white text-sm sm:text-base [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="shrink-0 text-cyan-400 text-xl leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed font-body">{faq.a}</p>
            </details>
          ))}
        </div>

        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </div>
    </section>
  );
};

export default FaqSection;
