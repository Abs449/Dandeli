import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { CONTACT } from "../lib/contact";

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-3 sm:right-6 sm:gap-4">
      <a
        href={CONTACT.socials.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-200 active:scale-95 sm:h-14 sm:w-14 sm:hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7" />
      </a>
      <a
        href={`tel:${CONTACT.phoneRaw}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-xl transition-transform duration-200 active:scale-95 sm:h-14 sm:w-14 sm:hover:scale-110"
        aria-label="Call us"
      >
        <FaPhoneAlt className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
      </a>
    </div>
  );
};

export default FloatingButtons;
