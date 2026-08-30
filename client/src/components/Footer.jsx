import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CONTACT } from '../lib/contact';

const Footer = () => {
  return (
    <footer
    id='contact' 
    className="bg-[#021915] text-white pt-16 pb-24 md:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-black text-white tracking-tight">
              Dandeli<span className="text-cyan-400 font-extrabold">         Adventure</span>
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-body">
              Experience nature with our adventure tourism packages. We provide
              safe, unforgettable white-water rafting and forest experiences.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-white uppercase tracking-wider text-s">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Packages', 'Reviews'].map((item) => (
                <li key={item}>
                  <a
                    href={item == 'Home' ? '/' : `/#${item.toLowerCase()}`}
                    className="text-gray-300 text-sm md:text-base leading-relaxed font-body"
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/booking" className="text-gray-300 hover:text-amber-400 transition-colors text-sm font-body">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-white uppercase tracking-wider text-s">Contact Us</h4>
            <ul className="space-y-4 text-sm md:text-base font-body">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <a
                  href={CONTACT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 leading-relaxed hover:text-cyan-400 transition-colors"
                >
                  {CONTACT.address}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                <a href={`tel:${CONTACT.phoneRaw}`} className="text-gray-300 hover:text-cyan-400 transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="text-gray-300 hover:text-cyan-400 transition-colors">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-white uppercase tracking-wider text-s">Follow Us</h4>
            <div className="flex space-x-3">
              {[
                { href: CONTACT.socials.instagram, Icon: FaInstagram },
                { href: CONTACT.socials.facebook, Icon: FaFacebookF },
                { href: CONTACT.socials.whatsapp, Icon: FaWhatsapp },
                { href: CONTACT.socials.youtube, Icon: FaYoutube },
              ].map(({ href, Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-900 border border-white/15 flex items-center justify-center text-gray-300 hover:bg-cyan-500 hover:text-slate-950 transition-all duration-300 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 text-center text-xs text-gray-400 font-body">
          <p>
            © {new Date().getFullYear()} {CONTACT.businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
