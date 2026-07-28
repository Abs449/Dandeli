import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { BookOpen, X, Sparkles, Heart } from "lucide-react";
import photo from "../assets/Backgroundimg/clientimg.png";
import imgJungle from "../assets/Backgroundimg/Aboutus.webp";

// Smooth Eased Number Counter Component
const SmoothCountUp = ({ end, duration = 2.0, decimals = 0, suffix = "" }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easedProgress * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={nodeRef} className="inline-flex items-baseline font-heading font-black text-white whitespace-nowrap">
      <span>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}</span>
      {suffix && <span className="text-accent font-black ml-1">{suffix}</span>}
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

  // Scroll-linked background zoom effect with spring physics smoothing
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.15, 1.05]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 0.85, 0.85, 0.4]);

  const bgScale = useSpring(rawScale, { stiffness: 90, damping: 30, restDelta: 0.0001 });
  const bgOpacity = useSpring(rawOpacity, { stiffness: 90, damping: 30, restDelta: 0.0001 });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 relative overflow-hidden flex flex-col items-center bg-slate-950 text-white"
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

      {/* Clear Dark Gradient Overlay for High Image Clarity */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/75 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="w-full text-center mb-14 sm:mb-16"
        >
          <span className="inline-block text-accent uppercase tracking-[0.3em] text-xs font-bold mb-2.5">
            About Us
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight leading-tight">
            Your Gateway to{" "}
            <span className="text-secondary">Untamed Nature</span>
          </h2>
        </motion.div>

        {/* 1. Guide Cutout Image & Quote Section (BEFORE stats) */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 mb-16">
          {/* Cutout Image: Pops up slowly from the left */}
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 flex items-center justify-center relative px-2 sm:px-0"
          >
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none overflow-hidden drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] flex justify-center">
              <div className="absolute inset-0 bg-radial from-accent/25 via-transparent to-transparent blur-3xl pointer-events-none" />
              <img
                src={photo}
                alt="Lead Adventure Guide"
                className="w-full max-h-[300px] sm:max-h-[380px] md:max-h-[440px] lg:max-h-[480px] object-contain object-center animate-float relative z-10"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-heading font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Lead Adventure Guide
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-white leading-tight tracking-tight">
              "Every Traveler who books with me leaves as a friend"
            </h3>

            <p className="text-gray-300 font-body text-sm sm:text-base leading-relaxed max-w-xl">
              Guiding white-water raft expeditions and forest stays across the Kali River isn't just a business for us — it is a lifelong passion.
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsStoryModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent hover:bg-accent/90 text-white rounded-full font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              <BookOpen className="w-4 h-4" />
              Read My Story
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-16" />

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
              <div className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white leading-none whitespace-nowrap tracking-tight drop-shadow-md">
                <SmoothCountUp
                  end={stat.numericEnd}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>

              <span className="text-[11px] sm:text-xs font-heading font-bold text-gray-300 uppercase tracking-widest mt-3 leading-snug max-w-[140px]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Story Popup Modal */}
      <AnimatePresence>
        {isStoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStoryModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 text-white overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-river" />

              <button
                onClick={() => setIsStoryModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close story"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent shrink-0 bg-slate-800 flex items-center justify-center">
                  <img src={photo} alt="Guide Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
                    My Dandeli Journey
                  </h3>
                  <span className="text-xs text-accent font-semibold flex items-center gap-1 mt-0.5">
                    <Heart className="w-3.5 h-3.5 fill-current" /> Certified Kali River Instructor
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-gray-200 font-body text-sm sm:text-base leading-relaxed border-t border-white/10 pt-5">
                <p>
                  Born and raised along the banks of the Kali River, my connection to Dandeli’s lush wilderness began in childhood. Over 8 years ago, I turned my love for white-water navigation into a passion for sharing these untamed rapids with travelers from around the world.
                </p>
                <p>
                  For me, rafting isn’t just an adrenaline rush — it’s about absolute safety, genuine hospitality, and creating unforgettable memories in nature. Whether you're conquering Class III rapids or sitting around a forest campfire, my mission is simple: <strong>Every traveler who books with me leaves as a lifelong friend.</strong>
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsStoryModalOpen(false)}
                  className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-full font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close Story
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
