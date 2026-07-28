import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Package, Star, CalendarDays, Phone } from "lucide-react";
import { CONTACT } from "../lib/contact";

// Mobile-only persistent bottom navigation. Always visible on small screens
// (hidden on md+). The `Book` button in the centre is the primary CTA —
// the same action the floating Buttons and the navbar Book Now trigger,
// but always one tap away on mobile.

const items = [
  { name: "Home", Icon: Home, to: "/", targetId: "hero" },
  { name: "Packages", Icon: Package, to: "/#packages", targetId: "packages" },
  { name: "Book", Icon: CalendarDays, to: "/booking", primary: true },
  { name: "Reviews", Icon: Star, to: "/#reviews", targetId: "reviews" },
  { name: "Call", Icon: Phone, href: `tel:${CONTACT.phoneRaw}` },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSmoothScroll = (event, targetId) => {
    event?.preventDefault();

    if (targetId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const navbarHeight = 72;
    const top =
      target.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleClick = (item) => (e) => {
    if (item.href) return; // <a> handles it
    e.preventDefault();

    if (item.targetId && location.pathname === "/") {
      handleSmoothScroll(e, item.targetId);
      return;
    }

    navigate(item.to);
  };

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] text-white"
    >
      <ul className="flex items-stretch justify-between px-2 pt-1.5 pb-2.5 safe-area-bottom">
        {items.map((item) => {
          const isActive =
            !item.href &&
            location.pathname === item.to.split("#")[0] &&
            (item.to === "/" ? location.pathname === "/" : true);

          if (item.primary) {
            return (
              <li key={item.name} className="flex-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClick(item)}
                  className="w-full flex flex-col items-center justify-center -mt-6"
                  aria-label="Book now"
                >
                  <span className="relative w-13 h-13 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/40 border-2 border-slate-900">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-30" />
                    <CalendarDays size={22} className="relative z-10" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-accent mt-1">
                    {item.name}
                  </span>
                </motion.button>
              </li>
            );
          }

          const className = `flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-colors ${
            isActive ? "text-secondary font-bold" : "text-gray-300 hover:text-white"
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
    </motion.nav>
  );
};

export default BottomNav;
