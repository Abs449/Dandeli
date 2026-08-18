import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Waves } from "lucide-react";
import backgroundImage from "../assets/Backgroundimg/hero-bg.webp";
import raftCutout from "../assets/Backgroundimg/raft-cutout.webp";
import personCutout from "../assets/Backgroundimg/person-cutout.webp";

const Hero = () => {
  const heroRef = useRef(null);
  const [shouldLoadBackground, setShouldLoadBackground] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
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
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
      className="relative min-h-[100svh] flex flex-col overflow-hidden"
    >
      {/* ── LAYER 1 (z=0): Normal → mirrored → normal background loop ── */}
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

      {/* ── LAYER 2 (z=10): Clean, subtle vignette gradient for text contrast ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background:
            "linear-gradient(to bottom, rgba(2,25,21,0.45) 0%, rgba(2,25,21,0.05) 50%, rgba(2,25,21,0.65) 100%)",
        }}
      />

      {/* ── FULL-SCREEN UI SHELL (z=10) ── */}
      <div
        className="relative flex flex-col w-full pointer-events-auto min-h-[100svh]"
        style={{ zIndex: 10 }}
      >

        {/* ── TOP: Compact info row — location + live status in one line ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 pt-20 sm:pt-24 px-3 w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
           className="inline-flex w-fit max-w-[calc(100vw-2rem)] sm:max-w-none min-w-0 items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.04em] sm:tracking-[0.16em] shadow-[0_4px_20px_rgba(0,0,0,0.2)] shrink-0"
            style={{
              marginTop: isDesktop ? "2vh" : "1rem",
              marginBottom: isDesktop ? "1vh" : "0.5rem",
            }}
          >
            <Waves className="w-3 h-3 text-[#52b788] shrink-0" />
            <span className="text-center leading-tight whitespace-normal sm:whitespace-nowrap">{locationLabel}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="inline-flex w-fit max-w-[calc(100vw-2rem)] sm:max-w-none min-w-0 items-center justify-center gap-x-2 px-1.5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.03em] sm:tracking-[0.16em] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            style={{
              marginTop: isDesktop ? "2vh" : "0.5rem",
              marginBottom: isDesktop ? "1vh" : "0",
            }}
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
                <span className="inline-flex items-center justify-center gap-1.5 font-semibold whitespace-nowrap">                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-90 ${statusColor}`} />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColor} ${statusDotGlow}`} />
                  </span>
                  {mobileStatusLine}
                </span>
                {mobileStatusDetail && <span className="font-semibold whitespace-nowrap">{mobileStatusDetail}</span>}
                {hasPowerData && (<span className="text-[#f5c97a] font-bold font-mono text-[7px] border-l border-white/25 pl-1.5 whitespace-nowrap">
                  
                    {powerSummaryCompact}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── COMPOSITE STAGE: CONQUER THE + RAP[RAFT]DS + OF DANDELI ── */}
        <div className="relative flex-1 w-full overflow-hidden flex flex-col items-center justify-center">

          {/* CONQUER THE — top sub-headline pulled tight to raft */}
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold uppercase text-white/90 leading-none select-none pointer-events-none text-center z-30 relative"
            style={{
              fontSize: "clamp(11px, 7vw, 42px)",
              letterSpacing: "0.28em",
              paddingLeft: "0.28em",
              paddingTop: isDesktop ? "clamp(16px, 3vh, 36px)" : "clamp(12px, 2vh, 24px)",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              marginBottom: isDesktop ? "-4vh" : "2rem",
            }}
          >
            Conquer The
          </motion.p>

          {/* ── DESKTOP: RAP [RAFT+PEOPLE] DS layout ── */}
          {isDesktop ? (
            <div
              className="relative w-full flex items-center justify-center select-none pointer-events-none"
              style={{ zIndex: 30 }}
            >
              {/* RAP — left side */}
              <motion.span
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-impact uppercase leading-none shrink-0 bg-gradient-to-r from-[#FF5A1F] via-[#FF7A2F] to-[#FFB347] bg-clip-text text-transparent"
                style={{
                  fontSize: "clamp(56px, 12vw, 220px)",
                  letterSpacing: "0.05em",
                  lineHeight: 0.82,
                  opacity: 0.95,
                  textShadow: "0 2px 10px rgba(0,0,0,0.35)",
                }}
              >
                RAP
              </motion.span>

              {/* CENTRE: Raft + People — the hero visual (z=10 above the text) */}
              {shouldLoadBackground && (
                <div
                  className="relative flex items-center justify-center shrink-0 pointer-events-none"
                  style={{
                    zIndex: 10,
                    width: "clamp(380px, 45vw, 860px)",
                    marginLeft: "-2vw",
                    marginRight: "-2vw",
                  }}
                >
                  {/* Raft — base layer */}
                  <motion.img
                    src={raftCutout}
                    alt="Inflatable raft"
                    draggable={false}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      objectFit: "contain",
                      filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.75)) brightness(1.05)",
                      userSelect: "none",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                  {/* People — coupled, percentage-positioned inside same master container */}
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
                      width: "92%",
                      height: "auto",
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.6)) brightness(1.04)",
                      userSelect: "none",
                      zIndex: 2,
                    }}
                  />
                </div>
              )}

              {/* DS — right side */}
              <motion.span
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-impact uppercase leading-none shrink-0 bg-gradient-to-r from-[#FF5A1F] via-[#FF7A2F] to-[#FFB347] bg-clip-text text-transparent"
                style={{
                  fontSize: "clamp(56px, 12vw, 220px)",
                  letterSpacing: "0.05em",
                  lineHeight: 0.82,
                  opacity: 0.95,
                  textShadow: "0 2px 10px rgba(0,0,0,0.35)",
                }}
              >
                DS
              </motion.span>
            </div>
          ) : (
            /* ── MOBILE: RAPIDS centered + raft below ── */
            <div className="flex flex-col items-center w-full select-none pointer-events-none" style={{ zIndex: 30 }}>
              {/* RAPIDS — large centered heading on mobile */}
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-impact uppercase leading-none w-full text-center bg-gradient-to-r from-[#B83B24] via-[#FF6B4A] to-[#FFB15C] bg-clip-text text-transparent"
                style={{
                  fontSize: "clamp(56px, 20vw, 130px)",
                  letterSpacing: "0.14em",
                  paddingLeft: "0.14em",
                  lineHeight: 0.85,
                  opacity: 1,
                  textShadow: "0 2px 18px rgba(255,107,74,0.25)",
                  marginBottom: "clamp(8px, 1.5vh, 18px)",
                }}
              >
                RAPIDS
              </motion.p>

              {/* Raft + People — coupled on mobile, 88–92vw */}
              {shouldLoadBackground && (
                <div
                  className="relative flex items-center justify-center shrink-0"
                  style={{
                    zIndex: 10,
                    width: "clamp(260px, 88vw, 480px)",
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
                      height: "auto",
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

          {/* OF DANDELI — completion headline pulled tight to raft */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold uppercase text-white/90 leading-none select-none pointer-events-none text-center z-30 relative"
            style={{
              fontSize: "clamp(11px, 8vw, 42px)",
              letterSpacing: "0.28em",
              paddingLeft: "0.28em",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              marginTop: isDesktop ? "-4.5vh" : "0.5rem",
            }}
          >
            Of Dandeli
          </motion.p>
        </div>

        {/* ── BOTTOM: Subtitle + CTAs ── */}
        <div
          className="relative w-full flex flex-col items-center gap-3 px-4 sm:px-6 pb-6 sm:pb-8 pt-2"
          style={{ zIndex: 50 }}
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
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-none"
          >
            <motion.div whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                to="/booking"
                className="block w-full sm:w-auto px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-base transition-all duration-200 hover:-translate-y-0.5 text-center uppercase tracking-wider font-display text-white shadow-xl hover:brightness-110"
                style={{
                  backgroundColor: "#FF6B4A",
                  boxShadow: '0 6px 24px rgba(255,90,31,0.35)',
                }}
              >
                Book Adventure Now
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("about");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="block w-full sm:w-auto px-6 sm:px-10 py-2.5 sm:py-3.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-full font-semibold text-xs sm:text-base backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 text-center font-display cursor-pointer"
              >
                Explore Nature
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
