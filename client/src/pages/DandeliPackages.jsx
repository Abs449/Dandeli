import { Check, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import LandingHero from "../components/landing/LandingHero";
import FaqSection from "../components/landing/FaqSection";
import LandingCta from "../components/landing/LandingCta";
import { seedPackages } from "../data/seedData";
import { useSEO } from "../lib/seo";
import { LANDING_PAGES } from "../lib/landingPagesMeta";
import bgImage from "../assets/Backgroundimg/aboutus-bg.webp";

const detailGroups = [
  { key: "stayOptions", label: "Stay Options" },
  { key: "meals", label: "Meals" },
  { key: "riverActivities", label: "River Activities" },
  { key: "resortFun", label: "Resort Fun" },
  { key: "sightseeing", label: "Sightseeing" },
];

const faqs = [
  {
    q: "What's included in the package price?",
    a: "Each package price covers everything listed on its card — meals, river activities, and (for overnight packages) accommodation and resort activities. There are no hidden add-ons; anything optional like pickup/drop or extra activities is called out separately at booking.",
  },
  {
    q: "Can I customize a package or combine activities from different ones?",
    a: "Yes. Packages are a starting point, not a fixed menu — mention what you'd like changed (extra nights, specific activities, dietary needs) in the special requests field on the booking form and we'll confirm what's possible.",
  },
  {
    q: "Is accommodation included in every package?",
    a: "The Day Thrill Package is a single-day, no-stay package. The Stay Package and Premium River Side Stay Package both include one night's accommodation (cozy rooms, commando tents, or riverside rooms) with check-in at 12:00 PM and check-out at 11:00 AM the next day.",
  },
  {
    q: "How do I book a package?",
    a: "Pick a package below and tap \"Book This Package\" — it takes you straight to our booking form with the package pre-filled. Our team confirms availability and details within 24 hours.",
  },
];

const DandeliPackages = () => {
  useSEO({ ...LANDING_PAGES.packages });

  return (
    <>
      <LandingHero
        eyebrow="Handcrafted Deals"
        current="Dandeli Packages"
        intro="All-inclusive Kali River Rafting packages covering rafting, kayaking, meals, and — for overnight options — riverside stays and resort activities. Compare what's included before you book."
        bgImage={bgImage}
      >
        Kali River Rafting Packages: Day Trips &amp; Overnight Stays
      </LandingHero>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 bg-[#021915] text-white">
        <div className="space-y-10">
          {seedPackages.map((pkg) => (
            <article
              key={pkg.id}
              className={`rounded-3xl overflow-hidden border flex flex-col lg:flex-row ${
                pkg.recommended
                  ? "bg-slate-950/90 border-cyan-400/60 ring-2 ring-cyan-400/20"
                  : "bg-slate-900/90 border-white/15"
              }`}
            >
              <div className="lg:w-2/5 h-56 lg:h-auto relative overflow-hidden shrink-0">
                <img
                  src={pkg.image}
                  alt={`${pkg.name} adventure package in Dandeli, Karnataka`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r" />
                {pkg.recommended && (
                  <div className="absolute top-4 right-4 bg-amber-400/90 text-slate-950 text-[10px] font-heading font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                    <Flame size={13} className="fill-current text-slate-950" />
                    Most Popular
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8 flex-1">
                <span className="inline-block text-[10px] font-heading font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30 mb-3">
                  {pkg.duration}
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white leading-tight tracking-tight mb-2">
                  {pkg.name}
                </h2>
                <p className="text-sm text-gray-300 font-body leading-relaxed mb-4">{pkg.description}</p>

                <div className="flex items-baseline gap-1.5 border-b border-white/10 pb-5 mb-5">
                  <span className="text-3xl sm:text-4xl font-display font-black text-amber-400 tracking-tighter">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-gray-400 font-body">/ all-inclusive</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mb-6">
                  {detailGroups.map(({ key, label }) =>
                    pkg[key]?.length > 0 ? (
                      <div key={key}>
                        <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-[#f5c97a] mb-2.5">
                          {label}
                        </h3>
                        <ul className="space-y-1.5">
                          {pkg[key].map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-200 font-body">
                              <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null,
                  )}
                </div>

                <Link
                  to={`/booking?package=${encodeURIComponent(pkg.name)}`}
                  className={`inline-block w-full sm:w-auto text-center px-8 py-3.5 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 ${
                    pkg.recommended
                      ? "bg-amber-400 hover:bg-yellow-300 text-slate-950"
                      : "bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 hover:border-amber-400"
                  }`}
                >
                  Book This Package
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FaqSection faqs={faqs} />

      <LandingCta
        heading="Not Sure Which Package Fits?"
        subheading="Message us on WhatsApp with your group size and dates — we'll recommend the right package for you."
      />
    </>
  );
};

export default DandeliPackages;
