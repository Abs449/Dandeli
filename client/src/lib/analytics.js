// Thin wrapper over the GA4 tag in index.html. Safe to call anywhere: it does
// nothing on the server (prerender) or if gtag hasn't loaded. Never pass
// personal data (names, emails, phone numbers) as event parameters.
export const trackEvent = (name, params = {}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  // `beacon` lets the hit finish even when the click leaves the page (tel:, WhatsApp).
  window.gtag('event', name, { transport_type: 'beacon', ...params });
};
