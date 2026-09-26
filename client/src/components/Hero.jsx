import { lazy, Suspense, useEffect, useRef, useState } from "react";
import backgroundImage from "../assets/Backgroundimg/hero-bg.webp";
// Center crop of hero-bg.webp for portrait screens — see .hero-bg-position
// in index.css.
import backgroundPortrait from "../assets/Backgroundimg/hero-portrait.webp";

// Screen-size-dependent content + framer-motion live in HeroContent, a lazy
// chunk — see the note there.
const HeroContent = lazy(() => import("./HeroContent"));

const Hero = () => {
  const heroRef = useRef(null);
  const [shouldLoadBackground, setShouldLoadBackground] = useState(true);
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 800,
  );
  // The homepage is prerendered to static HTML, and a static file can't
  // know the visitor's screen size. So the server render and the first
  // client render (which must match it for hydration) paint only the
  // screen-size-independent parts: the background (the LCP element) and the
  // real <h1>. HeroContent mounts one tick later; it already animates in
  // from opacity 0, so nothing visibly jumps.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return undefined;
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

  useEffect(() => {
    let frame = null;
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const width = window.innerWidth;
        if (width === lastWidth) return; // toolbar-only height change — ignore
        lastWidth = width;
        setViewportHeight(window.innerHeight);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // Handed to CSS as variables; .hero-bg-position picks one by screen shape.
  const bgVars = shouldLoadBackground
    ? { "--hero-bg-wide": `url(${backgroundImage})`, "--hero-bg-portrait": `url(${backgroundPortrait})` }
    : { "--hero-bg-wide": "none", "--hero-bg-portrait": "none" };

  return (
    <div
      id="hero"
      ref={heroRef}
      className="relative flex flex-col overflow-hidden"
      style={
        mounted
          ? { height: `${viewportHeight}px`, minHeight: `${viewportHeight}px` }
          : { height: "100svh", minHeight: "100svh" }
      }
    >
      {/* ── BACKGROUND (unchanged) ── */}
      <div className="hero-bg-pan absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="hero-bg-layers">
          <div
            className="hero-bg-layer hero-bg-layer-1 hero-bg-position"
            style={{
              ...bgVars,
              backgroundColor: "#021915",
            }}
          />
          <div
            className="hero-bg-layer hero-bg-layer-2 hero-bg-position"
            style={{
              ...bgVars,
              backgroundColor: "#021915",
            }}
          />
          <div
            className="hero-bg-layer hero-bg-layer-3 hero-bg-position"
            style={{
              ...bgVars,
              backgroundColor: "#021915",
            }}
          />
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background:
            "linear-gradient(to bottom, rgba(2,25,21,0.45) 0%, rgba(2,25,21,0.05) 50%, rgba(2,25,21,0.65) 100%)",
        }}
      />

      {/* Real semantic heading for SEO/accessibility — the animated letters
          below (RAP/DS, RAPIDS, etc.) are decorative and marked
          aria-hidden so screen readers and crawlers read this instead. */}
      <h1 className="sr-only">
        Dandeli Rafting on the Dandeli River — White-Water Rafting, Camping &amp; Jungle Adventures on the Kali River, Dandeli
      </h1>

      {mounted && (
        <Suspense fallback={null}>
          <HeroContent shouldLoadBackground={shouldLoadBackground} />
        </Suspense>
      )}
    </div>
  );
};

export default Hero;
