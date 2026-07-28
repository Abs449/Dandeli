import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const handleSmoothScroll = (targetId) => {
  if (typeof window === 'undefined') return;
  const target = document.getElementById(targetId);
  if (!target) return;
  const navbarHeight = 76;
  const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
  window.scrollTo({ top, behavior: 'smooth' });
};

const HERO_OFFSET = 80;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > HERO_OFFSET);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

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
    { name: 'Home', to: '/', targetId: null },
    { name: 'About', to: '/#about', targetId: 'about' },
    { name: 'Services', to: '/#services', targetId: 'services' },
    { name: 'Packages', to: '/#packages', targetId: 'packages' },
    { name: 'Reviews', to: '/#reviews', targetId: 'reviews' },
  ];

  const overHero = isHome && !scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-3 md:py-4 px-4 sm:px-6 lg:px-8`}
      >
        <div
          className={`max-w-7xl mx-auto rounded-full transition-all duration-500 px-6 py-3 border ${
            overHero
              ? 'bg-transparent border-transparent'
              : 'bg-white/90 backdrop-blur-xl border-white/20 shadow-xl shadow-primary-dark/5'
          }`}
        >
          <div className="flex justify-between items-center h-10">
            <Link
              to="/"
              className={`text-xl sm:text-2xl font-heading font-black transition-colors duration-500 tracking-tight flex items-center gap-1`}
            >
              <span className={overHero ? 'text-white' : 'text-primary'}>Dandeli</span>
              <span className="text-accent font-extrabold">Adventure</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={(event) => handleNavClick(event, link)}
                  className={`font-heading text-sm font-semibold tracking-wide transition-all duration-300 hover:text-accent relative py-1 cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full ${
                    overHero
                      ? 'text-white/90 hover:text-white drop-shadow'
                      : 'text-gray-700'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <Link
                to="/booking"
                className="px-6 py-2 rounded-full font-bold bg-accent text-white hover:bg-accent/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 text-sm"
              >
                Book Now
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open menu"
                className={`focus:outline-none transition-colors p-1.5 rounded-full ${
                  overHero
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 flex flex-col bg-slate-900/95 backdrop-blur-2xl text-white shadow-2xl md:hidden pt-20"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <span className="font-heading font-black text-lg tracking-tight">
                <span className="text-white">Dandeli</span>{" "}
                <span className="text-accent">Menu</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 focus:outline-none transition-colors"
              >
                <X size={26} />
              </button>
            </div>

            <div className="px-6 pt-6 pb-8 space-y-4 flex-1 overflow-y-auto">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.name}
                  type="button"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 + 0.1, duration: 0.4 }}
                  onClick={(event) => handleNavClick(event, link)}
                  className="block w-full text-left px-5 py-3.5 rounded-2xl text-lg font-heading font-bold text-white/90 hover:text-white hover:bg-white/10 active:scale-98 transition-all border border-transparent hover:border-white/10 cursor-pointer"
                >
                  {link.name}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="pt-4"
              >
                <button
                  onClick={goToBooking}
                  className="block w-full text-center bg-accent text-white px-6 py-4 rounded-2xl font-heading font-black uppercase tracking-wider shadow-lg shadow-accent/25 hover:bg-accent/90 active:scale-95 transition-all text-base cursor-pointer"
                >
                  Book Adventure Now
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
