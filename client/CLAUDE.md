# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dandeli** is a single-page React application showcasing adventure tourism in Dandeli, India. It is a marketing/booking site for river rafting, kayaking, ziplining, and related activities, with a deep-forest earthy visual design.

The site is **no longer frontend-only**: content (services, packages, reviews) is read from a Supabase database, and booking form submissions are written to both a Supabase `bookings` table and a Google Sheet (via a Google Apps Script Web App). The seed data in `src/data/seedData.js` is the canonical shape and is also used as a fallback when Supabase isn't configured.

## Commands

All commands run from the `client/` directory:

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run oxlint (Rust-based ESLint replacement) with React plugin

There is no test runner configured.

## Tech Stack

- **React 19** with JSX (no TypeScript)
- **Vite 8** for bundling and dev server
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (uses `@theme` directive in `src/index.css`, not `tailwind.config.js` for tokens)
- **React Router 7** (`react-router-dom`) — `BrowserRouter` is set up in `App.jsx`
- **Supabase** (`@supabase/supabase-js`) for content reads and booking writes
- **Google Apps Script Web App** as a secondary lead-capture sink (writes to a Google Sheet)
- **Framer Motion** for entrance, scroll-triggered, and modal animations
- **Lottie** (`lottie-react`) for river-themed decorative animations
- **react-hook-form** for the booking form
- **Swiper** for the review carousel
- **Lucide React** + **React Icons** for iconography
- **oxlint** for linting (configured in `.oxlintrc.json` with `react` plugin)

## Environment variables

Copy `.env.example` to `.env` and fill in:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — from the Supabase project settings
- `VITE_GOOGLE_SHEETS_URL` — the `/exec` URL of the deployed Apps Script Web App (see `google-apps-script/README.md`)

The site degrades gracefully without these — `lib/supabase.js` returns `null` and `lib/data.js` falls back to the seed data so the site still renders.

## Architecture

### Routing & Layout (`src/App.jsx`)

Two routes, both wrapped in a `Navbar` + `Footer` + `FloatingButtons` (desktop only) + `BottomNav` (mobile only) shell:

- `/` → `pages/Home.jsx` — composes the marketing sections in order
- `/booking` → `pages/Booking.jsx` — react-hook-form, posts to Supabase + Sheets

`<main>` has `pt-14` to clear the fixed navbar and `pb-16 md:pb-0` to reserve space for the mobile bottom nav.

### Sections (`src/components/`)

Each is a self-contained section component, mounted sequentially in `Home.jsx`:

- `Hero` — full-viewport hero with parallax background, Lottie accent, wave divider at the bottom
- `About` — image grid + feature list, scroll-triggered animations
- `Services` — 3-up card grid, reads from `useServices()`. First 4 shown, "View All" toggle.
- `Activities` — distinct from `Services`. Same data source but a different (modal-driven) card style.
- `Packages` — **vertical stacked cards** (one per row, full-width). Each card has a `Book` button that navigates to `/booking?package=<id>`. Recommended package is highlighted with a forest-green background and gold ring.
- `Location` — Google Maps embed + contact details (data from `lib/contact.js`)
- `ReviewCarousel` — Swiper autoplay carousel of reviews
- `Footer`, `Navbar`, `FloatingButtons` (desktop-only), `BottomNav` (mobile-only) — chrome
- `LottieAccent` — small wrapper around `lottie-react` with consistent sizing

### Data flow

- **Read path**: Components call hooks from `lib/data.js` (`useServices`, `usePackages`, `useReviews`). Each hook fetches the corresponding Supabase table, ordered by `display_order`. On error or empty result, falls back to the matching array in `src/data/seedData.js`. A tiny in-memory cache avoids re-fetching on re-mount.
- **Write path (booking)**: see `lib/data.js` → `submitBooking(payload)`. Inserts into the `bookings` Supabase table. Concurrently, `lib/sheets.js` → `submitBookingToSheets(payload)` does a fire-and-forget `fetch` (with `mode: 'no-cors'`) to the Apps Script Web App. The Sheets write is best-effort — the Supabase row is the source of truth.
- **Booking form**: `react-hook-form` with field validation (email regex, phone regex, required name). On submit, both writes are attempted and the UI shows a success or error state.

### Data Model

Two source-of-truth files:

- `src/data/seedData.js` — canonical shape, also serves as the offline fallback and as a copy-paste source for the Supabase Table Editor
- `supabase/schema.sql` — table DDL + RLS policies; run this once in the Supabase SQL editor

The old `src/data/mockData.js` is still in the repo (kept by request) but no longer imported anywhere.

### Styling System

- Theme tokens defined in `src/index.css` under `@theme {}`: `primary` (#2c5f2d deep forest), `primary-dark` (#1f4520), `secondary` (#a67c52 brown), `accent` (#d4a017 gold), `background` (#f5f0e6 beige), `river` (#1e6b8c river blue), `river-light` (#5fa3c4), `foam` (#ffffff), plus `font-heading` (Merriweather) and `font-body` (Inter)
- `tailwind.config.js` is intentionally minimal — v4 reads tokens from `index.css`
- Custom utilities in `index.css`: `pattern-bg`, `card-hover`, `wave-divider*` (4 wave divider variants with inline SVG)
- Reusable section layout: `py-24` vertical padding, `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` container

### Animations

Two motion systems coexist:

- **Framer Motion** for entrance/scroll/modal animations. Standard pattern: `initial`/`whileInView` with `viewport={{ once: true, margin: '-50px' or '-100px' }}`. `AnimatePresence` + `layout` is used in the Activities modal.
- **Lottie** (`lottie-react`) for decorative looping animations. JSONs live in `client/public/lottie/` (`floaty.json`, `ripple.json`, `sparkle.json`) and are imported directly so Vite hashes them into the build. Currently used as a low-opacity background accent in the Hero.

### Contact details (`src/lib/contact.js`)

Single source of truth for phone, WhatsApp, email, address, hours, Maps URL, and social links. Update this file to change them everywhere.

## Conventions

- JSX files use default exports for components
- Imports use absolute paths from `src/` (e.g., `import { useServices } from "../lib/data"`)
- Section anchor IDs match the navbar (`#about`, `#services`, `#packages`, `#reviews`, `#activities`); in-page links use `/#<id>` to force the route back to `/` before scrolling
- Pricing is stored as a formatted string (e.g., `"₹600 per person"`, `"₹1,499"`) — no numeric type
- Always use `useNavigate()` (not `<a href="#...">`) for the Book Now button so it works regardless of current route
- The mobile bottom nav reserves space via `pb-16 md:pb-0` on `<main>`

## Gotchas

- `lucide-react` is pinned to `^1.21.0` which is an old version; newer icon names may not exist (verify with a build if you add a fresh import)
- `google-reviews-widget` was previously in `dependencies` and is no longer used; safe to remove
- The `Activities` and `Services` components read the same `services` table but render different card styles — they exist to give the home page two distinct visual sections over the same underlying data
- Supabase RLS allows anon-insert on `bookings` but not anon-select — the public can never read other people's bookings
- The Google Sheets write uses `mode: 'no-cors'`, so we can't read the response; failures are silently swallowed. Supabase is the source of truth.
- `mockData.js` is kept on disk but is not imported by any component
- `App.css` is kept as a near-empty placeholder — Vite's `index.css` holds the real theme
- No tests, no CI config

## Where to look for "what to change X"

- **Phone / email / address / social links** → `src/lib/contact.js`
- **Theme colours** → `src/index.css` (`@theme` block)
- **Section copy** → individual files in `src/components/`
- **Form fields / validation** → `src/pages/Booking.jsx`
- **Database schema** → `supabase/schema.sql`
- **Apps Script** → `google-apps-script/Code.gs` + `google-apps-script/README.md`
- **Seed data** → `src/data/seedData.js`
