import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CONTACT } from '../lib/contact';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-white">
              Dandeli<span className="text-accent">Adventure</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience nature with our adventure tourism packages. We provide
              safe, unforgettable experiences.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Packages', 'Reviews'].map((item) => (
                <li key={item}>
                  <a
                    href={`/#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-accent transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-accent transition-colors">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-gray-400">{CONTACT.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href={`tel:${CONTACT.phoneRaw}`} className="text-gray-400 hover:text-accent">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="text-gray-400 hover:text-accent">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Follow Us</h4>
            <div className="flex space-x-4">
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
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {CONTACT.businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
