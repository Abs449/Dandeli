import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { CONTACT } from '../lib/contact';

const FloatingButtons = () => {
  // Hidden on mobile (md:flex) — the BottomNav already has a Call item.
  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-40 flex-col space-y-4">
      <a
        href={`https://wa.me/${CONTACT.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
      <a
        href={`tel:${CONTACT.phoneRaw}`}
        className="w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Call us"
      >
        <FaPhoneAlt size={22} />
      </a>
    </div>
  );
};

export default FloatingButtons;
