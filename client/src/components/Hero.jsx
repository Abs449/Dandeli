import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Waves } from "lucide-react";
import backgroundImage from "../assets/Backgroundimg/hero-bg.webp";
import raftCutout from "../assets/Backgroundimg/raft-cutout.webp";
import personCutout from "../assets/Backgroundimg/person-cutout.webp";

const Hero = () => {
  const heroRef = useRef(null);
  const [shouldLoadBackground, setShouldLoadBackground] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
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
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
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

  // ── SIZE CONTROLS ─────────────────────────────────────────────────────
  // EVERY dimension in the composite stage (headline text, RAP/DS text,
  // raft container) is now bounded by BOTH vw AND vh via min(Xvw, Yvh).
  // This is the actual fix for the "subtitle crosses OF DANDELI" bug:
  // previously the desktop RAP/DS text and raft width scaled off vw only,
  // so on a wide-but-short viewport (common on laptops in normal browser
  // windows — not just phones) the composite stage grew taller than the
  // available vh, and the flex-1 CTA/subtitle block below it got squeezed
  // to near-zero height by flexbox, causing its text to render on top of
  // "OF DANDELI" above it (text has no overflow clipping by default).
  //
  // Capping every growing dimension by vh as well means the composite
  // stage can never claim more vertical space than the viewport actually
  // has, on ANY screen size or aspect ratio — not just the ones we've
  // manually tested.

  const RAFT_MAX_WIDTH = 11000; // px cap for the raft+people group on desktop
  const RAFT_MAX_WIDTH_MOBILE = 620; // raised — was capping the raft too small
                                      // on narrower phones where vw alone left
                                      // room to grow.

  // Mobile sizing uses min(Xvw, Yvh) — bounded by BOTH width and height —
  // not vw alone. A narrow-but-tall phone (e.g. 402x874) has plenty of vw
  // to grow into, but limited vh; without a height ceiling the RAPIDS text
  // + raft image were free to grow tall enough to push the CTA below the
  // fold, forcing a scroll. The vh term caps that growth on short/cramped
  // screens while the vw term still governs on wide phones, so whichever
  // dimension is tighter wins.
  const conquerFontSize = isDesktop
    ? "clamp(20px, min(3.6vw, 5.2vh), 40px)"
    : "clamp(12px, min(6vw, 3.2vh), 26px)";
  const ofDandeliFontSize = isDesktop
    ? "clamp(20px, min(3.6vw, 5.2vh), 40px)"
    : "clamp(12px, min(6vw, 3.2vh), 26px)";
  // Desktop RAP/DS text: was `clamp(70px, 7.5vw, 150px)` — vw-only, so a
  // wide-but-short window let this grow past the height the stage had to
  // give it. Now bounded by vh too.
  const rapDsFontSize = "clamp(52px, min(7.5vw, 13vh), 150px)";
  // Desktop raft container: was `clamp(320px, 34vw, 700px)` — same vw-only
  // problem, made worse because it also drives the raft's aspect-ratio
  // height (width: 100%, height: auto).
  const raftContainerWidth = `clamp(260px, min(34vw, 42vh), ${RAFT_MAX_WIDTH}px)`;
  const rapidsFontSizeMobile = "clamp(40px, min(12vw, 7vh), 100px)";
  const raftContainerWidthMobile = `clamp(240px, min(88vw, 48vh), ${RAFT_MAX_WIDTH_MOBILE}px)`;

  return (
    <div
      id="hero"
      ref={heroRef}
      className="relative min-h-[100svh] h-[100svh] flex flex-col overflow-hidden"
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
      {/* Anchored to the TOP (no justify-center) — every section below is
          in NORMAL FLOW (nothing is position:absolute anymore). Elements
          in normal flow physically stack and can never overlap each
          other UNLESS one of them is forced to shrink past its content's
          natural size (which is exactly what was happening to the CTA
          block before — see the fix on that block below). */}
      <div
        className="relative flex flex-col w-full pointer-events-auto flex-1 min-h-0"
        style={{ zIndex: 10 }}
      >

        {/* ── TOP: Compact info row — location + live status in one line ── */}
        <div
          className="w-full flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 px-3 flex-shrink-0"
          style={{ paddingTop: "clamp(85px, 19vh, 110px)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
           className="inline-flex w-fit max-w-[calc(100vw-2rem)] sm:max-w-none min-w-0 items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.04em] sm:tracking-[0.16em] shadow-[0_4px_20px_rgba(0,0,0,0.2)] shrink-0"
            style={{
              marginTop: 0,
              marginBottom: isDesktop ? "clamp(8px, 1.5vh, 16px)" : "clamp(6px, 1.2vh, 14px)",
            }}
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
className="inline-flex w-fit max-w-[calc(100vw-2rem)] sm:max-w-none min-w-0 items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.03em] sm:tracking-[0.16em] shadow-[0_4px_20px_rgba(0,0,0,0.2)] cursor-pointer hover:bg-white/15 transition-colors"            style={{
              marginTop: 0,
              marginBottom: isDesktop ? "clamp(8px, 1.5vh, 16px)" : "clamp(6px, 1.2vh, 14px)",
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
          </motion.button>
        </div>
        

        {/* ── COMPOSITE STAGE: CONQUER THE + RAP[RAFT]DS + OF DANDELI ── */}
        {/* min-h-0 + overflow-hidden is a safety net: this block is the
            one allowed to flex/shrink when space is tight (flex-1 below),
            and if it's ever squeezed smaller than its content on some
            extreme viewport, content gets clipped here instead of
            overflowing onto the CTA block below it. With every dimension
            inside now vh-capped (see SIZE CONTROLS above) this shouldn't
            ever actually trigger — it's a backstop, not the primary fix. */}
<div
   className="relative w-full max-w-[1900px] mx-auto flex flex-col items-center justify-center flex-1 min-h-0 overflow-hidden"
   style={{
    paddingTop: isDesktop ? "clamp(24px, 4vh, 50px)" : "clamp(20px, 5vh, 44px)",
    paddingBottom: isDesktop ? "clamp(16px, 3vh, 30px)" : "clamp(16px, 4vh, 36px)",
  }}
>
          {/* CONQUER THE */}
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold uppercase text-white/90 leading-none select-none pointer-events-none text-center z-30 relative"
            style={{
              fontSize: conquerFontSize,
              letterSpacing: "0.28em",
              paddingLeft: "0.28em",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              marginBottom: isDesktop ? "clamp(5px, 1vh, 10px)" : "clamp(16px, 3.5vh, 32px)",
            }}
          >
            Conquer The
          </motion.p>

          {/* MIDDLE: raft row sits at its natural size directly between the
              two headlines. */}
          <div className="relative w-full flex items-center justify-center">

          {/* ── DESKTOP: RAP [RAFT+PEOPLE] DS layout ── */}
          {isDesktop ? (
            <div
              className="relative w-full max-w-[1600px] mx-auto flex items-center justify-center select-none pointer-events-none"
              style={{ zIndex: 30 }}
            >
              {/* RAP — left side */}
              <motion.span
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-impact uppercase leading-none shrink-0 bg-gradient-to-r from-[#C2410C] via-[#F97316] to-[#FDBA4A] bg-clip-text text-transparent"
                style={{
                  fontSize: rapDsFontSize,
                  letterSpacing: "0.05em",
                  lineHeight: 0.82,
                  opacity: 0.95,
                  filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.35))",
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
                    width: raftContainerWidth,
                    maxHeight: "48vh",
                    marginLeft: "0vw",
                    marginRight: "0vw",
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
                      maxHeight: "48vh",
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

              {/* DS — right side */}
              <motion.span
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-impact uppercase leading-none shrink-0 bg-[#F97316]  bg-clip-text text-transparent"
                style={{
                  fontSize: rapDsFontSize,
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
            /* ── MOBILE: RAPIDS centered + raft below ── */
            <div className="flex flex-col items-center w-full select-none pointer-events-none" style={{ zIndex: 30 }}>
              {/* RAPIDS — large centered heading on mobile */}
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-impact uppercase leading-none w-full text-center bg-gradient-to-r from-[#C2410C] via-[#F97316] to-[#FDBA4A] bg-clip-text text-transparent"
                style={{
                  fontSize: rapidsFontSizeMobile,
                  letterSpacing: "0.14em",
                  paddingLeft: "0.14em",
                  lineHeight: 0.85,
                  opacity: 1,
                  textShadow: "0 2px 18px rgba(249, 111, 80, 0)",
                  marginBottom: "clamp(16px, 3.5vh, 30px)",
                }}
              >
                RAPIDS
              </motion.p>

              {/* Raft + People — coupled on mobile, sized off RAFT_MAX_WIDTH_MOBILE */}
              {shouldLoadBackground && (
                <div
                  className="relative flex items-center justify-center shrink-0"
                  style={{
                    zIndex: 10,
                    width: raftContainerWidthMobile,
                    maxHeight: "40vh",
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
                      maxHeight: "40vh",
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
          </div>
          {/* OF DANDELI */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold uppercase text-white/90 leading-none select-none pointer-events-none text-center z-30 relative"
            style={{
              fontSize: ofDandeliFontSize,
              letterSpacing: "0.28em",
              paddingLeft: "0.28em",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              marginTop: isDesktop ? "clamp(4px, 2vh, 14px)" : "clamp(18px, 3.5vh, 32px)",
            }}
          >
            Of Dandeli
          </motion.p>
        </div>

        {/* ── BOTTOM: Subtitle + CTA ── */}
        {/* THE OTHER HALF OF THE FIX: this block used to be `flex-1
            min-h-0`, which made it the block flexbox shrinks first when
            total content exceeds the viewport — and since shrunk text
            blocks don't clip by default, its content rendered on top of
            "OF DANDELI" above it. It's now `flex-shrink-0 mt-auto`:
            flexbox is no longer ALLOWED to compress it below its natural
            content height, and `mt-auto` pushes it to the bottom of
            whatever space the (now vh-capped, and itself shrinkable)
            composite stage above leaves behind. This block will now
            always render at full size — the composite stage is the one
            that absorbs any squeeze, via its own min-h-0/overflow-hidden
            safety net above. */}
        <div
          className="relative w-full flex-shrink-0 mt-auto flex flex-col items-center justify-end gap-2 px-4 sm:px-6"
          style={{
            zIndex: 50,
            paddingBottom: isDesktop ? "clamp(24px, 6vh, 56px)" : "clamp(28px, 8vh, 64px)",
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
                  boxShadow: '0 6px 24px rgba(255,90,31,0.35)',
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
                {/* Close */}
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

                  <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase">
                    {statusLabel}
                  </h2>

                  <p className="mt-4 text-gray-300 leading-relaxed">
                    {damStatus.message}
                  </p>
                </div>

                {/* Status information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      River Flow
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      {isOpen
                        ? "Strong Flow"
                        : isClosed
                          ? "Calm Flow"
                          : "Unavailable"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Rafting Status
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      {isOpen
                        ? "Active"
                        : isClosed
                          ? "Suspended"
                          : "Unavailable"}
                    </p>
                  </div>
                </div>

                {hasPowerData && (
                  <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-5">
                    <p className="text-xs uppercase tracking-wider text-[#f5c97a] font-bold">
                      Power Data
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 font-mono text-sm">
                      {damStatus.supaValue !== null && (
                        <span>SUPA {damStatus.supaValue} MW</span>
                      )}

                      {damStatus.unit1 !== null && (
                        <span>U1 {damStatus.unit1} MW</span>
                      )}

                      {damStatus.unit2 !== null && (
                        <span>U2 {damStatus.unit2} MW</span>
                      )}
                    </div>
                  </div>
                )}

                {damStatus.fetchedAt && (
                  <p className="mt-5 text-xs text-gray-500">
                    Last updated:{" "}
                    {new Date(damStatus.fetchedAt).toLocaleString()}
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