import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * Custom smooth-scroll with RAF + ease-in-out-cubic easing.
 * Duration scales with scroll distance so you always see intermediate sections.
 * The browser's built-in smooth scroll rushes past content — this doesn't.
 */
const smoothScrollTo = (targetTop, baseDuration = 1100) => {
  const start = window.scrollY;
  const distance = Math.abs(targetTop - start);
  // Scale duration with distance: further = a bit longer, capped at 1800ms
  const duration = Math.min(baseDuration + distance * 0.18, 1800);
  const startTime = performance.now();

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + (targetTop - start) * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const handleSmoothScroll = (targetId) => {
  if (typeof window === 'undefined') return;
  const target = document.getElementById(targetId);
  if (!target) return;
  const navbarHeight = 80;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
  smoothScrollTo(targetTop);
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Darken navbar background slightly after user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const handleNavClick = (event, link) => {
    event?.preventDefault();
    setIsOpen(false);

    if (!link.targetId) {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (location.pathname !== '/') {
      // Navigate home first, then scroll — Home.jsx reads location.state.scrollTo
      navigate('/', { state: { scrollTo: link.targetId } });
    } else {
      handleSmoothScroll(link.targetId);
    }
  };

  const goToBooking = (e) => {
    e?.preventDefault();
    setIsOpen(false);
    navigate('/booking');
  };

  const navLinks = [
    { name: 'Home',     to: '/',          targetId: null },
    { name: 'About',    to: '/#about',    targetId: 'about' },
    { name: 'Services', to: '/#services', targetId: 'services' },
    { name: 'Packages', to: '/#packages', targetId: 'packages' },
    { name: 'Reviews',  to: '/#reviews',  targetId: 'reviews' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] py-3 md:py-4 px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div
          className="max-w-7xl mx-auto rounded-full px-6 py-3 border backdrop-blur-2xl shadow-2xl pointer-events-auto transition-all duration-300"
          style={{
            background: scrolled
              ? 'rgba(2, 25, 21, 0.88)'
              : 'rgba(2, 25, 21, 0.65)',
            borderColor: 'rgba(255,255,255,0.12)',
          }}
        >
          <div className="flex justify-between items-center h-10">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl sm:text-2xl font-heading font-bold tracking-tight flex items-center gap-1.5 group"
            >
              <span className="text-white">Dandeli</span>
              <span
                className="font-extrabold transition-colors duration-150 group-hover:opacity-80"
                style={{ color: '#e8715a' }}
              >
                Adventure
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={(event) => handleNavClick(event, link)}
                  className="font-heading text-sm font-medium tracking-wide transition-all duration-150 text-gray-300 hover:text-white py-1 cursor-pointer relative group"
                >
                  {link.name}
                  {/* Subtle underline on hover */}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-200"
                    style={{ backgroundColor: '#f5c97a' }}
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={goToBooking}
                className="px-6 py-2 rounded-full font-heading font-bold transition-all duration-150 active:scale-95 text-xs uppercase tracking-wider shadow-md cursor-pointer"
                style={{
                  backgroundColor: '#52b788',
                  color: '#fff',
                  boxShadow: '0 4px 18px rgba(82,183,136,0.35)',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#62c496'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#52b788'}
              >
                Book Now
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open menu"
                className="focus:outline-none transition-colors p-1.5 rounded-full text-white hover:bg-white/10"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-[90] flex flex-col bg-[#021915] text-white shadow-2xl md:hidden pt-24"
          >
            <div className="px-6 pt-4 pb-8 space-y-3 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={(event) => handleNavClick(event, link)}
                  className="block w-full text-left px-5 py-4 rounded-2xl text-lg font-heading font-semibold text-white/90 hover:text-white hover:bg-white/10 active:scale-98 transition-all duration-150 border border-transparent hover:border-white/10 cursor-pointer"
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-4">
                <button
                  onClick={goToBooking}
                  className="block w-full text-center px-6 py-4 rounded-2xl font-heading font-bold uppercase tracking-wider shadow-lg hover:opacity-90 active:scale-95 transition-all text-base cursor-pointer"
                  style={{
                    backgroundColor: '#FF6B4A',
                    color: '#fff',
                    boxShadow: '0 6px 24px rgba(255,90,31,0.35)',
                  }}
                >
                  Book Adventure Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
