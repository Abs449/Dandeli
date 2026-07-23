import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Flame, MapPin, Compass } from "lucide-react";
import { usePackages } from "../lib/data";

const PackageCard = ({ pkg, navigate }) => {
  const recommended = pkg.recommended;

  return (
    <article
      className={`snap-start shrink-0 w-[320px] sm:w-[360px] md:w-auto relative rounded-4xl overflow-hidden transition-all duration-500 border flex flex-col h-full justify-between ${
        recommended
          ? "bg-slate-900 text-white shadow-2xl border-accent/40 ring-4 ring-accent/10 md:scale-[1.03] z-10"
          : "bg-white/85 backdrop-blur-md border-neutral-200/60 text-gray-900 shadow-md hover:shadow-xl hover:border-primary/20"
      } card-adventure`}
    >
      {recommended && (
        <div className="absolute top-0 right-6 bg-accent text-white px-4 py-2 rounded-b-2xl text-[10px] font-heading font-black uppercase tracking-widest flex items-center gap-1 shadow-md z-10 animate-pulse">
          <Flame size={12} className="fill-current text-white" />
          Most Popular
        </div>
      )}

      {/* Top Image (increased size) */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden shrink-0">
        <img
          src={pkg.image}
          alt={pkg.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-775 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        
        {/* Bottom tag on image */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 text-primary border border-neutral-200/20">
          <Compass className="w-4 h-4 text-accent animate-spin-slow" />
          {pkg.duration}
        </div>
      </div>

      {/* Content Column (increased padding) */}
      <div className="p-8 sm:p-10 flex flex-col grow justify-between">
        <div>
          <div className="mb-6">
            <h3 className={`text-2xl sm:text-3xl font-heading font-black tracking-tight ${recommended ? "text-white" : "text-gray-900"}`}>
              {pkg.name}
            </h3>
            
            <div className="flex flex-wrap items-baseline gap-2 mt-2">
              <span
                className={`text-4xl sm:text-5xl font-heading font-black tracking-tight ${
                  recommended ? "text-accent" : "text-primary"
                }`}
              >
                {pkg.price}
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${recommended ? "text-slate-400" : "text-gray-500"}`}>
                / adventurer
              </span>
            </div>
          </div>

          {/* Activities Check List (increased sizes) */}
          <ul className={`space-y-3 mb-8 border-t border-dashed pt-5 grow ${recommended ? "border-white/5" : "border-neutral-200/60"}`}>
            {(pkg.activities || []).map((activity, idx) => (
              <li key={idx} className="flex items-start">
                <div className={`p-0.5 rounded-full mr-3 shrink-0 mt-0.5 ${
                  recommended ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                }`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`font-body text-sm sm:text-base leading-relaxed ${
                    recommended ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {activity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => navigate(`/booking?package=${pkg.id}`)}
          className={`w-full py-4 rounded-full font-heading font-black text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer mt-auto ${
            recommended
              ? "bg-accent hover:bg-accent/90 text-white shadow-accent/20"
              : "bg-primary hover:bg-primary-dark text-white shadow-primary/20"
          }`}
        >
          Book {pkg.name.split(" ")[0]}
        </button>
      </div>
    </article>
  );
};

const Packages = () => {
  const { data: packages, loading } = usePackages();
  const navigate = useNavigate();

  return (
    <section
      id="packages"
      className="py-24 bg-gradient-to-b from-[#f4ebe1] via-[#eae0d5] to-[#decbb7] relative overflow-hidden text-gray-900"
    >
      {/* Wave top transition */}
      <div className="absolute top-0 left-0 w-full z-10 rotate-180">
        <div className="wave-divider wave-divider-sand-bottom" />
      </div>

      <div className="absolute top-20 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        <div className="text-center mb-16">
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-bold mb-3">
            Pricing Plans
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-6">
            Choose Your Adventure
          </h2>
          <p className="text-lg text-gray-655 max-w-2xl mx-auto font-body">
            Choose from our all-inclusive plans. Whether a day-trip or a full forest-camp weekend stay, we have you covered.
          </p>
        </div>

        {loading && (
          <div className="flex flex-nowrap md:grid md:grid-cols-3 overflow-x-auto gap-6 pb-6 -mx-4 px-4 md:mx-0 md:px-0">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[320px] sm:w-[360px] md:w-auto h-[480px] rounded-4xl bg-white/60 animate-pulse border border-neutral-200/40"
              />
            ))}
          </div>
        )}

        <div className="flex flex-nowrap md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible gap-6 md:gap-8 snap-x snap-mandatory no-scrollbar pb-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth items-stretch">
          {packages?.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} navigate={navigate} />
          ))}
        </div>
      </div>

      {/* Wave bottom transition */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <div className="wave-divider wave-divider-darksand-bottom" />
      </div>
    </section>
  );
};

export default Packages;
