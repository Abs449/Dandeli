import { useRef , useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform ,useMotionValue,
animate,} from "framer-motion";
import { Check, Flame } from "lucide-react";
import { usePackages } from "../lib/data";
import bgAdventure from "../assets/Backgroundimg/kayak-bg.webp";

const PackageCard = ({ pkg, index, navigate ,onExpand}) => {
  const recommended = pkg.recommended;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onExpand(pkg)}
      className={`snap-center shrink-0 w-[85vw] sm:w-[340px] md:w-auto relative rounded-3xl overflow-hidden transition-all duration-300 ease-out border flex flex-col justify-between group cursor-pointer min-h-[580px] sm:min-h-[620px] transform-gpu hover:-translate-y-3 hover:scale-[1.02] ${recommended
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
            {[
              ...(pkg.riverActivities || []).slice(0, 3),
              ...(pkg.meals || []).slice(0, 1),
              ...(pkg.stayOptions || []).slice(0, 1),
            ].map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-gray-200 font-body"
              >
                <div className="w-4.5 h-4.5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-400/30 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors duration-200">
                  <Check size={11} />
                </div>

                <span className="leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Action CTA Button */}
      <div className="p-7 sm:p-8 pt-0 mt-auto">
        <div
          
          className={`w-full py-4 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2 ${recommended
              ? "bg-amber-400 hover:bg-yellow-300 text-slate-950 shadow-amber-400/25 hover:shadow-lg"
              : "bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 hover:border-amber-400"
            }`}
        >
          <span>Click to know more</span>
        </div>
      </div>
    </motion.article>
  );
};

const Packages = () => {
  const { data: packages, loading } = usePackages();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const mobileTrackRef = useRef(null);
const mobileViewportRef = useRef(null);

const mobileX = useMotionValue(0);

const MOBILE_SWIPE_DISTANCE = 80;
const MOBILE_SCROLL_SPEED = 0.55;
const [mobileDragConstraints, setMobileDragConstraints] = useState({
  left: 0,
  right: 0,
});

  const [selectedPackage, setSelectedPackage] = useState(null);
const [mobilePackageIndex, setMobilePackageIndex] = useState(0);

useEffect(() => {
  if (!packages || window.innerWidth >= 768) return;

  const calculateConstraints = () => {
    const track = mobileTrackRef.current;
    const viewport = mobileViewportRef.current;

    if (!track || !viewport || !track.children.length) return;

    const cards = Array.from(track.children);
    const viewportCenter = viewport.clientWidth / 2;

    const firstCard = cards[0];
    const lastCard = cards[cards.length - 1];

    const firstX =
      viewportCenter -
      (firstCard.offsetLeft + firstCard.offsetWidth / 2);

    const lastX =
      viewportCenter -
      (lastCard.offsetLeft + lastCard.offsetWidth / 2);

    setMobileDragConstraints({
      left: Math.min(firstX, lastX),
      right: Math.max(firstX, lastX),
    });
  };

  // Wait until cards have been rendered
  requestAnimationFrame(calculateConstraints);

  window.addEventListener("resize", calculateConstraints);

  return () => {
    window.removeEventListener("resize", calculateConstraints);
  };
}, [packages]);

  useEffect(() => {
  mobileX.set(0);
  setMobilePackageIndex(0);
}, [packages]);
  useEffect(() => {
  document.body.style.overflow = selectedPackage ? "hidden" : "";

  return () => {
    document.body.style.overflow = "";
  };
}, [selectedPackage]);

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
      className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-[#021915] text-white flex flex-col justify-center border-t border-white/10"
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
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-block text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2.5 bg-cyan-950/60 px-4 py-1 rounded-full border border-cyan-500/30 shadow-md">
            Handcrafted Deals
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white mb-3 drop-shadow-md tracking-wider leading-snug">
            Popular <span className="text-amber-400">Adventure Packages</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-body font-light leading-relaxed">
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
  <div
    ref={mobileViewportRef}
    className="overflow-hidden w-full"
  >
    <motion.div
  ref={mobileTrackRef}
  id="packages-carousel"
  drag={window.innerWidth < 768 ? "x" : false}
  dragConstraints={mobileDragConstraints}
dragElastic={0}
  dragMomentum={false}
  dragDirectionLock
  style={{ x: mobileX }}
      onDragEnd={(event, info) => {
        if (window.innerWidth >= 768) return;

        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Small movement = don't change package
        if (
          Math.abs(offset) < MOBILE_SWIPE_DISTANCE &&
          Math.abs(velocity) < 300
        ) {
          return;
        }

        const cards = Array.from(
          mobileTrackRef.current?.children || []
        );

        const viewport = mobileViewportRef.current;

        if (!cards.length || !viewport) return;

        const direction =
          offset < 0 || velocity < 0 ? 1 : -1;

        const currentX = mobileX.get();

        const viewportCenter =
          viewport.clientWidth / 2;

        let currentIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
          const cardCenter =
            card.offsetLeft +
            card.offsetWidth / 2 +
            currentX;

          const distance =
            Math.abs(cardCenter - viewportCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            currentIndex = index;
          }
        });

        const nextIndex = Math.max(
          0,
          Math.min(
            cards.length - 1,
            currentIndex + direction
          )
        );
        setMobilePackageIndex(nextIndex);

        const targetCard = cards[nextIndex];

        const targetX =
          viewportCenter -
          (targetCard.offsetLeft +
            targetCard.offsetWidth / 2);

animate(mobileX, targetX, {
  type: "tween",
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1],
});
      }}
      className="flex md:grid md:grid-cols-3 gap-6 sm:gap-8 pb-4 md:pb-0"
    >
      {packages.map((pkg, index) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          index={index}
          navigate={navigate}
          onExpand={setSelectedPackage}
        />
      ))}
    </motion.div>
  </div>
)}
        
        {/* Mobile Package Navigation */}
        <div className="md:hidden flex items-center justify-center gap-5 mt-4 mb-2">
          <button
  type="button"
  onClick={() => {
    if (mobilePackageIndex === 0) return;

    const nextIndex = mobilePackageIndex - 1;
    setMobilePackageIndex(nextIndex);

    animate(mobileX, mobileX.get() + 350, {
      type: "tween",
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    });
  }}
  className={`w-9 h-9 rounded-full border flex items-center justify-center text-lg font-bold shadow-lg transition-all ${
    mobilePackageIndex === 0
      ? "border-white/10 bg-white/5 text-white/20 cursor-not-allowed opacity-40"
      : "border-amber-400/60 bg-[#021915]/90 text-amber-400 active:scale-90"
  }`}
  aria-label="Previous package"
>
  ←
</button>

          <span className="text-xs text-amber-400 font-heading font-bold uppercase tracking-wider">
            Swipe to explore
          </span>

          <button
  type="button"
  onClick={() => {
    if (!packages || mobilePackageIndex >= packages.length - 1) return;

    const nextIndex = mobilePackageIndex + 1;
    setMobilePackageIndex(nextIndex);

    animate(mobileX, mobileX.get() - 350, {
      type: "tween",
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    });
  }}
  className={`w-9 h-9 rounded-full border flex items-center justify-center text-lg font-bold shadow-lg transition-all ${
    packages && mobilePackageIndex >= packages.length - 1
      ? "border-white/10 bg-white/5 text-white/20 cursor-not-allowed opacity-40"
      : "border-amber-400/60 bg-[#021915]/90 text-amber-400 active:scale-90"
  }`}
  aria-label="Next package"
>
  →
</button>
        </div>
        
      </div>
      <AnimatePresence>
  {selectedPackage && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6"
      onClick={() => setSelectedPackage(null)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#021915] border border-[#f5c97a]/50 shadow-2xl text-white"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setSelectedPackage(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white text-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        {/* Package Image */}
        <div className="h-56 sm:h-72 relative overflow-hidden">
          <img
            src={selectedPackage.image}
            alt={selectedPackage.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#021915] via-[#021915]/30 to-transparent" />

          <div className="absolute bottom-5 left-6 right-6">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-full border border-cyan-500/30">
              {selectedPackage.duration}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-black">
              {selectedPackage.name}
            </h2>
          </div>
        </div>

        {/* Package Information */}
        <div className="p-6 sm:p-8">

          {/* Price */}
          <div className="flex items-baseline gap-2 border-b border-white/10 pb-5">
            <span className="text-4xl sm:text-5xl font-display font-black text-amber-400">
              {selectedPackage.price}
            </span>

            <span className="text-sm text-gray-400">
              / all-inclusive
            </span>
          </div>

          {/* Description */}
          {selectedPackage.description && (
            <p className="mt-5 text-gray-300 leading-relaxed">
              {selectedPackage.description}
            </p>
          )}

          {/* Check In / Check Out */}
          {selectedPackage.checkIn && selectedPackage.checkOut && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Check-In
                </p>
                <p className="mt-1 font-bold">
                  {selectedPackage.checkIn}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Check-Out
                </p>
                <p className="mt-1 font-bold">
                  {selectedPackage.checkOut}
                </p>
              </div>
            </div>
          )}

          {/* Stay Options */}
          {selectedPackage.stayOptions?.length > 0 && (
            <div className="mt-7">
              <h3 className="text-lg font-heading font-bold uppercase tracking-wider text-[#f5c97a] mb-3">
                Stay Options
              </h3>

              <ul className="space-y-2">
                {selectedPackage.stayOptions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-200">
                    <Check
                      size={18}
                      className="text-cyan-400 shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meals */}
          {selectedPackage.meals?.length > 0 && (
            <div className="mt-7">
              <h3 className="text-lg font-heading font-bold uppercase tracking-wider text-[#f5c97a] mb-3">
                Buffet Meals
              </h3>

              <ul className="space-y-2">
                {selectedPackage.meals.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-200">
                    <Check
                      size={18}
                      className="text-cyan-400 shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* River Activities */}
          {selectedPackage.riverActivities?.length > 0 && (
            <div className="mt-7">
              <h3 className="text-lg font-heading font-bold uppercase tracking-wider text-[#f5c97a] mb-3">
                River Activities
              </h3>

              <ul className="space-y-2">
                {selectedPackage.riverActivities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-200">
                    <Check
                      size={18}
                      className="text-cyan-400 shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resort Fun */}
          {selectedPackage.resortFun?.length > 0 && (
            <div className="mt-7">
              <h3 className="text-lg font-heading font-bold uppercase tracking-wider text-[#f5c97a] mb-3">
                Resort Fun
              </h3>

              <ul className="space-y-2">
                {selectedPackage.resortFun.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-200">
                    <Check
                      size={18}
                      className="text-cyan-400 shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sightseeing */}
          {selectedPackage.sightseeing?.length > 0 && (
            <div className="mt-7">
              <h3 className="text-lg font-heading font-bold uppercase tracking-wider text-[#f5c97a] mb-3">
                Sightseeing
              </h3>

              <ul className="space-y-2">
                {selectedPackage.sightseeing.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-200">
                    <Check
                      size={18}
                      className="text-cyan-400 shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Book */}
          <button
            type="button"
            onClick={() => {
              const packageName = selectedPackage.name;
              setSelectedPackage(null);
              navigate(
                `/booking?package=${encodeURIComponent(packageName)}`
              );
            }}
            className="w-full mt-8 py-4 rounded-full bg-amber-400 hover:bg-yellow-300 text-slate-950 font-heading font-black text-sm uppercase tracking-wider transition-all"
          >
            Book This Package
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </section>
  );
};

export default Packages;
