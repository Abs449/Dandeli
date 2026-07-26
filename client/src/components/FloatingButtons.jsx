import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { CONTACT } from "../lib/contact";

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6 sm:gap-4">
      <a
        href={`https://wa.me/${CONTACT.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 active:scale-95 sm:h-14 sm:w-14 sm:hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7" />
      </a>
      <a
        href={`tel:${CONTACT.phoneRaw}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform duration-200 active:scale-95 sm:h-14 sm:w-14 sm:hover:scale-110"
        aria-label="Call us"
      >
        <FaPhoneAlt className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
      </a>
    </div>
  );
};

export default FloatingButtons;
