import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/#services' },
    { name: 'Packages', path: '/#packages' },
    { name: 'Reviews', path: '/#reviews' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100/50 py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className={`text-2xl font-heading font-extrabold transition-colors duration-300 ${scrolled ? 'text-secondary' : 'text-white'}`}>
              Dandeli<span className="text-accent drop-shadow-sm">Adventure</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className={`font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${scrolled ? 'text-gray-700 hover:text-secondary' : 'text-gray-100 hover:text-white drop-shadow-md'}`}
              >
                {link.name}
              </a>
            ))}
            <Link 
              to="/booking" 
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${scrolled ? 'bg-secondary text-white hover:bg-green-800' : 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30'}`}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl absolute w-full">
          <div className="px-4 pt-4 pb-6 space-y-2">
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
    </nav>
  );
};

export default Navbar;
