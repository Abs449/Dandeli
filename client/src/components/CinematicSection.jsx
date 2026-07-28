import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * CinematicSection wraps an existing page component in a normal-flowing section,
 * maintaining a sticky viewport-locked background image that fades/scales/translates
 * on scroll, while the content scrolls naturally in the foreground.
 *
 * @param {string} bgImage - Path or asset for the background image
 * @param {string} overlayClass - CSS overlays for color/contrast masks
 * @param {React.ReactNode} children - Component to render on top
 */
export const CinematicSection = ({
  bgImage,
  overlayClass = "bg-white/30",
  children,
}) => {
  const containerRef = useRef(null);

  // Track the scroll progress of this specific section relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle image parallax and zoom (highly focused and sharp, no pixelation)
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.05], { clamp: true });
  const yBg = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"], { clamp: true });

  // Background cross-fade (dims out when entering/leaving, solid in focal range)
  const bgOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.2, 0.8, 1.0],
    [0.15, 1, 1, 0.15],
    { clamp: true }
  );

  // Content fade-in and slide-up as the section comes into view
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.32, 0.82, 0.95],
    [0, 1, 1, 0],
    { clamp: true }
  );

  const contentY = useTransform(
    scrollYProgress,
    [0.15, 0.32, 0.82, 0.95],
    [50, 0, 0, -50],
    { clamp: true }
  );

  // Smooth spring physics for organic, premium feel
  const smoothScale = useSpring(scale, { stiffness: 85, damping: 22 });
  const smoothBgY = useSpring(yBg, { stiffness: 85, damping: 22 });
  const smoothBgOpacity = useSpring(bgOpacity, { stiffness: 85, damping: 22 });
  const smoothContentOpacity = useSpring(contentOpacity, { stiffness: 90, damping: 20 });
  const smoothContentY = useSpring(contentY, { stiffness: 90, damping: 20 });

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-visible">
      {/* 1. Sticky background container scoped to this section */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0 pointer-events-none">
        <motion.div
          style={{ y: smoothBgY, scale: smoothScale, opacity: smoothBgOpacity }}
          className="absolute inset-0 w-full h-[110%] will-change-transform"
        >
          <img
            src={bgImage}
            alt="Cinematic scenery"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
          />
        </motion.div>
        {/* Contrast Overlay Mask */}
        <div className={`absolute inset-0 z-10 ${overlayClass}`} />
      </div>

      {/* 2. Content overlay wrapper (pulled up over the sticky background frame) */}
      <motion.div
        style={{ opacity: smoothContentOpacity, y: smoothContentY }}
        className="relative z-20 w-full -mt-[100vh] flex items-center justify-center cinematic-content-wrapper overflow-visible pointer-events-auto"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default CinematicSection;
