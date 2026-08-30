import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { BookOpen, X, Sparkles, Heart } from "lucide-react";
import photo from "../assets/Backgroundimg/guide-photo.webp";
import imgJungle from "../assets/Backgroundimg/river-scenery.webp";

// Smooth Eased Number Counter Component
const SmoothCountUp = ({ end, duration = 2.0, decimals = 0, suffix = "" }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime;
    let frameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easedProgress * end);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, end, duration]);

  return (
    <span ref={nodeRef} className="inline-flex items-baseline font-heading font-black text-white whitespace-nowrap">
      <span>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}</span>
      {suffix && <span className="text-amber-400 font-black ml-1">{suffix}</span>}
    </span>
  );
};

const stats = [
  { numericEnd: 5000, suffix: "+", decimals: 0, label: "Happy Travelers" },
  { numericEnd: 8, suffix: "+", decimals: 0, label: "Years of Experience" },
  { numericEnd: 4.9, suffix: "★", decimals: 1, label: "Rated on Google" },
  { numericEnd: 100, suffix: "%", decimals: 0, label: "Transparent Pricing" },
];

const About = () => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const sectionRef = useRef(null);
  useEffect(() => {
  if (!isStoryModalOpen) return;

  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = originalOverflow;
  };
}, [isStoryModalOpen]);

  // Lightweight hardware-accelerated scroll transform (no spring loop overhead)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = 1;
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 0.85, 0.85, 0.5]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-14 sm:py-18 md:py-20 relative overflow-hidden flex flex-col items-center bg-[#021915] text-white border-t border-white/10"
    >
      {/* Background Image Layer with Scroll-Driven Zoom Animation */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imgJungle})`,
          scale: bgScale,
          opacity: bgOpacity,
        }}
      />

      {/* Dark Gradient Overlay for Clarity */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021915]/60 via-[#021915]/25 to-[#021915]/65 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="w-full text-center mb-8 sm:mb-10"
        >
          <span className="inline-block text-cyan-400 uppercase tracking-widest text-xs font-bold mb-2.5 bg-cyan-950/60 border border-cyan-500/30 px-4 py-1 rounded-full">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white tracking-wider leading-snug">
            Your Gateway to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-200 pr-1">Untamed Nature</span>
          </h2>
        </motion.div>

        {/* 1. Guide Cutout Image & Quote Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 mb-10">
          {/* Cutout Image */}
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 flex items-center justify-center sm:justify-start relative -ml-13 sm:ml-[23vw] lg:ml-2"
          >
            <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] flex justify-center sm:justify-start">
              <div className="absolute inset-0 bg-radial from-cyan-500/20 via-transparent to-transparent blur-3xl pointer-events-none" />
              <img
                src={photo}
                alt="Lead Adventure Guide"
                className="w-full max-h-[320px] sm:max-h-[400px] lg:max-h-[480px] object-contain object-center sm:object-left animate-float relative z-10"
              />
            </div>
          </motion.div>

          {/* Text & Story Button */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[11px] font-heading font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Lead Adventure Guide
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black uppercase text-white leading-snug tracking-wider">
              "Every Traveler who books with me leaves as a friend"
            </h3>

            <p className="text-base sm:text-lg text-gray-300 font-body font-light leading-relaxed max-w-xl">
              Guiding white-water raft expeditions and forest stays across the Kali River isn't just a business for us and it is a lifelong passion.
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsStoryModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-amber-400 hover:bg-yellow-300 text-slate-950 rounded-full font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              <BookOpen className="w-4 h-4" />
              Read My Story
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-16" />

        {/* 2. Frameless Large Numbers Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center text-center group"
            >
              <div className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-white leading-none whitespace-nowrap tracking-tighter drop-shadow-md">
                <SmoothCountUp
                  end={stat.numericEnd}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>

              <span className="text-xs sm:text-sm font-heading font-bold text-cyan-300/80 uppercase tracking-widest mt-3 leading-snug max-w-[140px]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Story Popup Modal */}
      <AnimatePresence>
        {isStoryModalOpen && (
          <div className="fixed top-[80px] left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStoryModalOpen(false)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-2xl max-h-[calc(100vh-120px)] rounded-3xl p-[1px] bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 shadow-2xl z-10 overflow-hidden"
            >
              <div className="relative w-full h-full max-h-[calc(100vh-122px)] bg-slate-950 rounded-[23px] px-6 py-5 sm:px-10 sm:py-6 text-white overflow-hidden">

                {/* Close Button */}
                <button
                  onClick={() => setIsStoryModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close story"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-900 flex items-center justify-center">
                    <img
                      src={photo}
                      alt="Guide Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
                      Mr. Karthik , Your Adventure Guide
                    </h3>

                    <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Heart className="w-3.5 h-3.5 fill-current text-cyan-400" />
                      Certified Kali River Rafting Instructor
                    </span>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-6 text-gray-200 font-body text-sm sm:text-base leading-relaxed border-t border-white/10 pt-6 pr-4 max-h-[calc(100vh-260px)] overflow-y-auto">
                  <p>
                    I was born and raised in the heart of Ganeshgudi, Dandeli. Growing up
                    along the roaring Kali River and surrounded by the dense forests of
                    the Western Ghats, this wild landscape was my playground. Exploring
                    these rugged terrains from an early age gave me a deep, instinctive
                    understanding of the river's currents and the hidden wonders of the
                    jungle.
                  </p>

                  <p>
                    For me, <strong>the Kali River isn't just a workplace. It's home.</strong>
                  </p>

                  <p>
                    With over 12 years of experience on the river, I have turned my
                    lifelong connection to this landscape into a passion for sharing its
                    adventure with travelers from around the world. My deep-rooted local
                    knowledge, combined with years of hands-on expertise, allows me to
                    create safe, authentic, and unforgettable experiences for every guest.
                  </p>

                  <p>
                    Many travelers don't realize that rafting happens in Ganeshgudi, not
                    Dandeli. After seeing visitors struggle with confusing bookings and
                    limited support, I started this business to provide honest guidance,
                    transparent pricing, and hands-on assistance from booking to adventure.
                    Whether you're conquering the rapids of the Kali River or relaxing by
                    a riverside camp, my mission is simple: to help every guest experience
                    the very best of Ganeshgudi with confidence, comfort, and genuine local
                    hospitality.
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
