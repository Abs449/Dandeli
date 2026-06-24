import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { services } from '../data/mockData';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const displayedServices = showAll ? services : services.slice(0, 4);

  return (
    <section id="services" className="py-24 bg-green-100/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-semibold tracking-wide text-sm mb-4 border border-secondary/20">
            EXPERIENCES
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-6">
            Adventure <span className="text-secondary">Activities</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-body">
            Explore our wide range of thrilling activities designed to give you the ultimate adrenaline rush in the heart of nature.
          </p>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {displayedServices.map((service, index) => (
              <motion.div
                layout
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group border border-gray-100 flex flex-col"
                onClick={() => setSelectedService(service)}
              >
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-heading font-bold text-white mb-1">{service.name}</h3>
                    <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {service.difficulty} • {service.duration}
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-white relative z-10 transform -translate-y-2 rounded-t-3xl transition-transform duration-500 flex-grow flex flex-col justify-between">
                  <p className="text-gray-700 text-sm mb-6 font-body leading-relaxed line-clamp-2">{service.shortDescription}</p>
                  <button className="flex items-center text-secondary font-semibold hover:text-green-700 transition-colors group/btn mt-auto">
                    Learn more 
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {services.length > 4 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-8 py-4 bg-white border border-secondary text-secondary rounded-full font-semibold text-lg hover:bg-secondary hover:text-white transition-all duration-300 shadow-md hover:-translate-y-1"
            >
              {showAll ? (
                <>Show Less <ChevronUp className="ml-2 w-5 h-5" /></>
              ) : (
                <>View All Activities <ChevronDown className="ml-2 w-5 h-5" /></>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
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
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-all z-20 shadow-sm"
              >
                <X size={24} className="text-gray-900" />
              </button>
              
              <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
                <h3 className="text-3xl font-heading font-extrabold text-gray-900 mb-4">
                  {selectedService.name}
                </h3>
                <p className="text-gray-700 mb-8 leading-relaxed font-body">
                  {selectedService.fullDescription}
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8 bg-green-50 p-6 rounded-2xl border border-green-100">
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Duration</span>
                    <span className="font-semibold text-gray-900 text-lg">{selectedService.duration}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Difficulty</span>
                    <span className="font-semibold text-secondary text-lg">{selectedService.difficulty}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <span className="block text-sm font-bold text-gray-900 mb-3">Included Equipment</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.equipment.map((item, idx) => (
                      <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium border border-gray-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <a 
                    href="/booking" 
                    className="flex items-center justify-center w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-green-800 transition-colors shadow-md"
                  >
                    Book This Activity
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
