import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { usePackages } from "../lib/data";
import bgAdventure from "../assets/Backgroundimg/kayakinwater.webp";

const PackageCard = ({ pkg, index, navigate }) => {
  const recommended = pkg.recommended;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`snap-center shrink-0 w-[85vw] sm:w-[340px] md:w-auto relative rounded-3xl overflow-hidden transition-all duration-300 ease-out border flex flex-col justify-between group cursor-pointer min-h-[580px] sm:min-h-[620px] transform-gpu hover:-translate-y-3 hover:scale-[1.02] ${
        recommended
          ? "bg-slate-950/90 text-white shadow-2xl border-cyan-400/60 ring-4 ring-cyan-400/30 md:scale-[1.03] z-10 hover:border-amber-400/80 hover:shadow-cyan-500/20"
          : "bg-slate-900/90 text-white border-white/15 hover:border-cyan-400/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-950/50"
      }`}
    >
      {/* Glassmorphic Most Popular Tag */}
      {recommended && (
        <div className="absolute top-3 right-3 bg-amber-400/90 text-slate-950 text-[10px] font-heading font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-amber-300/50 backdrop-blur-md shadow-lg flex items-center gap-1.5 z-20">
          <Flame size={13} className="fill-current text-slate-950" />
          Most Popular
        </div>
      )}

      {/* Card Header & Image */}
      <div>
        <div className="h-64 sm:h-72 overflow-hidden relative">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 transform-gpu"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
            <div>
              <span className="inline-block text-[10px] font-heading font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md mb-2">
                {pkg.duration}
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white leading-tight group-hover:text-cyan-300 transition-colors duration-200 tracking-tight">
                {pkg.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Price & Activities List */}
        <div className="p-7 sm:p-8 space-y-6">
          <div className="flex items-baseline gap-1.5 border-b border-white/10 pb-5">
            <span className="text-4xl sm:text-5xl font-display font-black text-amber-400 tracking-tighter transition-transform duration-200 group-hover:scale-105 origin-left">
              {pkg.price}
            </span>
            <span className="text-xs text-gray-400 font-body">/ all-inclusive</span>
          </div>

          <ul className="space-y-3.5">
            {pkg.activities?.map((activity, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-200 font-body">
                <div className="w-4.5 h-4.5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-400/30 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors duration-200">
                  <Check size={11} />
                </div>
                <span className="leading-relaxed">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Action CTA Button */}
      <div className="p-7 sm:p-8 pt-0 mt-auto">
        <button
          onClick={() => navigate(`/booking?package=${encodeURIComponent(pkg.name)}`)}
          className={`w-full py-4 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2 ${
            recommended
              ? "bg-amber-400 hover:bg-yellow-300 text-slate-950 shadow-amber-400/25 hover:shadow-lg"
              : "bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 hover:border-amber-400"
          }`}
        >
          <span>Book This Package</span>
        </button>
      </div>
    </motion.article>
  );
};

const Packages = () => {
  const { data: packages, loading } = usePackages();
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // Lightweight scroll transform
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.08, 1.02]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 0.95, 0.95, 0.6]);

  return (
    <section
      ref={sectionRef}
      id="packages"
      className="py-28 sm:py-36 md:py-44 relative overflow-hidden bg-[#021915] text-white flex flex-col justify-center border-t border-white/10"
    >
      {/* Background Image Layer with Parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgAdventure})`,
          scale: bgScale,
          opacity: bgOpacity,
        }}
      />

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021915]/60 via-[#021915]/30 to-[#021915]/65 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2.5 bg-cyan-950/60 px-4 py-1 rounded-full border border-cyan-500/30 shadow-md">
            Handcrafted Deals
          </span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white mb-4 drop-shadow-md italic tracking-tighter leading-tight">
            Popular <span className="text-amber-400">Adventure Packages</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-body font-light leading-relaxed">
            All-inclusive multi-activity bundles designed for families, couples, and thrill-seeking groups.
          </p>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-slate-900/60 animate-pulse h-96 border border-white/10"
              />
            ))}
          </div>
        )}

        {/* Layout: In-page 3-Column Grid on Desktop / Smooth Horizontal Touch Carousel on Mobile */}
        {packages && (
          <div className="flex md:grid md:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory pb-4 md:pb-0 px-2 md:px-0">
            {packages.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Packages;
