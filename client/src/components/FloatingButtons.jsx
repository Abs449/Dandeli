import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
      <a 
        href="https://wa.me/7075805883" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
      
      <a 
        href="tel:+917075805883" 
        className="w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Call Us"
      >
        <FaPhoneAlt size={22} />
      </a>
    </div>
  );
};

export default FloatingButtons;
