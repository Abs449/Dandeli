import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { packages } from '../data/mockData';
import { Link } from 'react-router-dom';

const Packages = () => {
  return (
    <section id="packages" className="py-24 bg-green-50/50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-semibold tracking-wide text-sm mb-4 border border-secondary/20">
            PRICING
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-6">
            Curated <span className="text-secondary">Packages</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-body">
            Choose from our carefully designed packages for the best value and an unforgettable experience in Dandeli.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative rounded-[2rem] p-10 sm:p-12 transition-all duration-500 ${
                pkg.recommended 
                  ? 'bg-gray-900 text-white transform md:-translate-y-6 shadow-2xl border border-gray-700' 
                  : 'bg-white border border-gray-100 text-gray-900 shadow-xl hover:shadow-2xl hover:-translate-y-2'
              }`}
            >
              {pkg.recommended && (
                <>
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-secondary text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg border border-white/10">
                      Most Popular
                    </span>
                  </div>
                </>
              )}
              
              <div className="text-center mb-8 pt-4">
                <h3 className={`text-2xl font-heading font-extrabold mb-4 ${pkg.recommended ? 'text-white' : 'text-gray-900'}`}>
                  {pkg.name}
                </h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className={`text-5xl font-extrabold tracking-tight ${pkg.recommended ? 'text-white' : 'text-secondary'}`}>
                    {pkg.price}
                  </span>
                  <span className={`ml-2 text-sm font-medium ${pkg.recommended ? 'text-gray-400' : 'text-gray-500'}`}>
                    / person
                  </span>
                </div>
                <div className={`inline-block mt-4 px-4 py-1.5 rounded-full text-sm font-medium ${pkg.recommended ? 'bg-white/10 text-gray-200' : 'bg-green-50 text-secondary'}`}>
                  {pkg.duration}
                </div>
              </div>

              <div className="space-y-5 mb-10">
                {pkg.activities.map((activity, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className={`w-5 h-5 mr-4 flex-shrink-0 mt-0.5 ${pkg.recommended ? 'text-secondary' : 'text-secondary'}`} />
                    <span className={`font-body leading-relaxed ${pkg.recommended ? 'text-gray-300' : 'text-gray-600'}`}>
                      {activity}
                    </span>
                  </div>
                ))}
              </div>

              <Link 
                to="/booking"
                className={`block w-full text-center py-4 rounded-xl font-bold transition-all duration-300 ${
                  pkg.recommended
                    ? 'bg-accent hover:bg-orange-600 text-white shadow-md'
                    : 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white shadow-sm hover:shadow-md'
                }`}
              >
                Book {pkg.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
