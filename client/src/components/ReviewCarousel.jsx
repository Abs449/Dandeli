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
      className="py-24 bg-green-100/40 relative overflow-hidden"
    >
      <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-3">
            Real guests
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-6">
            What Our <span className="text-secondary">Guests Say</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-body">
            Read about the experiences of our visitors.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white/60 animate-pulse h-64"
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
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={reviews.length > 3}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-16"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto pb-4">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between border border-gray-100 relative">
                  <Quote
                    size={48}
                    className="absolute top-4 right-4 text-accent/15"
                  />
                  <div>
                    <div className="flex items-center space-x-1 mb-6 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < review.rating
                              ? 'fill-current'
                              : 'text-gray-200'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-8 leading-relaxed font-body text-lg">
                      "{review.review}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto">
                    <div>
                      <h4 className="font-heading font-bold text-gray-900 text-lg">
                        {review.name}
                      </h4>
                      <a
                        href={review.platformUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full mt-1 inline-block hover:bg-secondary/20 transition-colors"
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
