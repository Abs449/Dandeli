import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MapPinned, Phone, Clock, Navigation, Mail } from "lucide-react";
import { CONTACT } from "../lib/contact";
import bgLocation from "../assets/Backgroundimg/IMG20250524115322.jpg.jpeg";

const items = [
  {
    Icon: MapPinned,
    title: "Address",
    body: CONTACT.address.split(",").map((line, i) => (
      <span key={i} className="block">
        {line.trim()}
        {i < CONTACT.address.split(",").length - 1 ? "," : ""}
      </span>
    )),
  },
  {
    Icon: Phone,
    title: "Contact",
    body: (
      <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-emerald-700 transition-colors font-semibold">
        {CONTACT.phone}
      </a>
    ),
  },
  {
    Icon: Mail,
    title: "Email",
    body: (
      <a href={`mailto:${CONTACT.email}`} className="hover:text-emerald-700 transition-colors font-semibold">
        {CONTACT.email}
      </a>
    ),
  },
  {
    Icon: Clock,
    title: "Timings",
    body: (
      <span className="whitespace-pre-line">
        {CONTACT.hours.replace(" · ", "\n")}
      </span>
    ),
  },
];

const Location = () => {
  const sectionRef = useRef(null);

  // Scroll-linked background zoom effect with spring physics smoothing
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.15, 1.05]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.45, 0.85, 0.85, 0.45]);

  const bgScale = useSpring(rawScale, { stiffness: 90, damping: 30, restDelta: 0.0001 });
  const bgOpacity = useSpring(rawOpacity, { stiffness: 90, damping: 30, restDelta: 0.0001 });

  return (
    <section
      ref={sectionRef}
      id="location"
      className="py-20 relative overflow-hidden bg-slate-950 text-white"
    >
      {/* Scroll-Driven Background Image Layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgLocation})`,
          scale: bgScale,
          opacity: bgOpacity,
        }}
      />

      {/* Ambient Gradient Overlay for high image clarity */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-orange-400 uppercase tracking-[0.3em] text-xs font-bold mb-2.5 bg-black/40 backdrop-blur-md px-4 py-1 rounded-full border border-white/20">
            Find Us
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 drop-shadow-md">
            Where to Find Us
          </h2>
          <p className="text-base sm:text-lg text-gray-100 max-w-xl mx-auto font-body font-medium drop-shadow-sm">
            Located right on the banks of the scenic Kali River, near the famous Ganeshgudi Temple.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Basecamp Details Card — Clean Solid White & Emerald Design */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl border border-neutral-200 p-7 sm:p-9 flex flex-col justify-between text-gray-900 shadow-2xl"
          >
            <div className="space-y-5">
              <h3 className="text-2xl font-heading font-black text-gray-900 border-b border-neutral-200 pb-4 mb-2">
                Basecamp Details
              </h3>

              {items.map(({ Icon, title, body }, idx) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-start group"
                >
                  <div className="mr-4 p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-gray-900 text-base mb-0.5">
                      {title}
                    </h4>
                    <div className="text-gray-600 leading-relaxed text-sm font-body">
                      {body}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100">
              <motion.a
                whileTap={{ scale: 0.96 }}
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 transition-all duration-300 text-white font-heading font-black text-xs sm:text-sm tracking-wider uppercase px-8 py-3.5 rounded-full shadow-lg shadow-orange-600/25 cursor-pointer w-full sm:w-auto"
              >
                <Navigation className="w-4 h-4 animate-bounce" />
                Get GPS Directions
              </motion.a>
            </div>
          </motion.div>

          {/* Map Frame Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative min-h-[350px] lg:min-h-auto"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3849.1037382614873!2d74.53715757464141!3d15.262137560539378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf1f8b04d05da1%3A0xbc49363b1f706ea6!2sDandeli%20Kali%20River%20Rafting%20Ganeshgudi!5e0!3m2!1sen!2sin!4v1785007702506!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "420px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dandeli Kali River Rafting — Google Maps"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
