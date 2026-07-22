import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import { useReviews } from '../lib/data';

import 'swiper/css';
import 'swiper/css/pagination';

const ReviewCarousel = () => {
  const { data: reviews, loading } = useReviews();

  return (
    <section
      id="reviews"
      className="py-24 bg-linear-to-b from-[#e6dbcd] via-[#f5efe6] to-[#faf8f5] relative overflow-hidden border-b border-neutral-200/40 text-gray-900"
    >
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-bold mb-3">
            Guest Experiences
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-river">Guests Say</span>
          </h2>
          <p className="text-lg text-gray-655 max-w-2xl mx-auto font-body">
            Read about the experiences of our adventurers and campers on the Kali River.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white animate-pulse h-64 border border-neutral-200/40"
              />
            ))}
          </div>
        )}

        {reviews && reviews.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={reviews.length > 3}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-16"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto pb-4">
                <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between border border-neutral-200/40 relative group card-adventure text-gray-900">
                  <Quote
                    size={48}
                    className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/25 transition-colors duration-300 pointer-events-none"
                  />
                  <div>
                    <div className="flex items-center space-x-1 mb-6 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < review.rating
                              ? 'fill-current'
                              : 'text-neutral-200'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-8 leading-relaxed font-body text-base">
                      "{review.review}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed border-neutral-200 pt-6 mt-auto">
                    <div>
                      <h4 className="font-heading font-black text-gray-900 text-base">
                        {review.name}
                      </h4>
                      <a
                        href={review.platformUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1 rounded-full mt-1.5 inline-block transition-colors border border-primary/10 cursor-pointer"
                      >
                        {review.platform}
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default ReviewCarousel;
