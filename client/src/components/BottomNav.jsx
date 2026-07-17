import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, Star, CalendarDays, Phone } from 'lucide-react';
import { CONTACT } from '../lib/contact';

// Mobile-only persistent bottom navigation. Always visible on small screens
// (hidden on md+). The `Book` button in the centre is the primary CTA —
// the same action the floating Buttons and the navbar Book Now trigger,
// but always one tap away on mobile.

const items = [
  { name: 'Home', Icon: Home, to: '/' },
  { name: 'Packages', Icon: Package, to: '/#packages' },
  { name: 'Book', Icon: CalendarDays, to: '/booking', primary: true },
  { name: 'Reviews', Icon: Star, to: '/#reviews' },
  { name: 'Call', Icon: Phone, href: `tel:${CONTACT.phoneRaw}` },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (item) => (e) => {
    if (item.href) return; // <a> handles it
    e.preventDefault();
    navigate(item.to);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
    >
      <ul className="flex items-stretch justify-between px-2 pt-1.5 pb-2 safe-area-bottom">
        {items.map((item) => {
          const isActive =
            !item.href &&
            location.pathname === item.to.split('#')[0] &&
            (item.to === '/' ? location.pathname === '/' : true);

          if (item.primary) {
            return (
              <li key={item.name} className="flex-1">
                <button
                  onClick={handleClick(item)}
                  className="w-full flex flex-col items-center justify-center -mt-5"
                  aria-label="Book now"
                >
                  <span className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/30 active:scale-95 transition-transform">
                    <CalendarDays size={22} />
                  </span>
                  <span className="text-[10px] font-semibold text-accent mt-0.5">
                    {item.name}
                  </span>
                </button>
              </li>
            );
          }

          const className = `flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors ${
            isActive ? 'text-secondary' : 'text-gray-600 hover:text-secondary'
          }`;

          const inner = (
            <>
              <item.Icon size={20} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </>
          );

          return (
            <li key={item.name} className="flex-1">
              {item.href ? (
                <a href={item.href} className={className}>
                  {inner}
                </a>
              ) : (
                <button onClick={handleClick(item)} className={className}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
