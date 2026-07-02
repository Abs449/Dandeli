import { motion } from "framer-motion";
import { MapPinned, Phone, Clock, Navigation } from "lucide-react";

const Location = () => {
  return (
    <section
      id="location"
      className="py-24 bg-[#F8F6F2] relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-6">
            Where to Find Us
          </h2>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-body">
            Located near the Kali river near GaneshGudi Temple
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-4xl shadow-xl p-10"
          >

            <div className="space-y-8">

              <div className="flex items-start">
                <MapPinned className="w-6 h-6 text-secondary mt-1 mr-4" />

                <div>
                  <h3 className="font-bold text-xl mb-2">
                    Address
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    Dandeli River Adventures<br />
                    Kali River Road<br />
                    Ganeshgudi Temple<br />
                    Dandeli, Karnataka
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-6 h-6 text-secondary mt-1 mr-4" />

                <div>
                  <h3 className="font-bold text-xl mb-2">
                    Contact
                  </h3>

                  <p className="text-gray-600">
                    +91 XXXXX XXXXX
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-secondary mt-1 mr-4" />

                <div>
                  <h3 className="font-bold text-xl mb-2">
                    Timings
                  </h3>

                  <p className="text-gray-600">
                    Open Daily <br />
                    7:00 AM – 8:00 PM
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent hover:bg-orange-600 transition-all duration-300 text-white font-semibold px-6 py-3 rounded-xl shadow-md"
              >
                <Navigation className="w-5 h-5" />
                Get Directions
              </a>

            </div>

          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-4xl overflow-hidden shadow-2xl"
          >

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37624.31016804645!2d74.51958835320545!3d15.264852557905884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf1f8b04d05da1%3A0xbc49363b1f706ea6!2sDandeli%20Kali%20River%20Rafting%20Ganeshgudi!5e1!3m2!1sen!2sin!4v1782970301885!5m2!1sen!2sin"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />

          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Location;