import { motion } from 'framer-motion';
import { MapPinned, Phone, Clock, Navigation, Mail } from 'lucide-react';
import { CONTACT } from '../lib/contact';

const items = [
  {
    Icon: MapPinned,
    title: 'Address',
    body: CONTACT.address.split(',').map((line, i) => (
      <span key={i} className="block">
        {line.trim()}
        {i < CONTACT.address.split(',').length - 1 ? ',' : ''}
      </span>
    )),
  },
  {
    Icon: Phone,
    title: 'Contact',
    body: <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-secondary">{CONTACT.phone}</a>,
  },
  {
    Icon: Mail,
    title: 'Email',
    body: (
      <a href={`mailto:${CONTACT.email}`} className="hover:text-secondary">
        {CONTACT.email}
      </a>
    ),
  },
  {
    Icon: Clock,
    title: 'Timings',
    body: <span className="whitespace-pre-line">{CONTACT.hours.replace(' · ', '\n')}</span>,
  },
];

const Location = () => {
  return (
    <section id="location" className="py-24 bg-gradient-to-b from-[#decbb7] via-[#f4efe8] to-[#e6dbcd] relative overflow-hidden border-b border-neutral-200/40 text-gray-900">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-bold mb-3">
            Find Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-6">
            Where to Find Us
          </h2>
          <p className="text-lg text-gray-650 max-w-2xl mx-auto font-body">
            Located right on the banks of the scenic Kali River, near the famous Ganeshgudi Temple.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Basecamp Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-4xl shadow-lg border border-neutral-200/40 p-8 sm:p-10 flex flex-col justify-between text-gray-900 hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-heading font-black text-gray-900 border-b border-dashed border-neutral-200 pb-4 mb-2">
                Basecamp Details
              </h3>
              
              {items.map(({ Icon, title, body }) => (
                <div key={title} className="flex items-start group">
                  <div className="mr-4 p-3 rounded-2xl bg-[#f0fdf4] text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 border border-neutral-200/20">
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">{title}</h3>
                    <p className="text-gray-650 leading-relaxed text-sm font-body">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100">
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 transition-all duration-300 text-white font-heading font-black text-sm tracking-wider uppercase px-8 py-4 rounded-full shadow-lg shadow-accent/15 cursor-pointer w-full sm:w-auto"
              >
                <Navigation className="w-4 h-4 animate-bounce" />
                Get GPS Directions
              </a>
            </div>
          </motion.div>

          {/* Map Frame Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-4xl overflow-hidden shadow-xl border-4 border-white relative min-h-[350px] lg:min-h-auto"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37624.31016804645!2d74.51958835320545!3d15.264852557905884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf1f8b04d05da1%3A0xbc49363b1f706ea6!2sDandeli%20Kali%20River%20Rafting%20Ganeshgudi!5e1!3m2!1sen!2sin!4v1782970301885!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dandeli Kali River Rafting — Google Maps"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
