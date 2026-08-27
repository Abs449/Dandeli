import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Clock, Tag, Shield, Compass, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { useServices } from "../lib/data";
import bckgroundimg from "../assets/Backgroundimg/river-scenery.webp";
import { CONTACT } from "../lib/contact";

const categories = [
  { id: "all", label: "All Activities", Icon: Compass },
  { id: "rafting", label: "White Water Rafting", Icon: Waves },
  { id: "water", label: "Water & Adventure Sports", Icon: Waves },
  { id: "adventure", label: "Adventure Activities", Icon: Tag },
  { id: "wildlife", label: "Wildlife & Nature", Icon: Compass },
  { id: "camping", label: "Camping & Stay", Icon: Clock },
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
  const [activeTab, setActiveTab] = useState("all");
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [damStatus, setDamStatus] = useState({
    loading: true,
    isOpen: false,
  });

  const sectionRef = useRef(null);

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
    setCurrentPage(0);
  }, [activeTab]);

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
    if (activeTab === "all") return true;
    return item.category === activeTab;
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

          {/* Reference Category Filter Buttons */}
          <div className="flex overflow-x-auto no-scrollbar md:flex-wrap justify-start md:justify-center gap-2.5 sm:gap-3 mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
            {categories.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${isActive
                    ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 scale-105"
                    : "bg-slate-950/80 border border-white/15 text-gray-300 hover:border-cyan-400/40 hover:text-white"
                    }`}
                >
                  <Icon size={14} className={isActive ? "text-slate-950" : "text-cyan-400"} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {loading && (
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
        <div className="relative">
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

          <div className="overflow-hidden w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + "_" + activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x md:snap-none snap-mandatory grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pb-6 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 no-scrollbar"
              >
                {paginatedServices.map((service, index) => {
                  const isRafting = service.name.toLowerCase().includes("rafting");

                  return (
                    <motion.article
                      key={service.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                      className="w-[85vw] max-w-[340px] sm:w-[360px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none bg-slate-900/90 border border-white/15 hover:border-cyan-400/40 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer"
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

        {/* Mobile Swipe Hint */}
        <div className="flex md:hidden items-center justify-center gap-2 text-cyan-400/70 text-xs font-heading font-semibold mt-4">
          <span className="animate-pulse">← Swipe horizontally to view all activities →</span>
        </div>
      </div>
    </section>
  );
};

export default Services;
