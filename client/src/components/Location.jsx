import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPinned, Phone, Clock, Navigation, Mail } from "lucide-react";
import { CONTACT } from "../lib/contact";
import bgLocation from "../assets/Backgroundimg/river-scenery.webp";

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
      <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-cyan-400 transition-colors font-semibold">
        {CONTACT.phone}
      </a>
    ),
  },
  {
    Icon: Mail,
    title: "Email",
    body: (
      <a href={`mailto:${CONTACT.email}`} className="hover:text-cyan-400 transition-colors font-semibold">
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

  // Lightweight scroll transform
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.08, 1.02]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 0.95, 0.95, 0.6]);

  return (
    <section
      ref={sectionRef}
      id="location"
      className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-[#021915] text-white flex flex-col justify-center border-t border-white/10"
    >
      {/* Background Image Layer with Parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgLocation})`,
          scale: bgScale,
          opacity: bgOpacity,
        }}
      />

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021915]/60 via-[#021915]/30 to-[#021915]/65 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-block text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 bg-cyan-950/60 px-5 py-1.5 rounded-full border border-cyan-500/30 shadow-md">
            Find Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white mb-3 drop-shadow-md tracking-wider leading-snug">
            Basecamp & <span className="text-amber-400">Directions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-body font-light leading-relaxed">
            Located right on the banks of the Kali River in Ganeshgudi, Dandeli.
          </p>
        </motion.div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 bg-slate-900/90 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white mb-6 border-b border-white/10 pb-4 tracking-tight">
                {CONTACT.businessName}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
                {items.map(({ Icon, title, body }, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-cyan-300 mb-1">
                        {title}
                      </h4>
                      <div className="text-sm text-gray-200 font-body leading-relaxed">
                        {body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={CONTACT.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full py-4 bg-amber-400 hover:bg-yellow-300 text-slate-950 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-400/25 hover:-translate-y-0.5 cursor-pointer mt-4"
            >
              <Navigation size={16} />
              <span>Get GPS Directions</span>
            </a>
          </motion.div>

          {/* Embedded Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-slate-900/90 border border-white/15 rounded-3xl overflow-hidden shadow-2xl min-h-[400px] lg:min-h-[480px] relative"
          >
            <iframe
              title="Basecamp Google Map"
              src={CONTACT.mapEmbedUrl}
              className="w-full h-full min-h-[400px] border-0 transition-all duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
