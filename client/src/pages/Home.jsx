import { lazy, Suspense } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Activities from "../components/Activities";
import Packages from "../components/Packages";
import Location from "../components/Location";

// ReviewCarousel pulls in Swiper (~150 kB), so lazy-load it and only ship
// that chunk when the home page actually needs it. By the time the user
// scrolls to the reviews section, the Swiper bundle is already in cache.
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
  return (
    <>
      <Hero />
      <div className="mt-14">
        <About />
      </div>
      <Services />
      <Activities />
      <Packages />
      <Location />
      <Suspense fallback={<ReviewFallback />}>
        <ReviewCarousel />
      </Suspense>
    </>
  );
};

export default Home;
