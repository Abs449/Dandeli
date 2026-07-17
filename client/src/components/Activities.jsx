import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useServices } from "../lib/data";

// Activities are a subset of services — those that read as a "day activity"
// rather than a transport or rental service. For the seed data every item
// is an activity, so this component just renders the same `services` table
// but with a different (modal-driven) card style.

const Activities = () => {
  const { data: services, loading } = useServices();
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? services : services?.slice(0, 4);

  return (
    <section id="activities" className="py-24 bg-green-100/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-3">
            Get on the water
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-6">
            Adventure <span className="text-secondary">Activities</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-body">
            Explore our wide range of thrilling activities.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white/60 animate-pulse h-80"
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayed?.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelected(service)}
              className="text-left bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group border border-gray-100 flex flex-col p-4"
            >
              <div className="relative h-56 overflow-hidden rounded-3xl">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/70 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-2xl font-heading font-bold text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {service.difficulty} · {service.duration}
                  </p>
                </div>
              </div>
              <div className="px-2 py-4 grow flex flex-col">
                <p className="text-gray-700 text-sm mb-4 font-body leading-relaxed line-clamp-2">
                  {service.shortDescription}
                </p>
                <span className="mt-auto flex items-center text-secondary font-semibold group-hover:text-primary transition-colors">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          ))}
        </div>

        {services && services.length > 4 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-8 py-4 bg-white border border-secondary text-secondary rounded-full font-semibold text-lg hover:bg-secondary hover:text-white transition-all duration-300 shadow-md hover:-translate-y-1"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="ml-2 w-5 h-5" />
                </>
              ) : (
                <>
                  View All Activities <ChevronDown className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-gray-900/60"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row z-10"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 z-20 shadow-sm"
                aria-label="Close"
              >
                <X size={24} className="text-gray-900" />
              </button>

              <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
                <h3 className="text-3xl font-heading font-extrabold text-gray-900 mb-4">
                  {selected.name}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed font-body">
                  {selected.fullDescription || selected.shortDescription}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-6 bg-green-50 p-6 rounded-2xl border border-green-100">
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Duration
                    </span>
                    <span className="font-semibold text-gray-900 text-lg">
                      {selected.duration}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Difficulty
                    </span>
                    <span className="font-semibold text-secondary text-lg">
                      {selected.difficulty}
                    </span>
                  </div>
                </div>

                {selected.equipment?.length > 0 && (
                  <div className="mb-6">
                    <span className="block text-sm font-bold text-gray-900 mb-3">
                      Included Equipment
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selected.equipment.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium border border-gray-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selected.price && (
                  <div className="mb-4 text-2xl font-heading font-bold text-primary">
                    {selected.price}
                  </div>
                )}

                <a
                  href={`/booking?package=${selected.id}`}
                  className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-center w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-md"
                >
                  Book This Activity
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
