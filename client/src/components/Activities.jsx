import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Clock, Star, Shield } from "lucide-react";
import { useServices } from "../lib/data";

const Activities = () => {
  const { data: services, loading } = useServices();
  const [selected, setSelected] = useState(null);
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

  return (
    <section id="activities" className="py-24 bg-gradient-to-b from-[#eaddca] via-[#f5efe6] to-[#decbb7] relative border-b border-neutral-200/40 text-gray-900">
      
      {/* Decorative floating bubbles */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-river-light/10 rounded-full animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-accent/5 rounded-full animate-float-delayed pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-bold mb-3">
            Choose Your Thrill
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-6">
            Adventure <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Activities</span>
          </h2>
          <p className="text-lg text-gray-655 max-w-2xl mx-auto font-body">
            Get on the water. Choose from our hand-picked rafting rapids, kayaking sessions, and forest stays. Click on any card to see full details!
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-neutral-50 animate-pulse h-[430px] border border-neutral-100"
              />
            ))}
          </div>
        )}

        {/* Professional 3-Column Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services?.map((service, index) => {
            return (
              <motion.button
                key={service.id}
                onClick={() => setSelected(service)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="text-left bg-white p-5 pb-7 rounded-3xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group border border-neutral-200/40 flex flex-col relative h-[400px] sm:h-[440px]"
              >
                {/* Image Showcase */}
                <div className="relative w-full h-[220px] sm:h-[270px] overflow-hidden rounded-2xl bg-neutral-50 mb-5 shrink-0">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  
                  {/* Category tag */}
                  <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-wider bg-white/95 px-3 py-1.5 rounded-full text-primary shadow-sm border border-neutral-200/20">
                    {service.difficulty}
                  </span>
                </div>

                {/* Content */}
                <div className="grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-heading font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight line-clamp-1 mb-1.5">
                      {service.name}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed font-body mb-3">
                      {service.shortDescription}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-neutral-200/60">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-450 font-bold uppercase tracking-wider">
                        {service.duration}
                      </span>
                      {service.name.toLowerCase().includes("rafting") && (
                        damStatus.loading ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/40 cursor-default animate-pulse">
                            Checking...
                          </span>
                        ) : damStatus.isOpen ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-250 cursor-default">
                            Rafting Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-250 cursor-default">
                            Rafting Unavailable
                          </span>
                        )
                      )}
                    </div>
                    <span className="flex items-center text-xs font-black text-accent group-hover:text-primary transition-colors uppercase tracking-wider">
                      Explore Details
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Details Popup Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-4xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row z-10 border border-neutral-100"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2.5 z-20 shadow-md border border-neutral-200/50 cursor-pointer"
                aria-label="Close"
              >
                <X size={20} className="text-gray-900" />
              </button>

              {/* Modal Left Image */}
              <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-neutral-200">
                <img
                  src={selected.image}
                  alt={selected.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Modal Right Details */}
              <div className="w-full md:w-7/12 p-8 sm:p-10 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider">
                      {selected.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase">
                      <Clock className="w-3.5 h-3.5 text-river" />
                      {selected.duration}
                    </span>
                  </div>

                  <h3 className="text-3xl font-heading font-black text-gray-900 mb-4 tracking-tight">
                    {selected.name}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed font-body text-sm sm:text-base text-justify">
                    {selected.fullDescription || selected.shortDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200/40">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Pricing From
                      </span>
                      <span className="font-heading font-black text-primary text-xl">
                        {selected.price || "Contact Us"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Adventure Type
                      </span>
                      <span className="font-heading font-black text-secondary text-xl">
                        Kali River Sport
                      </span>
                    </div>
                  </div>

                  {selected.equipment?.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Shield className="w-4.5 h-4.5 text-accent" />
                        <span className="text-sm font-bold text-gray-900">
                          Included Safety Gear & Kit
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selected.equipment.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3.5 py-1.5 bg-neutral-100/70 border border-neutral-200 text-gray-700 rounded-xl text-xs font-semibold"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <a
                  href={`/booking?package=${selected.id}`}
                  className="mt-6 flex items-center justify-center w-full bg-accent text-white py-4 rounded-full font-black text-base hover:bg-accent/90 transition-colors shadow-lg shadow-accent/15 text-center cursor-pointer"
                >
                  Book Activity Now
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Activities;
