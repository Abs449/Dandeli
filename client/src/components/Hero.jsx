import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Waves } from "lucide-react";
import backgroundImage from "../assets/Backgroundimg/hero-bg.webp";
import raftCutout from "../assets/Backgroundimg/raft-cutout.webp";
import personCutout from "../assets/Backgroundimg/person-cutout.webp";

// ── BREAKPOINT-DRIVEN CONTROLS ───────────────────────────────────────────
// raftMinH / raftMaxH are now HEIGHT bounds, not width bounds. The raft's
// size is driven by the stage row's own height (cqh) — its width follows
// automatically via aspectRatio. This is what makes it actually fill the
// available vertical space on tall screens instead of floating small in
// a big empty box.
const SIZE_TABLE = {
  xs:  { topPad: 78,  ctaPad: 22, raftMinH: 140, raftMaxH: 220 },
  sm:  { topPad: 84,  ctaPad: 26, raftMinH: 160, raftMaxH: 250 },
  md:  { topPad: 90,  ctaPad: 30, raftMinH: 180, raftMaxH: 280 },
  mdl: { topPad: 95,  ctaPad: 32, raftMinH: 200, raftMaxH: 320 },
  lg:  { topPad: 96,  ctaPad: 34, raftMinH: 220, raftMaxH: 400 },
  xl:  { topPad: 100, ctaPad: 38, raftMinH: 280, raftMaxH: 520 },
  xxl: { topPad: 106, ctaPad: 46, raftMinH: 320, raftMaxH: 640 },
};

// Hard ceiling on how tall the whole composite stage (headline + raft +
// headline) is allowed to grow, regardless of how much leftover space the
// grid's `1fr` row hands it on a very tall viewport. Without this, a tall
// screen just stretches the row and the raft floats in a huge void.
const STAGE_MAX_HEIGHT = { mobile: 520, desktop: 780 };

// Real aspect ratio of raft-cutout.webp (width / height). Keeping this
// accurate is what lets height-driven sizing produce a correctly
// proportioned raft instead of a stretched one.
const RAFT_ASPECT_RATIO = "483 / 340";

function getBreakpointKey(width) {
  if (width <= 380) return "xs";
  if (width <= 430) return "sm";
  if (width <= 599) return "md";
  if (width <= 767) return "mdl";
  if (width <= 1023) return "lg";
  if (width <= 1365) return "xl";
  return "xxl";
}

const DESKTOP_LAYOUT_KEYS = new Set(["lg", "xl", "xxl"]);

const Hero = () => {
  const heroRef = useRef(null);
  const [shouldLoadBackground, setShouldLoadBackground] = useState(true);
  const [bp, setBp] = useState(() =>
    typeof window !== "undefined" ? getBreakpointKey(window.innerWidth) : "lg",
  );
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 800,
  );
  const [showStatusDetails, setShowStatusDetails] = useState(false);
  const [damStatus, setDamStatus] = useState({
    loading: true,
    status: "loading",
    message: "Checking live water activity status…",
    supaValue: null,
    unit1: null,
    unit2: null,
    fetchedAt: null,
  });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.1]);

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
    let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const handleResize = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const width = window.innerWidth;
        if (width === lastWidth) return; // toolbar-only height change — ignore
        lastWidth = width;
        setBp((prev) => {
          const key = getBreakpointKey(width);
          return prev === key ? prev : key;
        });
        setViewportHeight(window.innerHeight);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (showStatusDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showStatusDetails]);

  const loadDamStatus = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiUrl}/api/dam-status`, { signal: controller.signal });
      clearTimeout(timeoutId);
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
      clearTimeout(timeoutId);
      console.error("Unable to load dam status", error);
      setDamStatus({
        loading: false,
        status: "error",
        message: "Live status temporarily unavailable.",
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

  const isDesktop = DESKTOP_LAYOUT_KEYS.has(bp);
  const size = SIZE_TABLE[bp];
  const stageMaxHeight = isDesktop ? STAGE_MAX_HEIGHT.desktop : STAGE_MAX_HEIGHT.mobile;

  const isOpen = damStatus.status === "open";
  const locationLabel = "Ganeshgudi · Dandeli Kali River";
  const statusLabel = damStatus.loading
    ? "Checking…"
    : isOpen
      ? "Strong Flow · Rafting Active"
      : damStatus.status === "closed"
        ? "Calm Flow · Rafting Suspended"
        : "Status Offline";
  const mobileStatusLabel = damStatus.loading
    ? "Checking…"
    : isOpen
      ? "Strong Flow"
      : damStatus.status === "closed"
        ? "Calm Flow"
        : "Status Offline";
  const isClosed = damStatus.status === "closed";
  const mobileStatusLine = mobileStatusLabel;
  const mobileStatusDetail = damStatus.loading
    ? ""
    : isOpen
      ? "Rafting Active"
      : isClosed
        ? "Rafting Suspended"
        : "";

  const hasPowerData = damStatus.supaValue !== null || damStatus.unit1 !== null || damStatus.unit2 !== null;
  const powerSummary = [
    damStatus.supaValue !== null ? `SUPA ${damStatus.supaValue} MW` : null,
    damStatus.unit1 !== null ? `U1 ${damStatus.unit1} MW` : null,
    damStatus.unit2 !== null ? `U2 ${damStatus.unit2} MW` : null,
  ]
    .filter(Boolean)
    .join(" | ");
  const powerSummaryCompact = [
    damStatus.supaValue !== null ? `S ${damStatus.supaValue}` : null,
    damStatus.unit1 !== null ? `U1 ${damStatus.unit1}` : null,
    damStatus.unit2 !== null ? `U2 ${damStatus.unit2}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const statusColor = damStatus.loading
    ? "bg-amber-300"
    : isOpen
      ? "bg-emerald-400"
      : damStatus.status === "closed"
        ? "bg-rose-400"
        : "bg-slate-400";
  const statusDotGlow = damStatus.loading
    ? "shadow-[0_0_8px_rgba(252,211,77,0.95)]"
    : isOpen
      ? "shadow-[0_0_10px_rgba(52,211,153,0.95)]"
      : damStatus.status === "closed"
        ? "shadow-[0_0_10px_rgba(251,113,133,0.95)]"
        : "shadow-[0_0_8px_rgba(148,163,184,0.8)]";

  const bgUrl = shouldLoadBackground ? `url(${backgroundImage})` : "none";

  return (
    <div
      id="hero"
      ref={heroRef}
      className="relative flex flex-col overflow-hidden"
      style={{ height: `${viewportHeight}px`, minHeight: `${viewportHeight}px` }}
    >
      {/* ── BACKGROUND (unchanged) ── */}
      <div className="hero-bg-pan absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="hero-bg-layers">
          <div
            className="hero-bg-layer hero-bg-layer-1"
            style={{
              backgroundImage: bgUrl,
              backgroundColor: "#021915",
              backgroundPosition: isDesktop ? "center 55%" : "center 38%",
            }}
          />
          <div
            className="hero-bg-layer hero-bg-layer-2"
            style={{
              backgroundImage: bgUrl,
              backgroundColor: "#021915",
              backgroundPosition: isDesktop ? "center 55%" : "center 38%",
            }}
          />
          <div
            className="hero-bg-layer hero-bg-layer-3"
            style={{
              backgroundImage: bgUrl,
              backgroundColor: "#021915",
              backgroundPosition: isDesktop ? "center 55%" : "center 38%",
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

      {/* ── UI SHELL: real CSS Grid, three hard rows ────────────────────
          auto  = top status row: exactly as tall as its content
          1fr   = composite stage: gets ONLY the leftover space, and can
                  never push into row 3 no matter what's inside it
          auto  = CTA block: exactly as tall as its content, always
                  fully visible */}
      <div
        className="relative w-full pointer-events-auto flex-1 min-h-0"
        style={{
          zIndex: 10,
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr) auto",
          height: "100%",
        }}
      >
        {/* ── ROW 1: status row ── */}
        <div
          className="w-full flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 px-3"
          style={{ paddingTop: `${size.topPad}px` }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex w-fit max-w-[calc(100vw-2rem)] sm:max-w-none min-w-0 items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.04em] sm:tracking-[0.16em] shadow-[0_4px_20px_rgba(0,0,0,0.2)] shrink-0"
            style={{ marginBottom: isDesktop ? "12px" : "10px" }}
          >
            <Waves className="w-3 h-3 text-[#52b788] shrink-0" />
            <span className="text-center leading-tight whitespace-normal sm:whitespace-nowrap">{locationLabel}</span>
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            onClick={() => setShowStatusDetails(true)}
            className="inline-flex w-fit max-w-[calc(100vw-2rem)] sm:max-w-none min-w-0 items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.03em] sm:tracking-[0.16em] shadow-[0_4px_20px_rgba(0,0,0,0.2)] cursor-pointer hover:bg-white/15 transition-colors"
            style={{ marginBottom: isDesktop ? "12px" : "10px" }}
          >
            {isDesktop ? (
              <>
                <span className="w-full sm:w-auto inline-flex items-center gap-1.5 font-semibold leading-tight sm:whitespace-nowrap">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-90 ${statusColor}`} />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColor} ${statusDotGlow}`} />
                  </span>
                  {statusLabel}
                </span>
                {hasPowerData && (
                  <span className="w-full sm:w-auto text-[#f5c97a] font-bold font-mono text-[8px] sm:text-[9px] pt-0.5 sm:pt-0 border-t sm:border-t-0 border-white/25 sm:border-l sm:border-white/25 sm:pl-1.5 leading-tight break-words sm:whitespace-nowrap">
                    {powerSummary}
                  </span>
                )}
              </>
            ) : (
              <div className="flex min-w-0 flex-row flex-wrap items-center justify-center gap-x-2 gap-y-0.5 leading-tight text-center">
                <span className="inline-flex items-center justify-center gap-1.5 font-semibold whitespace-nowrap">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-90 ${statusColor}`} />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColor} ${statusDotGlow}`} />
                  </span>
                  {mobileStatusLine}
                </span>
                {mobileStatusDetail && <span className="font-semibold whitespace-nowrap">{mobileStatusDetail}</span>}
                {hasPowerData && (
                  <span className="text-[#f5c97a] font-bold font-mono text-[7px] border-l border-white/25 pl-1.5 whitespace-nowrap">
                    {powerSummaryCompact}
                  </span>
                )}
              </div>
            )}
          </motion.button>
        </div>

        {/* ── ROW 2: composite stage ──────────────────────────────────
            `maxHeight: stageMaxHeight` stops the stage from stretching to
            fill unbounded leftover space on tall viewports — it grows up
            to that cap, then centers in whatever the grid row gives it.
            `container-type: size` still makes this a query container, so
            everything inside scales off ITS resolved height/width (cqh /
            cqw), not the viewport — the raft is now driven by height
            (cqh) via aspectRatio, so it actually fills the taller box
            instead of floating small inside it. */}
        <div
          className="hero-stage relative w-full max-w-[1900px] mx-auto flex flex-col items-center justify-center min-h-0 overflow-hidden"
          style={{
            containerType: "size",
            containerName: "hero-stage",
            maxHeight: `${stageMaxHeight}px`,
            margin: "0 auto",
            paddingTop: isDesktop ? "clamp(8px, 3cqh, 30px)" : "clamp(6px, 3cqh, 18px)",
            paddingBottom: isDesktop ? "clamp(6px, 2cqh, 20px)" : "clamp(4px, 2cqh, 14px)",
          }}
        >
          {/* CONQUER THE */}
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold uppercase text-white/90 leading-none select-none pointer-events-none text-center z-30 relative"
            style={{
              fontSize: isDesktop ? "clamp(20px, 8cqh, 64px)" : "clamp(14px, 6cqh, 20px)",
              letterSpacing: "0.28em",
              paddingLeft: "0.28em",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              marginBottom: "clamp(6px, 1.5cqh, 14px)",
            }}
          >
            Conquer The
          </motion.p>

          <div className="relative w-full flex items-center justify-center min-h-0" style={{ flex: "1 1 auto" }}>
            {isDesktop ? (
              /* ── DESKTOP: RAP [RAFT+PEOPLE] DS ── */
              <div
                className="relative w-full max-w-[1600px] mx-auto flex items-center justify-center select-none pointer-events-none"
                style={{ zIndex: 30 }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="font-impact uppercase leading-none shrink-0 bg-gradient-to-r from-[#C2410C] via-[#F97316] to-[#FDBA4A] bg-clip-text text-transparent"
                  style={{
                    fontSize: "clamp(50px, 22cqh, 170px)",
                    letterSpacing: "0.05em",
                    lineHeight: 0.82,
                    opacity: 0.95,
                    filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.35))",
                  }}
                >
                  RAP
                </motion.span>

                {shouldLoadBackground && (
                  <div
                    className="relative flex items-center justify-center shrink-0 pointer-events-none"
                    style={{
                      zIndex: 10,
                      // HEIGHT is now the controlling dimension — this is
                      // the actual fix. Width follows via aspectRatio, so
                      // the raft genuinely fills a taller row instead of
                      // sitting small in the middle of it. maxWidth is
                      // just a safety rail for extreme narrow/tall cases.
                      height: `clamp(${size.raftMinH}px, 68cqh, ${size.raftMaxH}px)`,
                      width: "auto",
                      aspectRatio: RAFT_ASPECT_RATIO,
                      maxWidth: "42cqw",
                    }}
                  >
                    <motion.img
                      src={raftCutout}
                      alt="Inflatable raft"
                      draggable={false}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "contain",
                        filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.75)) brightness(1.05)",
                        userSelect: "none",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                    <motion.img
                      src={personCutout}
                      alt="Rafting group"
                      draggable={false}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: "absolute",
                        bottom: "16%",
                        left: "6%",
                        transform: "translateX(-50%)",
                        width: "88%",
                        height: "auto",
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.6)) brightness(1.04)",
                        userSelect: "none",
                        zIndex: 2,
                      }}
                    />
                  </div>
                )}

                <motion.span
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="font-impact uppercase leading-none shrink-0 bg-[#F97316] bg-clip-text text-transparent"
                  style={{
                    fontSize: "clamp(50px, 22cqh, 170px)",
                    letterSpacing: "0.05em",
                    lineHeight: 0.82,
                    opacity: 0.95,
                    filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.35))",
                  }}
                >
                  DS
                </motion.span>
              </div>
            ) : (
              /* ── MOBILE: RAPIDS stacked ── */
              <div className="flex flex-col items-center w-full min-h-0 select-none pointer-events-none" style={{ zIndex: 30 }}>
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="font-impact uppercase leading-none w-full text-center bg-gradient-to-r from-[#C2410C] via-[#F97316] to-[#FDBA4A] bg-clip-text text-transparent"
                  style={{
                    fontSize: "clamp(34px, 22cqh, 72px)",
                    letterSpacing: "0.14em",
                    paddingLeft: "0.14em",
                    lineHeight: 0.85,
                    marginBottom: "clamp(8px, 2cqh, 18px)",
                  }}
                >
                  RAPIDS
                </motion.p>

                {shouldLoadBackground && (
                  <div
                    className="relative flex items-center justify-center shrink-0 min-h-0"
                    style={{
                      zIndex: 10,
                      height: `clamp(${size.raftMinH}px, 48cqh, ${size.raftMaxH}px)`,
                      width: "auto",
                      aspectRatio: RAFT_ASPECT_RATIO,
                      maxWidth: "78cqw",
                    }}
                  >
                    <motion.img
                      src={raftCutout}
                      alt="Inflatable raft"
                      draggable={false}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "contain",
                        filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.7)) brightness(1.05)",
                        userSelect: "none",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                    <motion.img
                      src={personCutout}
                      alt="Rafting group"
                      draggable={false}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: "absolute",
                        bottom: "16%",
                        left: "6%",
                        transform: "translateX(-50%)",
                        width: "92%",
                        height: "auto",
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.6)) brightness(1.04)",
                        userSelect: "none",
                        zIndex: 2,
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* OF DANDELI */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold uppercase text-white/90 leading-none select-none pointer-events-none text-center z-30 relative"
            style={{
              fontSize: isDesktop ? "clamp(20px, 8cqh, 64px)" : "clamp(14px, 6cqh, 20px)",
              letterSpacing: "0.28em",
              paddingLeft: "0.28em",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              marginTop: "clamp(6px, 1.5cqh, 14px)",
            }}
          >
            Of Dandeli
          </motion.p>
        </div>

        {/* ── ROW 3: CTA — grid row is "auto", so this is ALWAYS its
            natural full size and can never be compressed or overlapped
            by row 2, no matter what happens above. */}
        <div
          className="relative w-full flex flex-col items-center justify-end gap-2 px-4 sm:px-6"
          style={{
            zIndex: 50,
            paddingBottom: `${size.ctaPad}px`,
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="text-xs sm:text-sm md:text-base text-white/90 font-body font-medium max-w-xs sm:max-w-md mx-auto text-center leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            White-water rafting, forest camping &amp; raw eco-adventures on the Kali River.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-none mt-2"
          >
            <motion.div whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                to="/booking"
                className="block w-full sm:w-auto px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-base transition-all duration-200 hover:-translate-y-0.5 text-center uppercase tracking-wider font-display text-white shadow-xl hover:brightness-110"
                style={{
                  backgroundColor: "#FF6B4A",
                  boxShadow: "0 6px 24px rgba(255,90,31,0.35)",
                }}
              >
                Book Adventure Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showStatusDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowStatusDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#021915] border border-[#f5c97a]/50 shadow-2xl p-6 sm:p-8 text-white"
            >
              <button
                type="button"
                onClick={() => setShowStatusDetails(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl"
                aria-label="Close"
              >
                ×
              </button>

              <div className="pr-10">
                <p className="text-xs uppercase tracking-[0.2em] text-[#f5c97a] font-bold mb-2">
                  Live River Status
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase">{statusLabel}</h2>
                <p className="mt-4 text-gray-300 leading-relaxed">{damStatus.message}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-wider text-gray-400">River Flow</p>
                  <p className="mt-2 text-xl font-bold">
                    {isOpen ? "Strong Flow" : isClosed ? "Calm Flow" : "Unavailable"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-wider text-gray-400">Rafting Status</p>
                  <p className="mt-2 text-xl font-bold">
                    {isOpen ? "Active" : isClosed ? "Suspended" : "Unavailable"}
                  </p>
                </div>
              </div>

              {hasPowerData && (
                <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-wider text-[#f5c97a] font-bold">Power Data</p>
                  <div className="mt-3 flex flex-wrap gap-4 font-mono text-sm">
                    {damStatus.supaValue !== null && <span>SUPA {damStatus.supaValue} MW</span>}
                    {damStatus.unit1 !== null && <span>U1 {damStatus.unit1} MW</span>}
                    {damStatus.unit2 !== null && <span>U2 {damStatus.unit2} MW</span>}
                  </div>
                </div>
              )}

              {damStatus.fetchedAt && (
                <p className="mt-5 text-xs text-gray-500">
                  Last updated: {new Date(damStatus.fetchedAt).toLocaleString()}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;