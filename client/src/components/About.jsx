import { motion } from 'framer-motion';
import { Shield, Clock, Leaf } from 'lucide-react';

const About = () => {
  const features = [
    {
      title: 'Safety First',
      description: 'Certified instructors and top-quality equipment ensure your safety at every turn.'
    },
    {
      title: 'Years of Experience',
      description: 'Over a decade of organizing successful, deeply immersive adventure trips in Dandeli.'
    },
    {
      title: 'Eco-conscious',
      description: 'We focus on sustainable, premium experiences that respect and preserve the untamed wild.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-green-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Staggered Image Grid */}
          <div className="w-full lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-shadow group">
                  <img 
                    src="https://images.unsplash.com/photo-1518182170546-076616fdcbfe?auto=format&fit=crop&q=80&w=600" 
                    alt="Deep Forest Canopy" 
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-shadow group">
                  <img 
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600" 
                    alt="Kayaking on calm waters" 
                    className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="pt-12 space-y-6"
              >
                <div className="overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-shadow group">
                  <img 
                    src="https://images.unsplash.com/photo-1596489813295-654dbdae3e53?auto=format&fit=crop&q=80&w=600" 
                    alt="Adventure Zipline" 
                    className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-shadow group">
                  <img 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e2655fa?auto=format&fit=crop&q=80&w=600" 
                    alt="Wildlife and Nature" 
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-semibold tracking-wide text-sm mb-6 border border-secondary/20">
              ABOUT US
            </div>
            <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-6 leading-tight">
              Your Gateway to <br/>
              <span className="text-secondary">Untamed Nature</span>
            </h2>
            <p className="text-lg text-gray-700 mb-10 font-body leading-relaxed">
              We provide unforgettable adventures while maintaining the highest 
              standards of safety, quality, and environmental stewardship.
            </p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start group">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 font-body leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
