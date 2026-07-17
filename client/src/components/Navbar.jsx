import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const handleSmoothScroll = (event, targetId) => {
  if (typeof window === 'undefined') {
    return;
  }

  event?.preventDefault();

  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  const navbarHeight = 72;
  const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

  window.scrollTo({ top, behavior: 'smooth' });
};

// On the home page, the navbar is fully transparent while the hero is in
// view, then becomes translucent (backdrop-blur) once the user scrolls.
// On every other route, the navbar is translucent from the moment the
// page mounts — there's no hero behind it.

const Hero_OFFSET = 80;

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
    const onScroll = () => setScrolled(window.scrollY > Hero_OFFSET);
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

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

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

  // `isHome && !scrolled` is the "over the hero" state.
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
                  onClick={(event) => {
                    if (link.targetId) {
                      handleSmoothScroll(event, link.targetId);
                      setIsOpen(false);
                      return;
                    }

                    if (location.pathname !== '/') {
                      navigate('/');
                      return;
                    }

                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`font-heading text-sm font-semibold tracking-wide transition-all duration-300 hover:text-accent relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full ${
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
      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white shadow-2xl md:hidden">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="text-gray-800 focus:outline-none"
            >
              <X size={28} />
            </button>
          </div>
          <div className="px-4 pt-2 pb-6 space-y-3 flex-1 overflow-y-auto">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={(event) => {
                  setIsOpen(false);
                  if (link.targetId) {
                    handleSmoothScroll(event, link.targetId);
                    return;
                  }

                  if (location.pathname !== '/') {
                    navigate('/');
                    return;
                  }

                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-800 hover:text-white hover:bg-secondary transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={goToBooking}
              className="block w-full text-center mt-6 bg-accent text-white px-6 py-4 rounded-xl font-bold shadow-md hover:bg-accent/90 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
