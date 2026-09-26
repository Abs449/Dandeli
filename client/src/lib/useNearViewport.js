import { useEffect, useState } from "react";

// True once `ref`'s element is within `margin` of the viewport; stays true.
//
// Used to hold back decorative section background images. Pages are
// prerendered, and an inline `background-image` in the HTML is fetched the
// moment the parser sees it — CSS backgrounds can't be lazy-loaded natively
// the way <img loading="lazy"> can. With every section in the initial HTML,
// that meant ~2MB of below-the-fold backgrounds competing for bandwidth with
// the hero image (the LCP element) on mobile connections.
//
// Starts false on the server and on the first client render, so hydration
// markup matches.
export const useNearViewport = (ref, margin = "400px") => {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin, near]);

  return near;
};
