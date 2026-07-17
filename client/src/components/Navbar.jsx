import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
    { name: 'Home', to: '/' },
    { name: 'About', to: '/#about' },
    { name: 'Services', to: '/#services' },
    { name: 'Packages', to: '/#packages' },
    { name: 'Reviews', to: '/#reviews' },
  ];

  // `isHome && !scrolled` is the "over the hero" state.
  const overHero = isHome && !scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          overHero
            ? 'bg-transparent border-b border-transparent py-3'
            : 'bg-white/80 backdrop-blur-md border-b border-black/10 shadow-sm py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link
              to="/"
              className={`text-2xl font-heading font-extrabold transition-colors duration-300 ${
                overHero ? 'text-white' : 'text-secondary'
              }`}
            >
              Dandeli<span className="text-accent">Adventure</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.to}
                  className={`font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${
                    overHero
                      ? 'text-white/90 hover:text-white drop-shadow'
                      : 'text-gray-700 hover:text-secondary'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={goToBooking}
                className="px-6 py-2.5 rounded-full font-semibold bg-accent text-white hover:bg-accent/90 transition-all duration-300 hover:-translate-y-0.5 shadow-md"
              >
                Book Now
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open menu"
                className={`focus:outline-none transition-colors ${
                  overHero ? 'text-white' : 'text-gray-800'
                }`}
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
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
              <a
                key={link.name}
                href={link.to}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-800 hover:text-white hover:bg-secondary transition-colors"
              >
                {link.name}
              </a>
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
