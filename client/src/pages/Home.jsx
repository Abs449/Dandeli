import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Packages from "../components/Packages";
import Location from "../components/Location";

const ReviewCarousel = lazy(() => import("../components/ReviewCarousel"));

const ReviewFallback = () => (
  <section className="py-24 bg-green-100/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-3xl bg-white/60 animate-pulse h-64" />
        ))}
      </div>
    </div>
  </section>
);

const Home = () => {
  const location = useLocation();

  useEffect(() => {
  const targetId =
    location.state?.scrollTo ||
    location.hash?.replace('#', '');

  if (!targetId) return;

  const timer = setTimeout(() => {
    const el = document.getElementById(targetId);

    if (!el) return;

    const navbarHeight = 80;

    const targetTop =
      el.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight;

    const start = window.scrollY;
    const distance = targetTop - start;
    const duration = 1200;
    const startTime = performance.now();

    const easeInOutCubic = (t) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
      const progress = Math.min(
        (now - startTime) / duration,
        1
      );

      window.scrollTo(
        0,
        start + distance * easeInOutCubic(progress)
      );

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, 300);

  return () => clearTimeout(timer);
}, [location]);

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Packages />
      <Location />
      <Suspense fallback={<ReviewFallback />}>
        <ReviewCarousel />
      </Suspense>
    </>
  );
};

export default Home;
