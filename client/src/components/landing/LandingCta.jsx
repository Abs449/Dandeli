import { Link } from "react-router-dom";

const LandingCta = ({ heading, subheading }) => (
  <section className="py-16 sm:py-20 bg-[#021915] border-t border-white/10 text-center px-4">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black uppercase text-white mb-4 tracking-wider">
      {heading}
    </h2>
    <p className="text-gray-300 max-w-xl mx-auto mb-8 font-body text-sm sm:text-base leading-relaxed">{subheading}</p>
    <Link
      to="/booking"
      className="inline-block px-10 py-4 rounded-full font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-white shadow-xl hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5"
      style={{ backgroundColor: "#FF6B4A", boxShadow: "0 6px 24px rgba(255,90,31,0.35)" }}
    >
      Book Your Adventure Now
    </Link>
  </section>
);

export default LandingCta;
