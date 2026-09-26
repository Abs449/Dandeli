import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The homepage is prerendered with React's static prerender API (see
// renderHome in entry-server.jsx), so it's hydrated in place: its server HTML
// stays on screen and each lazy section hydrates as its chunk arrives. Every
// other prerendered page is plain static markup (renderToStaticMarkup — no
// hydration markers), and /booking ships an empty shell, so those are
// client-rendered over as before.
if (window.location.pathname === '/' && container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('Service Worker registration failed:', err);
    });
  });
}
