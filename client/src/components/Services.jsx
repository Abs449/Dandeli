import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/55";
    case "beginner":
      return "bg-sky-50 text-sky-700 border border-sky-200/55";
    case "moderate":
      return "bg-amber-50 text-amber-700 border border-amber-200/55";
    case "hard":
    case "amateur":
      return "bg-rose-50 text-rose-700 border border-rose-200/55";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200/55";
  }
};

const Services = () => {
  const { data: services, loading } = useServices();
  const [activeTab, setActiveTab] = useState("all");
  const [damStatus, setDamStatus] = useState({
    loading: true,
    isOpen: false,
  });
  const [showDesktopBackground, setShowDesktopBackground] = useState(false);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 768px)");
    const updateBackgroundVisibility = () =>
      setShowDesktopBackground(desktopMediaQuery.matches);

    updateBackgroundVisibility();
    desktopMediaQuery.addEventListener("change", updateBackgroundVisibility);

    return () =>
      desktopMediaQuery.removeEventListener("change", updateBackgroundVisibility);
  }, []);

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
      id="services"
      className="relative overflow-hidden bg-[#f5f3ef] py-16 text-gray-900 sm:py-24"
    >
      {showDesktopBackground && (
        <div
          className="pointer-events-none absolute inset-0 hidden bg-cover bg-center transition-transform duration-[20s] hover:scale-105 md:block"
          style={{ backgroundImage: `url(${bckgroundimg})` }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 text-center sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-bold mb-3">
              Explore Adventures
            </span>
            <h2 className="mb-4 text-3xl font-heading font-black text-gray-900 sm:mb-6 sm:text-5xl">
              Our Adventure Services
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 font-body sm:text-lg">
              Pick your thrill level. From extreme white-water navigation to
              calm jungle boat cruises, we cover every adventure in Dandeli.
            </p>
          </motion.div>
        </div>

        {/* Tab Filters (Horizontally scrollable on mobile) */}
        <div className="-mx-4 mb-8 flex gap-3 overflow-x-auto px-4 pb-3 scroll-smooth no-scrollbar md:mx-0 md:mb-12 md:justify-center md:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 font-heading text-sm font-bold transition-colors duration-200 cursor-pointer sm:px-5 sm:py-3 ${
                activeTab === cat.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "bg-white hover:bg-neutral-50 text-gray-600 border border-neutral-200/50"
              }`}
            >
              <cat.Icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-white/70 animate-pulse h-96 border border-neutral-200/40"
              />
            ))}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {filtered?.map((service) => (
              <article
                key={service.id}
                className="card-adventure group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200/50 bg-white text-gray-900 shadow-md transition-shadow duration-300 hover:border-primary/20 hover:shadow-xl"
              >
                {/* Image Container with Zoom */}
                <div className="relative h-52 shrink-0 overflow-hidden bg-neutral-100 sm:h-64">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md text-xs font-heading font-black text-primary border border-neutral-200/20">
                    {service.price?.replace(" per person", "") ||
                      "Inquire Price"}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>

                {/* Content Box */}
                <div className="flex grow flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${getDifficultyColor(service.difficulty)}`}
                      >
                        {service.difficulty || "Easy"}
                      </span>
                      {service.duration && (
                        <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase mr-1">
                          <Clock className="w-3.5 h-3.5 text-river" />
                          {service.duration}
                        </span>
                      )}
                      {service.name.toLowerCase().includes("rafting") &&
                        (damStatus.loading ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200/50 cursor-default animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Checking...
                          </span>
                        ) : damStatus.isOpen ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-55 text-emerald-600 border border-emerald-200/60 cursor-default">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Rafting Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-rose-55 text-rose-600 border border-rose-200/60 cursor-default">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Rafting Unavailable
                          </span>
                        ))}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-black text-gray-900 mb-2 tracking-tight group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 font-body leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Details and Equipment */}
                  <div className="mt-auto">
                    <div className="pt-4 border-t border-neutral-200/50">
                      <Link
                        to={`/booking?package=${encodeURIComponent(service.name)}`}
                        className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary-dark text-white rounded-full px-4 py-3 text-xs font-heading font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md shadow-primary/20 hover:-translate-y-0.5"
                      >
                        Book Now
                      </Link>
                    </div>

                    {service.equipment?.length > 0 && (
                      <div className="border-t border-neutral-200/50 pt-4 mt-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Shield className="w-4 h-4 text-accent" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Safety Kit Included
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {service.equipment.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-neutral-50 border border-neutral-200/40 text-gray-600 px-2 py-1 rounded-lg font-medium"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
        </div>

        {filtered?.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-body">
            No activities available in this category at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
