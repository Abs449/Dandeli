import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { useReviews } from "../lib/data";
import bgReviews from "../assets/Backgroundimg/DJI_0763.JPG";

import "swiper/css";
import "swiper/css/pagination";

const ReviewCarousel = () => {
  const { data: reviews, loading } = useReviews();
  const sectionRef = useRef(null);

  // Scroll-linked background zoom effect with spring physics smoothing
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.08, 1.02]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 0.95, 0.95, 0.6]);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-24 sm:py-32 md:py-40 relative overflow-hidden bg-[#021915] text-white min-h-[85vh] flex flex-col justify-center"
    >
      {/* Scroll-Driven Background Image Layer (DJI_0763.JPG) */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgReviews})`,
          scale: bgScale,
          opacity: bgOpacity,
        }}
      />

      {/* Clear Overlay for High Background Visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021915]/60 via-[#021915]/25 to-[#021915]/65 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 sm:mb-16"
        >
          <span className="inline-block text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 bg-cyan-950/60 px-5 py-1.5 rounded-full border border-cyan-500/30 shadow-md">
            Guest Experiences
          </span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white mb-5 drop-shadow-md italic tracking-tighter leading-tight">
            What Our <span className="text-amber-400">Guests Say</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-body font-light leading-relaxed">
            Read about the experiences of our adventurers and campers on the Kali River.
          </p>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-slate-950/60 animate-pulse h-80 border border-white/10"
              />
            ))}
          </div>
        )}

        {reviews && reviews.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={28}
            slidesPerView={1}
            observer={true}
            observeParents={true}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 24 },
              768: { slidesPerView: 2, spaceBetween: 28 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={reviews.length >= 3}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-20 !items-stretch"
          >
            {reviews.map((review) => {
              const initials = review.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2);

              return (
                <SwiperSlide key={review.id} className="!h-auto flex flex-col pb-4">
                  <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl hover:shadow-3xl transition-all duration-300 w-full flex-1 flex flex-col justify-between border border-white/15 relative group card-adventure text-white min-h-[300px]">
                    <div>
                      {/* Rating Stars & Platform Pill */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center space-x-1.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={
                                i < review.rating
                                  ? "fill-current text-amber-400"
                                  : "text-slate-700"
                              }
                            />
                          ))}
                        </div>
                        <a
                          href={review.platformUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-heading font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 px-3.5 py-1.5 rounded-full transition-colors border border-cyan-500/30 cursor-pointer shrink-0"
                        >
                          {review.platform}
                        </a>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-200 font-normal mb-6 leading-relaxed font-body text-base sm:text-lg">
                        {review.review}
                      </p>
                    </div>

                    {/* Author Footer Info */}
                    <div className="flex items-center gap-4 border-t border-dashed border-white/15 pt-5 mt-auto">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-300 text-slate-950 font-heading font-black text-sm flex items-center justify-center shadow-md uppercase tracking-wider shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-white text-base leading-tight">
                          {review.name}
                        </h4>
                        <span className="text-xs text-cyan-400/80 font-body">
                          Verified Adventurer
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default ReviewCarousel;
