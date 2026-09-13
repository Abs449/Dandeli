import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { smoothScrollTo, scrollToElement } from '../utils/Smoothscroll';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Transparent navbar background once user scrolls past the hero.
  // Uses IntersectionObserver instead of a scroll listener that reads
  // hero.offsetHeight — that read forces a synchronous layout reflow on
  // every scroll event, and during the RAF scroll animation that's dozens
  // of forced reflows competing with the animation for the main thread,
  // which is what causes visible stutter/jumps.
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Pause decorative CSS animations (hero pan, bubbles, floats, ripples,
    // spin) while the drawer is open. They run continuously and on
    // lower-end mobile GPUs they compete with the drawer's own transform
    // animation for compositor time — that contention is what shows up as
    // a laggy, dropped-frame hamburger menu even though its own animation
    // is only 220ms.
    document.body.classList.toggle('menu-open', isOpen);

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
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
        smoothScrollTo(0, 1000);
      }
      return;
    }

    if (location.pathname !== '/') {
      // Navigate home first, then scroll — Home.jsx reads location.state.scrollTo
      navigate('/', { state: { scrollTo: link.targetId } });
    } else {
      scrollToElement(link.targetId);
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
    { name: 'Contact',  to: '/#contact',  targetId: 'contact' }
  ];

  return (
    <>
      <nav className="fixed top-3 md:top-4 left-0 right-0 z-[100] px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div
          className="max-w-7xl mx-auto rounded-full px-6 py-3 border pointer-events-auto transition-all duration-300"
          style={{
            background: scrolled
              ? 'transparent'
              : 'rgba(2, 25, 21, 0.65)',
            borderColor: scrolled
              ? 'transparent'
              : 'rgba(255,255,255,0.12)',
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
                  backgroundColor: '#FF6B4A',
                  color: '#fff',
                  boxShadow: '0 4px 18px rgba(82,183,136,0.35)',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#62c496'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF6B4A'}
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
            style={{ willChange: 'transform, opacity' }}
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