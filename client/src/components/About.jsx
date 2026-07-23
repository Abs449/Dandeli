import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Calendar, Trees } from "lucide-react";
import imgPaddlers from "../assets/Backgroundimg/DSC_1226.JPG.jpeg";
import imgJungle from "../assets/Backgroundimg/IMG20250524114921.jpg.jpeg";
import imgRiver from "../assets/Backgroundimg/kayakinwater.jpg.jpeg";
import djiimg from "../assets/Backgroundimg/DJI_0763.JPG";
import photo from "../assets/Backgroundimg/Untitled design(3).png";

const features = [
  {
    num: "01",
    title: "Safety First",
    description:
      "Certified instructors and top-quality equipment ensure your safety at every turn. We coordinate directly with live river radar updates.",
    image: imgPaddlers,
    alt: "Safety First white water rafting in Dandeli",
  },
  {
    num: "02",
    title: "Years of Experience",
    description:
      "Over a decade of organizing successful, deeply immersive adventure trips on the rapids of the Kali River.",
    image: imgRiver,
    alt: "Years of experience river kayaking in Dandeli",
  },
  {
    num: "03",
    title: "Eco-conscious",
    description:
      "We focus on sustainable, premium experiences that respect and preserve the untamed jungle wildlife.",
    image: imgJungle,
    alt: "Eco-conscious Dandeli forest stays",
  },
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);

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
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105 pointer-events-none"
        style={{
          backgroundImage: `url(${djiimg})`,
        }}
      />
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
          {/* Larger 3D Rotating Stack Photo Circle */}
          <div className="w-full lg:w-1/2 flex items-center justify-center min-h-[350px] sm:min-h-[440px] relative">
            <div className="relative w-[85%] aspect-video max-w-sm sm:max-w-md h-[260px] sm:h-[340px]">
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  animate={getCardStyle(index)}
                  transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white cursor-pointer select-none group"
                  onClick={() => setActiveIndex(index)}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                  />
                  <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Value Text Box matching active index */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-black/40 backdrop-blur-md border border-white/10 p-8 sm:p-10 rounded-3xl">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-accent mb-4 uppercase tracking-wider">
              Our Base Values
            </h3>

            <div className="min-h-[200px] w-full flex flex-col justify-start">
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
