import React, { useRef, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Import original page components
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Activities from "./Activities";
import Gallery from "./Gallery";
import Packages from "./Packages";
import Location from "./Location";

// Lazy-load ReviewCarousel
const ReviewCarousel = lazy(() => import("./ReviewCarousel"));

// Import background assets from src/assets/Backgroundimg
import imgHero from "../assets/Backgroundimg/DSC_1226.JPG.jpeg";
import imgAbout from "../assets/Backgroundimg/Aboutus.webp";
import imgServices from "../assets/Backgroundimg/IMG20250524114921.jpg.jpeg";
import imgActivities from "../assets/Backgroundimg/dji_fly_20260103_124946_0149_1774087624546_photo.jpg.jpeg";
import imgGallery from "../assets/Backgroundimg/kayakinwater.jpg.jpeg";
import imgPackages from "../assets/Backgroundimg/DSC_1225.JPG.jpeg";
import imgLocation from "../assets/Backgroundimg/IMG20250524115322.jpg.jpeg";

const ReviewFallback = () => (
  <div className="w-full py-8 text-center text-slate-400">Loading Reviews...</div>
);

// Individual Scene Wrapper
const DocumentaryScene = ({
  scrollYProgress,
  start,
  end,
  bgImage,
  overlayClass = "bg-white/30",
  children,
}) => {
  // Parallax background scale and vertical shift (1.05 zoom covers translation boundaries)
  const scale = useTransform(scrollYProgress, [start, end], [1.05, 1.05], { clamp: true });
  const yBg = useTransform(scrollYProgress, [start, end], ["-2%", "2%"], { clamp: true });

  // Define adaptive scroll-mapping ranges based on scene position
  const isFirst = start === 0.0;
  const isLast = end === 1.0;

  const bgOpacityRange = isFirst
    ? [0.0, 0.0, end - 0.04, end]
    : isLast
    ? [start, start + 0.04, 1.0, 1.0]
    : [start, start + 0.04, end - 0.04, end];

  const bgOpacityValues = isFirst
    ? [1, 1, 1, 0]
    : isLast
    ? [0, 1, 1, 1]
    : [0, 1, 1, 0];

  const contentOpacityRange = isFirst
    ? [0.0, 0.0, end - 0.08, end - 0.04]
    : isLast
    ? [start + 0.04, start + 0.08, 1.0, 1.0]
    : [start + 0.04, start + 0.08, end - 0.08, end - 0.04];

  const contentOpacityValues = isFirst
    ? [1, 1, 1, 0]
    : isLast
    ? [0, 1, 1, 1]
    : [0, 1, 1, 0];

  const contentYRange = isFirst
    ? [0.0, 0.0, end - 0.08, end - 0.04]
    : isLast
    ? [start + 0.04, start + 0.08, 1.0, 1.0]
    : [start + 0.04, start + 0.08, end - 0.08, end - 0.04];

  const contentYValues = isFirst
    ? [0, 0, 0, -40]
    : isLast
    ? [40, 0, 0, 0]
    : [40, 0, 0, -40];

  // Background opacity (fades in on arrival, fades out on departure)
  const bgOpacity = useTransform(scrollYProgress, bgOpacityRange, bgOpacityValues, { clamp: true });

  // Content fade and slight slide-up based on scroll progression
  const contentOpacity = useTransform(scrollYProgress, contentOpacityRange, contentOpacityValues, { clamp: true });

  const contentY = useTransform(scrollYProgress, contentYRange, contentYValues, { clamp: true });

  // Set pointer events to "auto" only when the content is actually visible (> 10% opacity)
  const pointerEvents = useTransform(contentOpacity, (val) => val > 0.1 ? "auto" : "none");

  // Smooth springs for high-end organic camera moves
  const smoothScale = useSpring(scale, { stiffness: 85, damping: 22 });
  const smoothBgY = useSpring(yBg, { stiffness: 85, damping: 22 });
  const smoothBgOpacity = useSpring(bgOpacity, { stiffness: 85, damping: 22 });
  const smoothContentOpacity = useSpring(contentOpacity, { stiffness: 90, damping: 20 });
  const smoothContentY = useSpring(contentY, { stiffness: 90, damping: 20 });

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* 1. Background image layers (zooms and shifts under scroll control) */}
      <motion.div
        style={{ y: smoothBgY, scale: smoothScale, opacity: smoothBgOpacity }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <img
          src={bgImage}
          alt="Cinematic scenery"
          className="w-full h-full object-cover object-center select-none"
        />
        {/* Contrast Overlay Mask */}
        <div className={`absolute inset-0 z-10 ${overlayClass}`} />
      </motion.div>

      {/* 2. Content overlay (contains the original component with scroll-linked focus reveals) */}
      <motion.div
        style={{ opacity: smoothContentOpacity, y: smoothContentY, pointerEvents }}
        className="absolute inset-0 z-20 w-full h-full overflow-y-auto flex flex-col justify-start items-center pt-28 pb-20 cinematic-content-wrapper no-scrollbar"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Main CinematicDocumentary Component
export const CinematicDocumentary = () => {
  const containerRef = useRef(null);

  // Toggle cinematic-mode class on html root to enable native rem scaling
  React.useEffect(() => {
    document.documentElement.classList.add("cinematic-mode");
    return () => {
      document.documentElement.classList.remove("cinematic-mode");
    };
  }, []);

  // Track the scroll progress of the entire page scroll track (700vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative w-full h-[700vh] bg-black">
      {/* Viewport Pinned Frame */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10">
        
        {/* Scene 1: Hero */}
        <DocumentaryScene
          scrollYProgress={scrollYProgress}
          start={0.0}
          end={0.15}
          bgImage={imgHero}
          overlayClass="bg-black/45"
        >
          <Hero />
        </DocumentaryScene>

        {/* Scene 2: About */}
        <DocumentaryScene
          scrollYProgress={scrollYProgress}
          start={0.13}
          end={0.30}
          bgImage={imgAbout}
          overlayClass="bg-[#F8FAF7]/30"
        >
          <About />
        </DocumentaryScene>

        {/* Scene 3: Services */}
        <DocumentaryScene
          scrollYProgress={scrollYProgress}
          start={0.28}
          end={0.45}
          bgImage={imgServices}
          overlayClass="bg-white/30"
        >
          <Services />
        </DocumentaryScene>

        {/* Scene 4: Activities */}
        <DocumentaryScene
          scrollYProgress={scrollYProgress}
          start={0.43}
          end={0.60}
          bgImage={imgActivities}
          overlayClass="bg-[#F8FAF7]/35"
        >
          <Activities />
        </DocumentaryScene>

        {/* Scene 5: Gallery */}
        <DocumentaryScene
          scrollYProgress={scrollYProgress}
          start={0.58}
          end={0.75}
          bgImage={imgGallery}
          overlayClass="bg-white/30"
        >
          <Gallery />
        </DocumentaryScene>

        {/* Scene 6: Packages */}
        <DocumentaryScene
          scrollYProgress={scrollYProgress}
          start={0.73}
          end={0.88}
          bgImage={imgPackages}
          overlayClass="bg-gradient-to-b from-[#0B5563]/75 to-[#1B4332]/80"
        >
          <Packages />
        </DocumentaryScene>

        {/* Scene 7: Location & Testimonials */}
        <DocumentaryScene
          scrollYProgress={scrollYProgress}
          start={0.86}
          end={1.0}
          bgImage={imgLocation}
          overlayClass="bg-white/35"
        >
          <Suspense fallback={<ReviewFallback />}>
            <ReviewCarousel />
          </Suspense>
          <Location />
        </DocumentaryScene>

      </div>
    </div>
  );
};

export default CinematicDocumentary;
