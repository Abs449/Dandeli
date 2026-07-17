import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/Backgroundimg/kayakinwater.jpg.jpeg";
// A pure-CSS river wave animation. No JS animation library, no Lottie JSON
// payload, no 750 kB chunk — just two layered SVG waves drifting on a
// CSS keyframe. The result is a subtle, looping water motif behind the
// hero text that costs ~2 kB and starts immediately on paint.

const Wave = ({ color, opacity, duration, delay = "0s", offset = 0 }) => (
  <svg
    className="absolute inset-x-0 w-[200%] h-full pointer-events-none"
    style={{
      opacity,
      bottom: offset,
      animation: `wave-drift ${duration} linear infinite`,
      animationDelay: delay,
    }}
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      fill={color}
      d="M0,160 C240,260 480,60 720,140 C960,220 1200,80 1440,180 L1440,320 L0,320 Z"
    />
  </svg>
);

const Hero = () => {
  return (
    <div className="relative h-[90vh] min-h-140 flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* Animated water overlay (pure CSS, ~2 kB) */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <Wave color="#1e6b8c" opacity={0.18} duration="14s" offset="20%" />
        <Wave
          color="#5fa3c4"
          opacity={0.14}
          duration="20s"
          delay="-6s"
          offset="10%"
        />
      </div>

      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-gray-900/70 via-gray-900/50 to-gray-900/80" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block text-accent uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-4"
          >
            Kali River · Dandeli · Karnataka
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 tracking-tight"
          >
            Welcome to{" "}
            <span className="text-accent">Dandeli Kali River Rafting</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto font-body font-light leading-relaxed"
          >
            White-water rapids, forest camping, and unforgettable adventures —
            just minutes from Ganeshgudi Temple on the Kali River.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link
              to="/booking"
              className="w-full sm:w-auto px-10 py-4 bg-accent text-white rounded-full font-semibold text-lg hover:bg-accent/90 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              Book Now
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto px-10 py-4 bg-white/15 text-white border border-white/40 rounded-full font-semibold text-lg hover:bg-white/25 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
            >
              Explore Nature
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave divider */}
      <div className="wave-divider wave-divider-bottom absolute bottom-0 left-0 z-20" />
    </div>
  );
};

export default Hero;
