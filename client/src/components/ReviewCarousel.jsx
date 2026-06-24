import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import { reviews } from '../data/mockData';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const ReviewCarousel = () => {
  return (
    <section id="reviews" className="py-24 bg-green-100/40 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-semibold tracking-wide text-sm mb-4 border border-secondary/20">
            TESTIMONIALS
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-6">
            What Our <span className="text-secondary">Guests Say</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-body">
            Don't just take our word for it. Read about the unforgettable experiences of our adventurers.
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            autoplay={{
              delay: 1500, // Increased cyclic animation speed
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-20"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto pb-4">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between border border-gray-100 relative group">
                  <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote size={60} className="text-secondary" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-1 mb-6 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < review.rating ? "fill-current" : "text-gray-200"} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-8 leading-relaxed font-body text-lg">
                      "{review.review}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto relative z-10">
                    <div>
                      <h4 className="font-heading font-bold text-gray-900 text-lg">{review.name}</h4>
                      <span className="text-sm font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full mt-1 inline-block">{review.platform}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ReviewCarousel;
