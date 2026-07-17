import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import backgroundImage from "../assets/Backgroundimg/dji_fly_20260103_124946_0149_1774087624546_photo.jpg.jpeg";

// A pure-CSS river wave animation. No JS animation library.
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
  const heroRef = useRef(null);
  const [shouldLoadBackground, setShouldLoadBackground] = useState(false);
  const [damStatus, setDamStatus] = useState({
    loading: true,
    status: "loading",
    message: "Checking live water activity status…",
    supaValue: null,
    unit1: null,
    unit2: null,
    fetchedAt: null,
  });

  useEffect(() => {
    const node = heroRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadBackground(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const loadDamStatus = async () => {
    try {
       const apiUrl = import.meta.env.VITE_API_URL || "";
       const response = await fetch(`${apiUrl}/api/dam-status`);
       const data = await response.json();
 
       if (response.ok && data.success) {
         setDamStatus({
           loading: false,
           status: data.status,
           message: data.message,
           supaValue: data.supaValue,
           unit1: data.unit1,
           unit2: data.unit2,
           fetchedAt: data.fetchedAt,
         });
       } else {
         setDamStatus({
           loading: false,
           status: "error",
           message: data.message || "Unable to fetch live status.",
           supaValue: null,
           unit1: null,
           unit2: null,
           fetchedAt: null,
         });
       }
     } catch (error) {
       console.error("Unable to load dam status", error);
       setDamStatus({
         loading: false,
         status: "error",
         message: "Live status is temporarily unavailable.",
         supaValue: null,
         unit1: null,
         unit2: null,
         fetchedAt: null,
       });
     }
   };

  useEffect(() => {
    loadDamStatus();
  }, []);

  const isOpen = damStatus.status === "open";
  const statusColor = damStatus.loading
    ? "bg-amber-400"
    : isOpen
      ? "bg-emerald-400"
      : damStatus.status === "closed"
        ? "bg-rose-500"
        : "bg-slate-400";

  return (
    <div
      ref={heroRef}
      className="relative min-h-[105vh] flex items-center justify-center overflow-hidden pt-28 pb-20 md:py-0"
    >
      {/* Background image with slow hover-scale */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
        style={{
          backgroundImage: shouldLoadBackground ? `url(${backgroundImage})` : "none",
          backgroundColor: "#052e16",
        }}
      />

      {/* Animated water overlay */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <Wave color="#0284c7" opacity={0.15} duration="14s" offset="18%" />
        <Wave
          color="#38bdf8"
          opacity={0.1}
          duration="20s"
          delay="-6s"
          offset="8%"
        />
      </div>

      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/80 via-black/50 to-black/80" />

      {/* Content Container (Centered layout) */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto text-center text-white">
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-accent text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 hover:border-accent/40 transition-colors cursor-default">
            <Compass className="w-4 h-4 animate-spin-slow text-accent" />
            Kali River · Ganeshgudi · Dandeli
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none text-balance">
            Conquer the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">Rapids</span> of Dandeli
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-body font-light leading-relaxed text-balance">
            Experience the ultimate white-water rafting, forest camping, and raw eco-adventures on the Kali River.
          </p>

          {/* Compact Live Water Status Pill */}
          <div className="mx-auto mb-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white shadow-lg backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusColor}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColor}`} />
            </span>
            <span className="font-semibold">
              {damStatus.loading
                ? "Checking live status…"
                : isOpen
                  ? "Rafting is Active today"
                  : damStatus.status === "closed"
                    ? "Rafting is Suspended (Calm flow)"
                    : "Live status offline"}
            </span>
            {damStatus.supaValue !== null && (
              <span className="text-accent font-bold font-mono text-xs border-l border-white/20 pl-3 flex items-baseline gap-1.5">
                <span>SUPA {damStatus.supaValue} MW</span>
                {damStatus.unit1 !== null && damStatus.unit2 !== null && (
                  <span className="text-[10px] text-gray-300 font-normal">
                    (U1: {damStatus.unit1}MW · U2: {damStatus.unit2}MW)
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/booking"
              className="w-full sm:w-auto px-10 py-4 bg-accent text-white rounded-full font-black text-lg hover:bg-accent/90 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-accent/20 text-center"
            >
              Book Adventure Now
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 text-center"
            >
              Explore Nature
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom wave divider */}
      <div className="wave-divider wave-divider-bottom absolute bottom-0 left-0 z-20" />
    </div>
  );
};

export default Hero;
