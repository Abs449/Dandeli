import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { ShieldCheck, Calendar, Trees } from "lucide-react";
// import imgPaddlers from "../assets/Backgroundimg/DSC_1226.JPG.jpeg";
import imgJungle from "../assets/Backgroundimg/Aboutus.webp";
import imgRiver from "../assets/Backgroundimg/kayakinwater.webp";
// import djiimg from "../assets/Backgroundimg/DJI_0763.JPG";
import photo from "../assets/Backgroundimg/clientimg.png";
import img from "../assets/Backgroundimg/DJI_0763.JPG";

const features = [
  {
    num: "01",
    title: "Safety First",
    description:
      "Certified instructors and top-quality equipment ensure your safety at every turn. We coordinate directly with live river radar updates.",
    image: imgRiver,
    alt: "Safety First white water rafting in Dandeli",
  },
  {
    num: "02",
    title: "Years of Experience",
    description:
      "Over a decade of organizing successful, deeply immersive adventure trips on the rapids of the Kali River.",
    image: imgJungle,
    alt: "Years of experience in the lush Dandeli jungle",
  },
  {
    num: "03",
    title: "Eco-conscious",
    description:
      "We focus on sustainable, premium experiences that respect and preserve the untamed jungle wildlife.",
    image: img,
    alt: "Eco-conscious Dandeli aerial forest view",
  },
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDesktopBackground, setShowDesktopBackground] = useState(false);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 768px)");
    const updateBackgroundVisibility = () =>
      setShowDesktopBackground(desktopMediaQuery.matches);

    updateBackgroundVisibility();
    desktopMediaQuery.addEventListener("change", updateBackgroundVisibility);

    return () =>
      desktopMediaQuery.removeEventListener(
        "change",
        updateBackgroundVisibility,
      );
  }, []);

  // Auto loop slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Calculate coordinates for the rotating stacked photo circle
  const getCardStyle = (cardIndex) => {
    const diff = (cardIndex - activeIndex + features.length) % features.length;

    if (diff === 0) {
      // Front and active card
      return {
        zIndex: 30,
        scale: 1,
        x: 0,
        y: 0,
        opacity: 1,
        rotate: 0,
        filter: "blur(0px)",
      };
    } else if (diff === 1) {
      // Stacked to the right, behind (larger size & offset)
      return {
        zIndex: 20,
        scale: 0.88,
        x: 80,
        y: -25,
        opacity: 0.7,
        rotate: 4,
        filter: "blur(1px)",
      };
    } else {
      // Stacked to the left, deepest background (larger size & offset)
      return {
        zIndex: 10,
        scale: 0.8,
        x: -80,
        y: 25,
        opacity: 0.4,
        rotate: -4,
        filter: "blur(1.5px)",
      };
    }
  };

  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden flex items-center"
    >
      {showDesktopBackground && (
        <div
          className="pointer-events-none absolute inset-0 hidden bg-cover bg-center transition-transform duration-[20s] hover:scale-105 md:block"
          style={{ backgroundImage: `url(${img})` }}
        />
      )}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Heading */}
        <div className="w-full text-center mb-20">
          <span className="inline-block text-accent uppercase tracking-[0.3em] text-xs sm:text-sm font-bold mb-3">
            About Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight leading-tight">
            Your Gateway to{" "}
            <span className="text-secondary">Untamed Nature</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Main cutout image display */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative">
            <div className="relative w-full max-w-2xl lg:max-w-none overflow-hidden">
              <img
                src={photo}
                alt="Adventure guide cutout"
                className="w-full h-auto object-contain object-center"
              />
            </div>
          </div>

          {/* Value Text Box matching active index */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-black/40 backdrop-blur-md border border-white/10 p-8 sm:p-10 rounded-3xl">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-accent mb-4 uppercase tracking-wider">
              Our Base Values
            </h3>

            <div className="min-h-50 w-full flex flex-col justify-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <span className="text-4xl sm:text-5xl font-heading font-black text-accent tracking-tighter">
                      {features[activeIndex].num}
                    </span>
                    <div className="h-0.5 w-10 bg-accent shrink-0" />
                  </div>

                  <h4 className="text-3xl sm:text-4xl font-heading font-black text-white leading-tight">
                    {features[activeIndex].title}
                  </h4>

                  <p className="text-base sm:text-lg text-gray-200 font-body leading-relaxed max-w-xl mx-auto lg:mx-0">
                    {features[activeIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Bullet indicators */}
            <div className="flex gap-3 mt-8 justify-center lg:justify-start">
              {features.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    activeIndex === idx
                      ? "w-10 bg-accent"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Show value slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
