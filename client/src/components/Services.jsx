import { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Clock,
  Shield,
  Target,
  Waves,
  Sailboat,
  Zap,
  PawPrint,
  Tent,
} from "lucide-react";
import { useServices } from "../lib/data";
import bckgroundimg from "../assets/Backgroundimg/aboutus-bg.webp";
import { CONTACT } from "../lib/contact";

// "all" is a pseudo-category — not a real value on any service — that shows
// every activity at once. It's first in the list and selected by default,
// matching the reference design (category bar always visible, no separate
// "pick a category first" step).
const categories = [
  { id: "all", label: "All Activities", Icon: Target },
  { id: "rafting", label: "Rafting", Icon: Waves },
  { id: "water", label: "Water Sports", Icon: Sailboat },
  { id: "adventure", label: "Adventure", Icon: Zap },
  { id: "wildlife", label: "Wildlife", Icon: PawPrint },
  { id: "camping", label: "Camping", Icon: Tent },
];

const getDifficultyColor = (difficulty) => {
  switch ((difficulty || "").toLowerCase()) {
    case "easy":
      return "bg-emerald-950/90 text-emerald-300 border border-emerald-500/40";
    case "beginner":
      return "bg-cyan-950/90 text-cyan-300 border border-cyan-500/40";
    case "moderate":
      return "bg-amber-950/90 text-amber-300 border border-amber-500/40";
    case "hard":
    case "amateur":
      return "bg-rose-950/90 text-rose-300 border border-rose-500/40";
    default:
      return "bg-slate-900 text-slate-300 border border-slate-700";
  }
};

const Services = () => {


  const CARD_WIDTH = 400;
  const CARD_GAP = 30;

  const { data: services, loading } = useServices();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [damStatus, setDamStatus] = useState({
    loading: true,
    isOpen: false,
  });
  const [canScroll, setCanScroll] = useState(false);

  const sectionRef = useRef(null);
  const servicesScrollRef = useRef(null);

  useEffect(() => {
    if (servicesScrollRef.current) {
      servicesScrollRef.current.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }
  }, [selectedCategory]);

  // Lightweight scroll transform
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = 1;
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 0.95, 0.95, 0.6]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const apiUrl = import.meta.env.VITE_API_URL || "";
    fetch(`${apiUrl}/api/dam-status`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        clearTimeout(timeoutId);
        if (active && data.success) {
          setDamStatus({
            loading: false,
            isOpen: data.status === "open",
          });
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        if (active) setDamStatus({ loading: false, isOpen: false });
      });
    return () => {
      active = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (selectedCategory === "all") return services;
    return services.filter((item) => item.category === selectedCategory);
  }, [services, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts = { all: services?.length || 0 };
    categories.forEach(({ id }) => {
      if (id === "all") return;
      counts[id] = (services || []).filter((s) => s.category === id).length;
    });
    return counts;
  }, [services]);

  // Row-major fill: row 1 fills left-to-right first, and only once row 1
  // has `columnsCount` cards does the next item drop to row 2. CSS Grid's
  // default `grid-auto-flow: row` fills row-major, but it only wraps to a
  // new row once it runs out of *explicit* columns — so the column count
  // has to be computed from the data (enough columns to hold half the
  // items, rounding up) rather than left to `grid-flow-col`, which instead
  // fills straight down each column first.
  //
  // Examples matching the intended split: 5 items -> 3 cols (3 + 2),
  // 4 items -> 2 cols (2 + 2), 3 items -> 2 cols (2 + 1).
  const columnsCount = Math.max(1, Math.ceil(filteredServices.length / 2));

  // Arrow buttons only render at md+ (sm:gap-6 = 24px), so the scroll step
  // is exactly one card width plus that gap — this keeps every click
  // landing flush on a card edge instead of stopping mid-card, which is
  // what made the native smooth-scroll feel jerky.
  const CARD_SCROLL_STEP = CARD_WIDTH + CARD_GAP;
  // Detect whether the scroll track actually overflows its container.
  // When it doesn't (e.g. a category with only 3-4 cards, now centered via
  // `safe center`), the arrows would be visible but do nothing — so we
  // hide them in that case. Re-checked whenever the category (and thus
  // the card count) changes, or the viewport is resized.
  useEffect(() => {
    const checkOverflow = () => {
      const el = servicesScrollRef.current;
      if (el) setCanScroll(el.scrollWidth > el.clientWidth + 1);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [selectedCategory, filteredServices]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-16 sm:py-20 md:py-24 relative overflow-x-clip bg-[#021915] text-white flex flex-col justify-center border-t border-white/10"
    >{/* Background Image Layer with Parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bckgroundimg})`,
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
          <span className="inline-block text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 bg-cyan-950/60 px-5 py-1.5 rounded-full border border-cyan-500/30 shadow-md">
            Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white mb-3 drop-shadow-md tracking-wider leading-snug">
            Our Adventure <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-200 pr-1">Activities</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-body font-light leading-relaxed">
            From Class III white-water rapids to soothing natural river jacuzzis, explore all Kali River adventures.
          </p>
        </motion.div>

        {/* ── CATEGORY BAR ──────────────────────────────────────────────
            A single always-visible row of filter pills, "All Activities"
            selected by default. On mobile it scrolls horizontally
            (overflow-x-auto + no-scrollbar + snap); on desktop (md:) it
            switches to a wrapping flex row since there's enough width to
            show every pill at once. */}
        <div
          className="flex md:flex-wrap md:justify-center overflow-x-auto md:overflow-visible no-scrollbar gap-3 sm:gap-4 snap-x snap-mandatory md:snap-none"
        >
          {categories.map(({ id, label, Icon }) => {
            const isActive = selectedCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`shrink-0 snap-start flex flex-col items-center justify-center gap-2 rounded-2xl border px-5 py-4 min-w-[92px] sm:min-w-[104px] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-cyan-950/70 border-cyan-400/70 shadow-lg shadow-cyan-500/10"
                    : "bg-slate-950/50 border-white/15 hover:border-cyan-400/40 hover:bg-slate-900/60"
                }`}
              >
                <span
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                    isActive
                      ? "bg-cyan-400/20 text-cyan-300"
                      : "bg-white/5 text-gray-300"
                  }`}
                >
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <span
                  className={`text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wide text-center leading-tight ${
                    isActive ? "text-white" : "text-gray-300"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile-only scroll hint for the category bar */}
        <div className="flex md:hidden items-center justify-center gap-2 text-white/40 text-xs font-heading font-medium mt-3 mb-2">
          <div className="flex md:hidden items-center justify-center gap-2 text-cyan-400/70 text-xs font-heading font-semibold mt-4">
            <span className="animate-pulse">← Swipe horizontally to view all activities →</span>
          </div>
        </div>
        <div className="hidden md:block md:mb-2" />

        {/* ── SERVICES GRID ─────────────────────────────────────────────
            A fixed 2-ROW grid that scrolls HORIZONTALLY. Row 1 fills
            left-to-right first (row-major, the grid default), and only
            once row 1 has `columnsCount` cards does the next item drop
            to row 2 — `columnsCount` is computed above as enough columns
            to hold half the filtered list, rounded up. Every card has
            a fixed height (`h-[420px] sm:h-[460px]`) so both rows stay
            evenly aligned regardless of description length or badges.

            `canScroll` (computed below) drives whether the track is
            centered on desktop: when the cards DON'T overflow the
            container (e.g. Rafting's 3 cards, Camping's 4), we add
            `md:flex md:justify-center` so it centers under the category
            bar instead of sitting flush-left with empty space on the
            right — a premium, intentional look. When the cards DO
            overflow (e.g. Water Sports' 6), we skip centering entirely
            and keep the default left-aligned scrollable behavior, so
            the first card is never clipped or centered off-screen.
            (We center manually via `canScroll` rather than the CSS
            `safe` keyword — `justify-content: safe center` isn't
            reliably supported across browsers, and silently falling
            back to no centering at all was the original bug here.)

            The arrow buttons sit OUTSIDE the card container's edge
            (in the section's own left/right padding gutter, via
            negative left/right offsets) rather than overlapping the
            first/last card, so they read as symmetric, standalone
            controls instead of floating unevenly over the content. */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-slate-900/60 animate-pulse h-80 border border-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="-mx-4 sm:-mx-6 md:mx-0 mt-8 relative">
            {canScroll && (
  <button
    type="button"
    onClick={() => {
      servicesScrollRef.current?.scrollBy({
        left: -CARD_SCROLL_STEP,
        behavior: "smooth",
      });
    }}
    className="hidden md:flex absolute md:-left-[28px] lg:-left-[44px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 items-center justify-center rounded-full bg-[#021915]/95 border border-amber-400/70 text-amber-400 shadow-lg text-lg lg:text-xl hover:bg-amber-400 hover:text-slate-950 transition-all"
    aria-label="Previous activities"
  >
    ←
  </button>
)}

{canScroll && (
  <button
    type="button"
    onClick={() => {
      servicesScrollRef.current?.scrollBy({
        left: CARD_SCROLL_STEP,
        behavior: "smooth",
      });
    }}
    className="hidden md:flex absolute md:-right-[28px] lg:-right-[44px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 items-center justify-center rounded-full bg-[#021915]/95 border border-amber-400/70 text-amber-400 shadow-lg text-lg lg:text-xl hover:bg-amber-400 hover:text-slate-950 transition-all"
    aria-label="Next activities"
  >
    →
  </button>
)}

            <div
              ref={servicesScrollRef}
              className={`overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth snap-x snap-mandatory ${
                canScroll ? "" : "md:flex md:justify-center"
              }`}
            >
              <div
                className="
                  grid
                  grid-rows-2
                  auto-rows-[420px] sm:auto-rows-[460px]
                  w-max
                  items-start
                "
                style={{
                  gridTemplateColumns: `repeat(${columnsCount}, ${CARD_WIDTH}px)`,
                  gap: `${CARD_GAP}px`,
                }}
              >
                {filteredServices.map((service, index) => {
                  const isRafting = service.name
                    .toLowerCase()
                    .includes("rafting");

                  return (
                    <article
                      key={service.id}
                      style={{ width: `${CARD_WIDTH}px` }}
                      className="h-[420px] sm:h-[460px] snap-center bg-slate-900/90 border border-white/15 hover:border-cyan-400/40 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer"
                      onClick={() => {
                        const message = `Hey Karthik , I want to know further details about ${service.name}`;
                        const whatsappUrl = `https://wa.me/91${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

                        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <div>
                        <div className="h-40 sm:h-48 overflow-hidden relative">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                          <div className="absolute top-3 left-3 z-10">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-heading font-black uppercase tracking-wider shadow-md backdrop-blur-md ${getDifficultyColor(service.difficulty)}`}
                            >
                              <Shield size={9} />
                              {service.difficulty}
                            </span>
                          </div>

                          {isRafting && !damStatus.loading && (
                            <div className="absolute top-3 right-3 z-10">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-heading font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                                  damStatus.isOpen
                                    ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/40"
                                    : "bg-amber-950/90 text-amber-300 border border-amber-500/40"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    damStatus.isOpen ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                                  }`}
                                />
                                {damStatus.isOpen ? "Active" : "Calm"}
                              </span>
                            </div>
                          )}

                          <div className="absolute bottom-3 left-4 right-4 z-10">
                            <h3 className="text-base sm:text-xl font-heading font-black text-white leading-tight tracking-tight">
                              {service.name}
                            </h3>
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                          <p className="text-gray-300 font-body text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                            {service.shortDescription || service.fullDescription}
                          </p>

                          <div className="flex items-center justify-between border-t border-white/10 pt-3 sm:pt-4 text-xs font-body text-gray-300">
                            <div className="flex items-center gap-1.5 text-cyan-300">
                              <Clock size={13} />
                              <span>{service.duration}</span>
                            </div>

                            <span className="text-lg sm:text-2xl font-heading font-black text-amber-400">
                              {service.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 pt-0">
                        <div className="block w-full text-center py-2.5 sm:py-3.5 bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full font-heading font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 border border-white/20 hover:border-amber-400 shadow-md cursor-pointer">
                          Inquire Activity
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {!loading && filteredServices.length === 0 && (
          <p className="text-center text-gray-400 mt-10 font-body">
            No activities found in this category yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default Services;