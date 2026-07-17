# Dandeli Adventure

A responsive lead-generation website for Dandeli Kali River Rafting and outdoor adventure experiences. The project combines a React marketing site and booking form with Supabase-backed content and bookings, an optional Google Sheets lead copy, and a small Express API for the SUPA dam-status signal.

## What the application does

- Presents river rafting, kayaking, ziplining, camping, packages, location details, reviews, and contact actions.
- Provides a dedicated `/booking` inquiry form with client-side validation.
- Reads services, packages, and reviews from Supabase when it is configured; bundled seed data keeps the marketing site usable when it is not.
- Stores successful booking inquiries in Supabase, then optionally sends a non-blocking copy to Google Sheets through a Google Apps Script Web App.
- Exposes an API that reads the live SUPA value from the Karnataka SLDC page and reports whether water activities are open or closed.

## Architecture

```text
Browser
  |
  +-- React + Vite client (client/)
  |     |-- Supabase: content reads and booking inserts
  |     `-- Google Apps Script: optional best-effort Sheets copy
  |
  `-- Express API (server/)
        `-- Karnataka SLDC StateGen page: SUPA value scrape
```

The frontend and backend are separate Node projects. The frontend does not currently call the dam-status API; it can be integrated later where an activity-availability notice is needed.

## Technology stack

| Area                  | Technologies                              | Purpose                                                               |
| --------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| Frontend              | React 19, Vite 8, React Router 7          | Client rendering, development server, and routes                      |
| Styling               | Tailwind CSS 4                            | Responsive styling and theme tokens defined in `client/src/index.css` |
| UI behavior           | Framer Motion, Swiper, React Hook Form    | Section/modal animation, review carousel, and form state/validation   |
| Icons                 | Lucide React, React Icons                 | Consistent interface and social/contact icons                         |
| Data                  | Supabase JavaScript client                | Public content reads and booking inserts protected by RLS             |
| Lead-copy integration | Google Apps Script + Google Sheets        | Optional operational copy of a booking inquiry                        |
| Backend               | Node.js, Express 5, CORS, Cheerio, dotenv | HTTP API and HTML parsing of the SLDC source page                     |
| Tooling               | oxlint, nodemon                           | Client linting and backend development reloads                        |

## Repository layout

```text
.
├── client/                       # Vite/React website
│   ├── src/
│   │   ├── components/            # Marketing sections and shared UI
│   │   ├── pages/                 # Home and Booking routes
│   │   ├── lib/                   # Supabase, lead-copy, contact, and data helpers
│   │   └── data/seedData.js       # Fallback services, packages, and reviews
│   ├── supabase/schema.sql        # Tables and RLS policies
│   └── google-apps-script/        # Sheets Web App source and setup guide
└── server/                        # Express API
    └── src/
        ├── app.js                 # Middleware and route registration
        ├── server.js              # HTTP server entry point
        ├── routes/damStatusRoutes.js
        └── supaScraperService.js  # SLDC fetch and SUPA-value parsing
```

## Prerequisites

- Node.js `20.19.0+` or `22.12.0+` for the Vite 8 client.
- npm.
- A Supabase project only if live content and booking storage are required.
- A Google account only if Google Sheets lead copies are required.

## Run locally

Install and run each project in its own terminal.

```bash
cd client
npm install
npm run dev
```

```bash
cd server
npm install
npm run dev
```

Vite normally serves the website at `http://localhost:5173`; the Express server defaults to `http://localhost:5000`.

### Available commands

| Directory | Command           | Description                                                    |
| --------- | ----------------- | -------------------------------------------------------------- |
| `client`  | `npm run dev`     | Start the Vite development server with hot-module replacement. |
| `client`  | `npm run build`   | Create an optimized production bundle in `client/dist/`.       |
| `client`  | `npm run preview` | Serve the built client locally.                                |
| `client`  | `npm run lint`    | Run oxlint.                                                    |
| `server`  | `npm run dev`     | Start Express through nodemon.                                 |
| `server`  | `npm start`       | Start Express with Node.js.                                    |

There is no automated test suite configured at present.

## Environment configuration

Create `client/.env` when enabling integrations:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/.../exec
```

`VITE_` variables are embedded in the client bundle by Vite. Do not place secrets in them. The Supabase anonymous key is intended for browser use; access is limited by the row-level-security policies in the schema.

The server accepts an optional `server/.env` value:

```dotenv
PORT=5000
```

## Frontend implementation

### Routes and page composition

- `/` renders the hero, about, services, activities, packages, location, and reviews sections in that order. The Swiper review carousel is lazy-loaded so its code is deferred from the initial home-page bundle.
- `/booking` renders the inquiry form.
- `App.jsx` wraps both routes in the fixed responsive navbar, footer, and desktop-only floating WhatsApp/call actions.

The navbar changes from transparent over the home hero to a blurred white surface after scrolling. The mobile menu locks document scrolling while open. The responsive layouts are built with Tailwind breakpoints; the booking form, card grids, package layout, map, and primary actions collapse for small screens.

### Content loading and fallbacks

`client/src/lib/data.js` supplies `useServices`, `usePackages`, and `useReviews`. Each hook:

1. Returns cached data when available.
2. Otherwise requests the matching Supabase table ordered by `display_order`.
3. Uses the corresponding array in `src/data/seedData.js` when Supabase is missing, returns no rows, or errors.

This means the brochure content still renders without configuration. `src/data/mockData.js` remains in the repository but is not used by the application.

### Booking flow

The form uses React Hook Form to validate the required name, email format, phone format, party size, and optional add-ons. On submission:

1. Field values are trimmed and normalized into the booking payload.
2. `submitBooking` inserts the payload into Supabase's `bookings` table.
3. Only after that insert succeeds, `submitBookingToSheets` attempts a fire-and-forget POST to the configured Apps Script URL.
4. The user sees a success state after the Supabase write; Sheets failures do not block it.

When Supabase is not configured, the site can be browsed but submissions intentionally show an unavailable message rather than pretending a booking was saved.

The Sheets request uses `no-cors`, so the browser cannot read its response. Supabase is therefore the authoritative booking store. Follow the detailed [Google Apps Script setup guide](client/google-apps-script/README.md) to create the `Bookings` sheet and deploy `Code.gs` as a Web App.

### Site configuration

| Change                                                         | Location                       |
| -------------------------------------------------------------- | ------------------------------ |
| Phone, WhatsApp, email, address, map link, hours, social links | `client/src/lib/contact.js`    |
| Theme colors, fonts, wave animation, custom CSS utilities      | `client/src/index.css`         |
| Fallback services, packages, reviews                           | `client/src/data/seedData.js`  |
| Form fields and validation                                     | `client/src/pages/Booking.jsx` |
| Individual section copy and layout                             | `client/src/components/`       |

## Supabase data model and security

Run `client/supabase/schema.sql` once in the Supabase SQL editor. It creates:

| Table      | Key fields                                                                            | Client access         |
| ---------- | ------------------------------------------------------------------------------------- | --------------------- |
| `services` | name, descriptions, image(s), price, duration, difficulty, equipment, `display_order` | Anonymous select      |
| `packages` | name, price, duration, activities, recommended, image, `display_order`                | Anonymous select      |
| `reviews`  | name, rating, review, platform, platform URL, `display_order`                         | Anonymous select      |
| `bookings` | contact details, package/date, guest counts, add-ons, requests, `created_at`          | Anonymous insert only |

Row-level security is enabled for all four tables. The public client can read the marketing tables and insert a booking, but it has no policy that allows reading, updating, or deleting bookings. Keep the anonymous key in the client and never expose a Supabase service-role key there.

## Dam-status API

The backend provides two endpoints:

| Endpoint              | Response                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/health`     | Basic `{ success: true, message }` health response.                                                                                                                     |
| `GET /api/dam-status` | Fetches `https://kptclsldc.in/StateGen.aspx`, parses `#lblsupatot`, and returns the numeric `supaValue`, boolean `isClosed`, string `status`, message, and `fetchedAt`. |

The status rule is deliberately simple: a parsed SUPA value of `0` reports `closed`; any other numeric value reports `open`. If the upstream page is unavailable, changes its markup, or returns a non-numeric value, the API returns HTTP `500` with `{ success: false, message: "Unable to determine dam status." }`.

Because this endpoint depends on a third-party HTML page, production use should include uptime monitoring and consider caching or a fallback message.

## Production notes

- Deploy `client/dist/` to static hosting after `npm run build`, and configure client environment values in that host's build environment.
- Configure SPA history fallback to `index.html` so direct visits to `/booking` work with `BrowserRouter`.
- Deploy `server/` as a persistent Node service and set `PORT` according to the host. It needs outbound network access to the SLDC page.
- Configure CORS more narrowly before exposing the API publicly; the current server allows all origins.
- Use real business contact/social details in `client/src/lib/contact.js` before launch.

## License

No license file is currently included. Treat the source as all rights reserved unless the project owner adds a license.
