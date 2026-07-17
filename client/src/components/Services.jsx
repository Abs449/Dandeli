import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Tag, Shield, Compass, Waves } from "lucide-react";
import { useServices } from "../lib/data";

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
      return (name.includes("kayak") || name.includes("swim") || name.includes("boat")) && !name.includes("raft");
    }
    if (activeTab === "fun") return name.includes("zipline") || name.includes("zorb");
    return true;
  };

  const filtered = services?.filter(filterService);

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-[#e0f2fe] via-[#f5efe6] to-[#eaddca] relative overflow-hidden border-b border-neutral-200/40 text-gray-900">
      {/* Decorative blurry backgrounds */}
      <div className="absolute top-20 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-river/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-bold mb-3">
              Explore Adventures
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-6">
              Our Adventure Services
            </h2>
            <p className="text-lg text-gray-655 max-w-2xl mx-auto font-body">
              Pick your thrill level. From extreme white-water navigation to calm jungle boat cruises, we cover every adventure in Dandeli.
            </p>
          </motion.div>
        </div>

        {/* Tab Filters (Horizontally scrollable on mobile) */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 mb-12 pb-3 justify-start md:justify-center -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-heading text-sm font-bold transition-all duration-300 cursor-pointer shrink-0 ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-white/70 animate-pulse h-96 border border-neutral-200/40"
              />
            ))}
          </div>
        )}

        {/* Services Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered?.map((service, index) => (
              <motion.div
                layout
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-neutral-200/50 hover:border-primary/20 flex flex-col h-full card-adventure text-gray-900"
              >
                {/* Image Container with Zoom */}
                <div className="relative h-64 overflow-hidden bg-neutral-100 shrink-0">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md text-xs font-heading font-black text-primary border border-neutral-200/20">
                    {service.price?.replace(" per person", "") || "Inquire Price"}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>

                {/* Content Box */}
                <div className="p-6 flex flex-col grow justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${getDifficultyColor(service.difficulty)}`}>
                        {service.difficulty || "Easy"}
                      </span>
                      {service.duration && (
                        <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase mr-1">
                          <Clock className="w-3.5 h-3.5 text-river" />
                          {service.duration}
                        </span>
                      )}
                      {service.name.toLowerCase().includes("rafting") && (
                        damStatus.loading ? (
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
                        )
                      )}
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
                    {service.equipment?.length > 0 && (
                      <div className="border-t border-neutral-200/50 pt-4">
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
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
