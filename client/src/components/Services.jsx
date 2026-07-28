import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Clock, Tag, Shield, Compass, Waves } from "lucide-react";
import { useServices } from "../lib/data";
import bckgroundimg from "../assets/Backgroundimg/IMG20250524115322.jpg.jpeg";

const categories = [
  { id: "all", label: "All Activities", Icon: Compass },
  { id: "rafting", label: "River Rafting", Icon: Waves },
  { id: "water", label: "Water Sports", Icon: Waves },
  { id: "fun", label: "Sky & Fun", Icon: Tag },
];

const getDifficultyColor = (difficulty) => {
  switch ((difficulty || "").toLowerCase()) {
    case "easy":
      return "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30";
    case "beginner":
      return "bg-sky-950/80 text-sky-300 border border-sky-500/30";
    case "moderate":
      return "bg-amber-950/80 text-amber-300 border border-amber-500/30";
    case "hard":
    case "amateur":
      return "bg-rose-950/80 text-rose-300 border border-rose-500/30";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
  }
};

const Services = () => {
  const { data: services, loading } = useServices();
  const [activeTab, setActiveTab] = useState("all");
  const [damStatus, setDamStatus] = useState({
    loading: true,
    isOpen: false,
  });

  const sectionRef = useRef(null);

  // Scroll-linked background zoom effect with spring physics smoothing
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.15, 1.05]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.45, 0.85, 0.85, 0.45]);

  const bgScale = useSpring(rawScale, { stiffness: 90, damping: 30, restDelta: 0.0001 });
  const bgOpacity = useSpring(rawOpacity, { stiffness: 90, damping: 30, restDelta: 0.0001 });

  useEffect(() => {
    let active = true;
    const apiUrl = import.meta.env.VITE_API_URL || "";
    fetch(`${apiUrl}/api/dam-status`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success) {
          setDamStatus({
            loading: false,
            isOpen: data.status === "open",
          });
        }
      })
      .catch(() => {
        if (active) {
          setDamStatus({ loading: false, isOpen: false });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const filterService = (service) => {
    const name = service.name.toLowerCase();
    if (activeTab === "all") return true;
    if (activeTab === "rafting") return name.includes("raft");
    if (activeTab === "water") {
      return (
        (name.includes("kayak") ||
          name.includes("swim") ||
          name.includes("boat")) &&
        !name.includes("raft")
      );
    }
    if (activeTab === "fun")
      return name.includes("zipline") || name.includes("zorb");
    return true;
  };

  const filtered = services?.filter(filterService);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20"
    >
      {/* Scroll-Driven Background Image Layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bckgroundimg})`,
          scale: bgScale,
          opacity: bgOpacity,
        }}
      />
      
      {/* Dark Ambient Overlay for Image Clarity */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/45 to-slate-950/80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 text-center sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-accent uppercase tracking-[0.3em] text-xs font-bold mb-2.5">
              Explore Adventures
            </span>
            <h2 className="mb-3 text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white sm:mb-4 tracking-tight">
              Our Adventure Services
            </h2>
            <p className="mx-auto max-w-xl text-sm text-gray-300 font-body sm:text-base">
              Pick your thrill level. From extreme white-water navigation to
              calm jungle boat cruises, we cover every adventure in Dandeli.
            </p>
          </motion.div>
        </div>

        {/* Tab Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="-mx-4 mb-8 flex gap-2.5 overflow-x-auto px-4 pb-3 scroll-smooth no-scrollbar md:mx-0 md:mb-10 md:justify-center md:px-0"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(cat.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 font-heading text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === cat.id
                  ? "bg-accent text-white shadow-lg shadow-accent/30 scale-105"
                  : "bg-slate-900/80 backdrop-blur-md text-gray-300 border border-white/15 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <cat.Icon className="w-3.5 h-3.5" />
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-slate-900/60 animate-pulse h-80 border border-white/10"
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {filtered?.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card-adventure group flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-900/80 backdrop-blur-xl text-white shadow-xl hover:shadow-2xl hover:border-accent/40 transition-all duration-300"
            >
              {/* Image Container with Zoom & Slide */}
              <div className="relative h-48 shrink-0 overflow-hidden bg-slate-950 sm:h-52">
                <img
                  src={service.image}
                  alt={service.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute top-3.5 right-3.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-1 rounded-full shadow-lg text-[11px] font-heading font-black text-accent border border-white/20">
                  {service.price?.replace(" per person", "") ||
                    "Inquire Price"}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>

              {/* Content Box */}
              <div className="flex grow flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getDifficultyColor(service.difficulty)}`}
                    >
                      {service.difficulty || "Easy"}
                    </span>
                    {service.duration && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase mr-1">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        {service.duration}
                      </span>
                    )}
                    {service.name.toLowerCase().includes("rafting") &&
                      (damStatus.loading ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/30 cursor-default animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Checking...
                        </span>
                      ) : damStatus.isOpen ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 cursor-default">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Rafting Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/30 cursor-default">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Rafting Unavailable
                        </span>
                      ))}
                  </div>

                  <h3 className="text-lg sm:text-xl font-heading font-black text-white mb-2 tracking-tight group-hover:text-accent transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-5 font-body leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Details and Equipment */}
                <div className="mt-auto">
                  <div className="pt-3.5 border-t border-white/10">
                    <Link
                      to={`/booking?package=${encodeURIComponent(service.name)}`}
                      className="inline-flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-white rounded-full px-4 py-3 text-xs font-heading font-black uppercase tracking-[0.18em] transition-all duration-300 shadow-lg shadow-accent/25 hover:-translate-y-0.5 active:scale-98"
                    >
                      Book Now
                    </Link>
                  </div>

                  {service.equipment?.length > 0 && (
                    <div className="border-t border-white/10 pt-3 mt-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Shield className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Safety Kit Included
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {service.equipment.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-lg font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered?.length === 0 && (
          <div className="text-center py-14 text-gray-400 font-body text-sm">
            No activities available in this category at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
