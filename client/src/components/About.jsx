import { motion } from "framer-motion";
import back from "../assets/Backgroundimg/Aboutus.jpg.jpeg";

const features = [
  {
    title: "Safety First",
    description:
      "Certified instructors and top-quality equipment ensure your safety at every turn.",
  },
  {
    title: "Years of Experience",
    description:
      "Over a decade of organizing successful, deeply immersive adventure trips in Dandeli.",
  },
  {
    title: "Eco-conscious",
    description:
      "We focus on sustainable, premium experiences that respect and preserve the untamed wild.",
  },
];

const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-green-50 overflow-hidden flex items-center"
      style={{
        backgroundImage: `url(${back})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center mb-12">
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-3">
            About Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 leading-tight">
            Your Gateway to{" "}
            <span className="text-secondary">Untamed Nature</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Staggered image grid */}
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start"
          >
            <h3 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-6 leading-tight text-center lg:text-left">
              We live and breathe the river
            </h3>
            <p className="text-lg text-gray-700 mb-10 font-body leading-relaxed text-justify">
              We provide unforgettable adventures while maintaining the highest
              standards of safety, quality, and environmental stewardship. Every
              trip is led by locals who know these rapids by name.
            </p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start group">
                  <div className="mr-4 mt-1 w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                  <div>
                    <h4 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors">
                      {feature.title}
                    </h4>
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
