import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative h-[90vh] flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background Image - Nature across Dandeli */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=2000')" 
        }}
      />
      
      {/* Solid Dark Overlay for Readability */}
      <div className="absolute inset-0 z-0 bg-gray-900/50" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="p-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 tracking-tight"
          >
            Discover the Wild Heart of <span className="text-accent">Dandeli</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto font-body font-light leading-relaxed"
          >
            Immerse yourself in premium adventure tourism. From thrilling river escapes to peaceful canopy stays, your perfect getaway awaits in the deep green.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              to="/booking" 
              className="w-full sm:w-auto px-10 py-4 bg-accent text-white rounded-full font-semibold text-lg hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1"
            >
              Book Now
            </Link>
            <a 
              href="#about" 
              className="w-full sm:w-auto px-10 py-4 bg-white/20 text-white border border-white/40 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 hover:-translate-y-1"
            >
              Explore Nature
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
