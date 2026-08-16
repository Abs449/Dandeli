


import { motion } from "framer-motion";
import imgDji from "../assets/Backgroundimg/gallery-drone.webp";
import imgDSC1225 from "../assets/Backgroundimg/gallery-raft1.webp";
import imgDSC1226 from "../assets/Backgroundimg/gallery-raft2.webp";
import imgKayaking from "../assets/Backgroundimg/kayak-bg.webp";
import imgJungle from "../assets/Backgroundimg/gallery-jungle.webp";
import imgRiver from "../assets/Backgroundimg/river-scenery.webp";

const items = [
  {
    src: imgDji,
    alt: "Aerial view of Kali River rafting in Dandeli",
    title: "River Conquerors",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: imgKayaking,
    alt: "Kayaking session in white waters of Ganeshgudi",
    title: "White-Water Kayaking",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: imgJungle,
    alt: "Jungle river bank in Dandeli wildlife sanctuary",
    title: "Untamed Jungle Canopy",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    src: imgDSC1225,
    alt: "White water river rafting adventure team",
    title: "Rafting Crew",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: imgDSC1226,
    alt: "Paddlers tackling river rapids in Dandeli",
    title: "Tackling the Rapids",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    src: imgRiver,
    alt: "Lush landscape of Kali River flow near Ganeshgudi",
    title: "River Stays",
    span: "md:col-span-1 md:row-span-1",
  },
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-16 sm:py-20 bg-transparent border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2.5 bg-cyan-950/60 px-4 py-1 rounded-full border border-cyan-500/30 shadow-md">
            Visual Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white mb-3 drop-shadow-md tracking-wider leading-snug">
            Capturing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-200 pr-1">Adventure</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-body font-light leading-relaxed">
            Browse through real snapshots of our guests conquering the Class III rapids of the Kali River and resting under the canopy of Ganeshgudi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className={`relative overflow-hidden rounded-3xl group shadow-md hover:shadow-xl border border-[#D9E5DD] ${item.span}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-3xl"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <span className="text-xs uppercase font-bold text-[#66C7BB] tracking-widest mb-1.5 inline-block">
                  Dandeli Adventure
                </span>
                <h3 className="text-xl font-heading font-bold text-white leading-tight">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
