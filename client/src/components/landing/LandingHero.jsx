import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";

// Static banner for the standalone SEO landing pages — deliberately kept
// free of scroll-linked motion (unlike the homepage Hero) so it renders
// identically during build-time prerendering and on the client.
const LandingHero = ({ eyebrow, current, children, intro, bgImage }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#021915] text-white overflow-hidden border-b border-white/10">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#021915]/70 via-[#021915]/55 to-[#021915] pointer-events-none"
      />
      <div className="relative max-w-4xl mx-auto z-10">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-gray-300 hover:text-cyan-300 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="text-center">
          <Breadcrumbs current={current} />
          <span className="inline-block text-cyan-400 uppercase tracking-widest text-xs font-bold mb-4 bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 rounded-full">
            {eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white tracking-wider leading-snug mb-5">
            {children}
          </h1>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-body max-w-2xl mx-auto">{intro}</p>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
