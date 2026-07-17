import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useServices } from "../lib/data";

const getDifficultyColor = (difficulty) => {
  switch ((difficulty || "").toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "beginner":
      return "bg-blue-100 text-blue-800";
    case "moderate":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
    case "amateur":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Services = () => {
  const { data: services, loading } = useServices();
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? services : services?.slice(0, 4);

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-20 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-river/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-3">
              What we offer
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-6">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-body">
              Explore a variety of thrilling adventure activities and
              experiences in Dandeli.
            </p>
          </motion.div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-gray-100 animate-pulse h-96"
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {displayed?.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30"
              >
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 -gradientbg-to-t from-black/50 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 font-body line-clamp-2">
                    {service.shortDescription}
                  </p>

                  <div className="space-y-3 mb-4">
                    {service.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                    {service.difficulty && (
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(
                            service.difficulty,
                          )}`}
                        >
                          {service.difficulty}
                        </span>
                      </div>
                    )}
                  </div>

                  {service.equipment?.length > 0 && (
                    <div className="mb-4 pb-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Equipment
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.equipment.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {service.price && (
                    <div className="text-lg font-heading font-bold text-primary">
                      {service.price}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
                  View All Services <ChevronDown className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
