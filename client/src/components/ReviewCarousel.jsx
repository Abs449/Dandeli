import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { useReviews } from "../lib/data";
import bgReviews from "../assets/Backgroundimg/reviews-bg.webp";

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
      className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-[#021915] text-white flex flex-col justify-center border-t border-white/10"
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
          className="text-center mb-8 sm:mb-10"
        >
          <span className="inline-block text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 bg-cyan-950/60 px-5 py-1.5 rounded-full border border-cyan-500/30 shadow-md">
            Guest Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white mb-3 drop-shadow-md tracking-wider leading-snug">
            What Our <span className="text-amber-400">Guests Say</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-body font-light leading-relaxed">
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
                  <a
                    href={review.platformUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl hover:shadow-3xl hover:border-cyan-400/50 hover:bg-slate-900/95 transition-all duration-300 w-full flex-1 flex flex-col justify-between border border-white/15 relative group card-adventure text-white min-h-[300px] cursor-pointer block"
                  >
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
                        <span className="text-[11px] font-heading font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 group-hover:bg-cyan-900 px-3.5 py-1.5 rounded-full transition-colors border border-cyan-500/30 shrink-0">
                          {review.platform}
                        </span>
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
                        <h4 className="font-heading font-black text-white group-hover:text-cyan-300 transition-colors text-base leading-tight">
                          {review.name}
                        </h4>
                        <span className="text-xs text-cyan-400/80 font-body">
                          Verified Adventurer
                        </span>
                      </div>
                    </div>
                  </a>
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
