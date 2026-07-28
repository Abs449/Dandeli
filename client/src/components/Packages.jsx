import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Check, Flame, Compass } from "lucide-react";
import { usePackages } from "../lib/data";
import bgAdventure from "../assets/Backgroundimg/kayakinwater.jpg.jpeg";

const PackageCard = ({ pkg, index, navigate }) => {
  const recommended = pkg.recommended;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
      className={`snap-center shrink-0 w-[85vw] max-w-[360px] sm:w-[360px] md:w-full relative rounded-3xl overflow-hidden transition-all duration-500 border flex flex-col justify-between ${
        recommended
          ? "bg-slate-900 text-white shadow-2xl border-accent/50 ring-4 ring-accent/15 md:scale-[1.03] z-10"
          : "bg-white/95 backdrop-blur-md border-neutral-200/60 text-gray-900 shadow-xl hover:shadow-2xl hover:border-primary/40"
      } card-adventure`}
    >
      {recommended && (
        <div className="absolute top-0 right-6 bg-accent text-white px-4 py-2 rounded-b-2xl text-[11px] font-heading font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg z-10 animate-pulse">
          <Flame size={13} className="fill-current text-white" />
          Most Popular
        </div>
      )}

      {/* Top Image */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden shrink-0">
        <img
          src={pkg.image}
          alt={pkg.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        
        {/* Bottom duration tag on image */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 text-primary border border-neutral-200/30">
          <Compass className="w-4 h-4 text-accent animate-spin-slow" />
          {pkg.duration}
        </div>
      </div>

      {/* Content Column */}
      <div className="p-6 sm:p-7 flex flex-col grow justify-between">
        <div>
          <div className="mb-5">
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

          {/* Activities Check List */}
          <ul className={`space-y-3 mb-6 border-t border-dashed pt-5 min-h-[170px] flex flex-col justify-start ${recommended ? "border-white/15" : "border-neutral-200/80"}`}>
            {(pkg.activities || []).map((activity, idx) => (
              <li key={idx} className="flex items-start">
                <div className={`p-0.5 rounded-full mr-3 shrink-0 mt-0.5 ${
                  recommended ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"
                }`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`font-body text-sm sm:text-base leading-relaxed ${
                    recommended ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {activity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(`/booking?package=${pkg.id}`)}
          className={`w-full py-4 rounded-full font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-lg hover:-translate-y-0.5 cursor-pointer mt-auto ${
            recommended
              ? "bg-accent hover:bg-accent/90 text-white shadow-accent/30"
              : "bg-primary hover:bg-primary-dark text-white shadow-primary/25"
          }`}
        >
          Book {pkg.name.split(" ")[0]}
        </motion.button>
      </div>
    </motion.article>
  );
};

const Packages = () => {
  const { data: packages, loading } = usePackages();
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // Scroll-linked background zoom effect with spring physics smoothing
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.15, 1.05]);
  const bgScale = useSpring(rawScale, { stiffness: 90, damping: 30, restDelta: 0.0001 });

  return (
    <section
      ref={sectionRef}
      id="packages"
      className="py-20 relative overflow-hidden text-gray-900"
    >
      {/* Original Background Image with Scroll-Driven Motion */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgAdventure})`,
          scale: bgScale,
          opacity: 1,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-accent uppercase tracking-[0.3em] text-xs font-bold mb-2.5 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-md">
            Pricing Plans
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 drop-shadow-lg">
            Choose Your Adventure
          </h2>
          <p className="text-base sm:text-lg text-slate-100 max-w-xl mx-auto font-body font-medium drop-shadow-md">
            Choose from our all-inclusive plans. Whether a day-trip or a full forest-camp weekend stay, we have you covered.
          </p>
        </motion.div>

        {loading && (
          <div className="flex flex-nowrap md:grid md:grid-cols-3 overflow-x-auto gap-6 pb-6 -mx-4 px-4 md:mx-0 md:px-0">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="snap-center shrink-0 w-[85vw] max-w-[360px] sm:w-[360px] md:w-full h-[540px] rounded-3xl bg-white/60 animate-pulse border border-neutral-200/40"
              />
            ))}
          </div>
        )}

        <div className="flex flex-nowrap md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible gap-6 md:gap-8 snap-x snap-mandatory no-scrollbar pb-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth items-stretch">
          {packages?.map((pkg, idx) => (
            <PackageCard key={pkg.id} pkg={pkg} index={idx} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
