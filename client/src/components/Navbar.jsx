import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/#services' },
    { name: 'Packages', path: '/#packages' },
    { name: 'Reviews', path: '/#reviews' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-60 transition-all duration-300 bg-transparent border-b border-black/10 py-2`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              className={`text-2xl font-heading font-extrabold transition-colors duration-300 ${
                scrolled ? 'text-secondary' : 'text-white'
              }`}
            >
              Dandeli<span className="text-accent drop-shadow-sm">Adventure</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${
                  scrolled
                    ? 'text-gray-700 hover:text-secondary'
                    : 'text-gray-100 hover:text-white drop-shadow-md'
                }`}
              >
                {link.name}
              </a>
            ))}
              <a
                href="#booking"
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  scrolled
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                Book Now
              </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-colors ${
                scrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Full‑Screen Drawer */}
    {isOpen && (
      <div className="fixed inset-0 z-80 flex flex-col bg-white shadow-2xl">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-800 focus:outline-none"
          >
            <X size={28} />
          </button>
        </div>
        {/* Links */}
        <div className="px-4 pt-4 pb-6 space-y-4 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-800 hover:text-white hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/booking"
            className="block w-full text-center mt-6 bg-accent text-white px-6 py-4 rounded-xl font-bold shadow-md hover:bg-orange-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Book Now
          </Link>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
