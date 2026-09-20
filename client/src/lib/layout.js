// Routes that render without the site-wide Footer. Shared by App.jsx and the
// prerender entry so the static HTML matches what the client renders —
// otherwise the footer would flash in and then disappear once JS boots.
const NO_FOOTER_PATHS = ["/rafting-in-dandeli", "/dandeli-packages"];

export const shouldShowFooter = (pathname) =>
  !NO_FOOTER_PATHS.some((path) => pathname === path || pathname === `${path}/`);
