/**
 * Shared smooth-scroll utility.
 *
 * Single module-level animation-frame token means calling smoothScrollTo()
 * again automatically cancels any in-flight scroll animation, so Navbar and
 * Home never fight over window.scrollTo() in the same frame.
 *
 * Duration scales with scroll distance so intermediate sections are always
 * visible rather than being rushed past.
 */
let frame = null;

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const smoothScrollTo = (targetTop, duration = 1200) => {
  if (frame) {
    cancelAnimationFrame(frame);
    frame = null;
  }

  const start = window.scrollY;
  const distance = targetTop - start;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);

    // behavior: 'auto' explicitly overrides any CSS `scroll-behavior: smooth`
    // that might get added later — without it, browsers can layer their own
    // smoothing on top of every scrollTo() call in this loop and cause
    // exactly the "speeds up abruptly" stutter.
    window.scrollTo({
      top: start + distance * easeInOutCubic(progress),
      left: 0,
      behavior: 'auto',
    });

    if (progress < 1) {
      frame = requestAnimationFrame(step);
    } else {
      frame = null;
    }
  };

  frame = requestAnimationFrame(step);
};

export const scrollToElement = (targetId, navbarHeight = 80, duration = 1200) => {
  if (typeof window === 'undefined') return;

  const target = document.getElementById(targetId);
  if (!target) return;

  const targetTop =
    target.getBoundingClientRect().top + window.scrollY - navbarHeight;

  smoothScrollTo(targetTop, duration);
};