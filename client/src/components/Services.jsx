import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import {
  Clock,
  Tag,
  Shield,
  Compass,
  Waves,
  FolderOpen,
  Tent,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";import { useServices } from "../lib/data";
import bckgroundimg from "../assets/Backgroundimg/river-scenery.webp";
import { CONTACT } from "../lib/contact";

const categories = [
  { id: "rafting", label: "White Water Rafting", Icon: Waves },
  { id: "water", label: "Water & Adventure Sports", Icon: Waves },
  { id: "adventure", label: "Adventure Activities", Icon: Tag },
  { id: "wildlife", label: "Wildlife & Nature", Icon: Compass },
  { id: "camping", label: "Camping & Stay", Icon: Tent },
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
  const { data: services, loading } = useServices();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [damStatus, setDamStatus] = useState({
    loading: true,
    isOpen: false,
  });

  const sectionRef = useRef(null);
const mobileTrackRef = useRef(null);
const mobileViewportRef = useRef(null);

const mobileX = useMotionValue(0);

const MOBILE_SWIPE_DISTANCE = 80;
const MOBILE_SCROLL_SPEED = 0.65;

  // Lightweight scroll transform
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.08, 1.02]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 0.95, 0.95, 0.6]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
  mobileX.set(0);
}, [selectedCategory, currentPage]);

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

  const filteredServices = (services || []).filter((item) => {
  if (!selectedCategory) return false;
  return item.category === selectedCategory;
});

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = isDesktop
    ? filteredServices.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    : filteredServices;

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-[#021915] text-white flex flex-col justify-center border-t border-white/10"
    >
      {/* Background Image Layer with Parallax */}
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

          {/* Category Tiles */}
{!selectedCategory && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-10"
  >
    {categories.map(({ id, label, Icon }) => {
      const categoryServices = (services || []).filter(
        (service) => service.category === id
      );

      const count = categoryServices.length;

      return (
        <motion.button
          key={id}
          type="button"
          onClick={() => setSelectedCategory(id)}
          whileHover={{ y: -5, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="group relative min-h-[170px] sm:min-h-[190px] rounded-3xl overflow-hidden border border-white/20 shadow-xl cursor-pointer"
        >

          {/* 2x2 Activity Preview */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {categoryServices.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="relative overflow-hidden"
              >
                <img
                  src={service.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}

            {/* Fill missing preview slots */}
            {Array.from({
              length: Math.max(
                0,
                4 - categoryServices.slice(0, 4).length
              )
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-[#021915]/40"
              />
            ))}
          </div>

          {/* Transparent Glass Overlay */}
          <div className="absolute inset-0 bg-[#021915]/50 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-[#021915]/20" />

          {/* Subtle glass gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-cyan-400/10" />

          {/* Content */}
          <div className="relative z-10 min-h-[170px] sm:min-h-[190px] flex flex-col items-center justify-center text-center p-4 sm:p-6">

            {/* Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#021915]/35 backdrop-blur-md border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:text-amber-300 group-hover:border-amber-400/60 transition-all duration-300 mb-4 shadow-lg">
              <Icon
                size={30}
                strokeWidth={1.7}
              />
            </div>

            {/* Category Name */}
            <h3 className="text-s sm:text-base font-heading font-black uppercase tracking-wide text-white drop-shadow-lg group-hover:text-amber-300 transition-colors duration-200">
              {label}
            </h3>

            {/* Count */}
            <span className="mt-2 text-[10px] sm:text-xs text-white/75 font-body drop-shadow-md">
              {count} {count === 1 ? "Activity" : "Activities"}
            </span>

          </div>

          {/* Glass Border */}
          <div className="absolute inset-0 rounded-3xl border-2 border-white/20 pointer-events-none group-hover:border-cyan-400/50 transition-colors duration-300" />

          {/* Top glass shine */}
          <div className="absolute inset-x-0 top-0 h-px bg-white/40 opacity-60" />

        </motion.button>
      );
    })}
  </motion.div>
)}

        {selectedCategory && loading && (
          <div className="flex md:grid overflow-x-auto md:overflow-x-visible gap-6 sm:gap-8 pb-6 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 no-scrollbar md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-[85vw] max-w-[340px] sm:w-[360px] md:w-auto shrink-0 md:shrink rounded-3xl bg-slate-900/60 animate-pulse h-96 border border-white/10"
              />
            ))}
          </div>
        )}

        {/* Services Container: Horizontal scroll on mobile (< md), Paginated 3x3 Grid on desktop (>= md) */}
        {selectedCategory && (
  <div className="relative">

    <button
      type="button"
      onClick={() => {
        setSelectedCategory(null);
        setCurrentPage(0);
      }}
      className="mb-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-950/80 border border-white/15 text-gray-300 hover:text-white hover:border-amber-400/60 transition-all duration-200 font-heading font-bold text-xs uppercase tracking-wider"
    >
      <ChevronLeft size={16} />
      Back to Activities
    </button>
        <div className="text-center mb-8">
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black uppercase text-white">
        {categories.find(
          (category) => category.id === selectedCategory
        )?.label}
      </h3>
    </div>
    
          {/* Desktop Navigation Arrows */}
          {isDesktop && totalPages > 1 && (
            <>
              {currentPage > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/80 border border-white/20 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-950 transition-all duration-200 shadow-xl cursor-pointer hover:scale-105"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              {currentPage < totalPages - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/80 border border-white/20 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-950 transition-all duration-200 shadow-xl cursor-pointer hover:scale-105"
                  aria-label="Next page"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </>
          )}

          <div
  ref={mobileViewportRef}
  className="overflow-hidden w-full"
>
  <AnimatePresence mode="wait">
    <motion.div
      ref={mobileTrackRef}
      key={currentPage + "_" + selectedCategory}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      drag={isDesktop ? false : "x"}
      dragConstraints={false}
      dragElastic={0.08}
      dragMomentum={false}
      dragDirectionLock
      style={{ x: mobileX }}
      onDragEnd={(event, info) => {
        if (isDesktop) return;

        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (
          Math.abs(offset) < MOBILE_SWIPE_DISTANCE &&
          Math.abs(velocity) < 300
        ) {
          return;
        }

        const cards = Array.from(
          mobileTrackRef.current?.children || []
        );

        if (!cards.length || !mobileViewportRef.current) return;

        const direction =
          offset < 0 || velocity < 0 ? 1 : -1;

        const currentX = mobileX.get();

        const viewportCenter =
          mobileViewportRef.current.clientWidth / 2;

        let currentIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
          const cardCenter =
            card.offsetLeft +
            card.offsetWidth / 2 +
            currentX;

          const distanceFromCenter =
            Math.abs(cardCenter - viewportCenter);

          if (distanceFromCenter < closestDistance) {
            closestDistance = distanceFromCenter;
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

        const targetCard = cards[nextIndex];

        const targetX =
          viewportCenter -
          (targetCard.offsetLeft +
            targetCard.offsetWidth / 2);

        animate(mobileX, targetX, {
          type: "tween",
          duration: 0.45 / MOBILE_SCROLL_SPEED,
          ease: [0.22, 1, 0.36, 1],
        });
      }}
      className="flex md:grid md:grid-cols-2 lg:grid-cols-3 md:transform-none gap-6 sm:gap-8 pb-6 md:pb-0"
    >
                {paginatedServices.map((service, index) => {
                  const isRafting = service.name.toLowerCase().includes("rafting");

                  return (
                    <motion.article
                      key={service.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                      className="w-[70vw] max-w-[340px] sm:w-[360px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none bg-slate-900/90 border border-white/15 hover:border-cyan-400/40 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer"
                      onClick={() => {
                        const message = `Hey Karthik , I want to know further details about ${service.name}`;
                        const whatsappUrl = `https://wa.me/91${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <div>
                        {/* Card Media Header */}
                        <div className="h-52 overflow-hidden relative">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                          {/* Dam Availability Badge */}
                          {isRafting && !damStatus.loading && (
                            <div className="absolute top-4 left-4 z-10">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-black uppercase tracking-wider shadow-md backdrop-blur-md ${damStatus.isOpen
                                  ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/40"
                                  : "bg-amber-950/90 text-amber-300 border border-amber-500/40"
                                  }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${damStatus.isOpen ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                                    }`}
                                />
                                {damStatus.isOpen ? "Rafting Active" : "Calm Water"}
                              </span>
                            </div>
                          )}

                          {/* Difficulty Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-heading font-black uppercase tracking-wider shadow-md backdrop-blur-md ${getDifficultyColor(
                                service.difficulty,
                              )}`}
                            >
                              <Shield size={10} />
                              {service.difficulty}
                            </span>
                          </div>

                          <div className="absolute bottom-4 left-6 right-6 z-10">
                            <h3 className="text-xl sm:text-2xl font-heading font-black text-white leading-tight tracking-tight">
                              {service.name}
                            </h3>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-6 sm:p-7 space-y-4">
                          <p className="text-gray-300 font-body text-sm sm:text-base leading-relaxed line-clamp-3">
                            {service.shortDescription || service.fullDescription}
                          </p>

                          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-body text-gray-300">
                            <div className="flex items-center gap-1.5 text-cyan-300">
                              <Clock size={14} />
                              <span>{service.duration}</span>
                            </div>
                            <span className="text-2xl font-heading font-black text-amber-400">
                              {service.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Button */}
                      <div className="p-6 sm:p-7 pt-0">
                        <div
                          className="block w-full text-center py-3.5 bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all duration-300 border border-white/20 hover:border-amber-400 shadow-md cursor-pointer"
                        >
                          Inquire Activity
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
              {/* Mobile Swipe Hint */}
        <div className="flex md:hidden items-center justify-center gap-2 text-cyan-400/70 text-xs font-heading font-semibold mt-4">
          <span className="animate-pulse">← Swipe horizontally to view all activities →</span>
        </div>
            </AnimatePresence>
          </div>

          {/* Desktop Page Indicators */}
          {isDesktop && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-350 cursor-pointer ${
                    currentPage === i ? "bg-cyan-450 w-6" : "bg-white/20 hover:bg-white/45"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
                )}

        
      </div>
    </section>
  );
};

export default Services;
