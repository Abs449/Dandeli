# GEMINI.md - Dandeli Adventure Project Context & Guidelines

## 1. Project Overview & Architecture

**Dandeli Adventure** is a lead-generation web platform for Dandeli Kali River Rafting and outdoor adventure experiences. The repository is structured as a decoupled monorepo containing a React frontend SPA (`client/`) and a lightweight Express backend scraping service (`server/`).

### System Architecture
```text
Browser Client (React 19 + Vite 8)
  │
  ├─► Supabase (Public Content Reads & Protected Booking Inserts)
  ├─► Google Apps Script Web App (Optional non-blocking Google Sheets lead logging)
  └─► Express API (Scrapes Karnataka SLDC page for live SUPA dam release status)
```

- **Frontend (`client/`)**: Modern single-page application (SPA) featuring marketing sections, interactive service/package showcases, reviews, and a multi-field booking inquiry form with client-side validation.
- **Backend (`server/`)**: Scraper API serving water release status based on the live Karnataka SLDC SUPA dam value.
- **Data Layer**: Supabase Postgres database with Row-Level Security (RLS) policies. Content defaults to local seed data (`client/src/data/seedData.js`) if Supabase is unconfigured or unreachable.

---

## 2. Tech Stack

| Component | Technology | Description / Usage |
| --- | --- | --- |
| **Frontend Framework** | React 19, React Router v7 | Client-side routing (`/` and `/booking`) |
| **Build Tooling** | Vite 8, ES Modules | High-performance client build & HMR |
| **Styling & UI** | Tailwind CSS v4, Framer Motion | Responsive layout, custom theme tokens in `client/src/index.css` |
| **UI Components** | Swiper, Lucide React, React Icons | Review carousel (lazy-loaded), consistent visual icon set |
| **Form Management** | React Hook Form | Booking form state management & schema validation |
| **Data & Integrations**| Supabase JS SDK, Google Apps Script | Content fetching, database persistence, optional lead mirror |
| **Backend Runtime** | Node.js (ES Modules), Express 5 | Web server for scraper utility |
| **Scraper / HTML Parsing** | Cheerio, CORS, dotenv | HTML extraction from `https://kptclsldc.in/StateGen.aspx` |
| **Linting & Tooling** | Oxlint, Nodemon | Fast JavaScript/React linting & backend live reload |

---

## 3. Directory Structure

```text
.
├── client/
│   ├── google-apps-script/     # Apps Script code (`Code.gs`) & setup instructions
│   ├── public/                 # Static web assets (favicon, images, logo)
│   ├── src/
│   │   ├── components/        # UI components (Hero, Navbar, Services, Packages, etc.)
│   │   ├── data/              # Fallback static datasets (`seedData.js`)
│   │   ├── lib/               # Integration clients (Supabase, Sheets API, Contact config)
│   │   ├── pages/             # Route components (`Home.jsx`, `Booking.jsx`)
│   │   ├── App.jsx            # Main app shell & router setup
│   │   ├── index.css          # Core CSS variables, Tailwind directives & custom styles
│   │   └── main.jsx           # Vite entry point
│   ├── supabase/
│   │   └── schema.sql         # SQL script defining DB tables & RLS policies
│   ├── .env                   # Frontend env vars (VITE_SUPABASE_URL, etc.)
│   ├── package.json           # Frontend dependencies & scripts
│   └── vite.config.js         # Vite configuration
├── server/
│   ├── src/
│   │   ├── routes/            # Express route handlers (`damStatusRoutes.js`)
│   │   ├── app.js             # Express middleware & app setup
│   │   ├── server.js          # HTTP server listening entry point
│   │   └── supaScraperService.js # SLDC page scraper & parser
│   ├── .env                   # Server env vars (PORT)
│   └── package.json           # Server dependencies & scripts
├── Agents.md / rules.md       # Extended guidelines & prompt rules
└── README.md                  # Project introduction & setup guide
```

---

## 4. Important Modules & Key Files

### Frontend (`client/`)
- `client/src/lib/data.js`: Custom hooks (`useServices`, `usePackages`, `useReviews`) handling state loading, Supabase query execution, and fallback to `seedData.js`.
- `client/src/lib/supabase.js`: Supabase JS client initializer using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `client/src/lib/sheets.js`: Function `submitBookingToSheets()` sending non-blocking CORS POST requests to the Google Apps Script Web App.
- `client/src/lib/contact.js`: Single source of truth for business contact numbers, email, physical address, social links, and Google Maps embed URL.
- `client/src/pages/Booking.jsx`: Inquiry booking form built with `react-hook-form`. Manages validation, form state, and double dispatching (Supabase + Google Sheets).
- `client/src/components/ReviewCarousel.jsx`: Lazy-loaded carousel component for review slides.

### Backend (`server/`)
- `server/src/supaScraperService.js`: Fetches `https://kptclsldc.in/StateGen.aspx`, parses `#lblsupatot` using Cheerio, and evaluates dam water release status.
- `server/src/routes/damStatusRoutes.js`: Exposes `/api/dam-status` and `/api/health`.

---

## 5. Data Flow & Database Schema

### Booking Submission Flow
1. User completes and submits `/booking` form.
2. `Booking.jsx` validates input data using React Hook Form rules.
3. Payload is inserted into Supabase `bookings` table via `submitBooking()` (`client/src/lib/data.js`).
4. If Supabase insert succeeds, `submitBookingToSheets()` attempts a background (`no-cors`) POST to Google Apps Script.
5. User is shown a success message. (Google Sheets failure does not invalidate the user submission).

### Database Tables & Security (`client/supabase/schema.sql`)
- **`services`**: Public read-only table storing service details, prices, images, and `display_order`.
- **`packages`**: Public read-only table for bundled adventure packages.
- **`reviews`**: Public read-only table for customer testimonials and ratings.
- **`bookings`**: Write-only table for guest inquiries.
- **RLS Policies**:
  - `services`, `packages`, `reviews`: Public SELECT (`to anon using (true)`).
  - `bookings`: Public INSERT (`to anon with check (true)`). SELECT/UPDATE/DELETE are restricted.

---

## 6. APIs

### Backend Endpoints (`server/`)
- `GET /api/health`: Returns `{ success: true, message: "Server is running." }`.
- `GET /api/dam-status`:
  - Returns `{ success: true, supaValue: <number>, isClosed: <boolean>, status: "open"|"closed", message: <string>, fetchedAt: <ISO Timestamp> }`.
  - Determines `closed` if `supaValue === 0`, `open` otherwise.
  - Returns HTTP 500 with `{ success: false, message: "Unable to determine dam status." }` on failure/parse error.

---

## 7. Development Commands & Environment Setup

### Environment Files
- **Client (`client/.env`)**:
  ```dotenv
  VITE_SUPABASE_URL=https://<your-project>.supabase.co
  VITE_SUPABASE_ANON_KEY=<your-anon-key>
  VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/<script-id>/exec
  ```
- **Server (`server/.env`)**:
  ```dotenv
  PORT=5000
  ```

### Development Scripts
Run frontend and backend in separate terminal sessions:

```bash
# Frontend Development
cd client
npm install
npm run dev      # Starts Vite dev server (default: http://localhost:5173)
npm run lint     # Runs oxlint
npm run build    # Produces production bundle in client/dist/
npm run preview  # Serves production build locally

# Backend Development
cd server
npm install
npm run dev      # Starts Express app with nodemon (default: http://localhost:5000)
npm start        # Starts Express app with Node.js
```

---

## 8. Important Conventions & Coding Guidelines

1. **Live Dam Activity Status Widget**: The Live Dam Water Activity Status badge/pill in `Hero.jsx` MUST be preserved. It consumes `GET /api/dam-status` to display real-time SUPA dam release status (Open/Closed/Loading). Never remove or bypass this widget or its backend scraping API.
2. **Strict Content & Metrics Preservation**: All marketing copy, headlines, guide details (guide cutout `clientimg.png`, quote, story modal), pricing, service descriptions, and 4 count-up metrics (5000+ Happy Travelers, 8+ Years Experience, 4.9★ Google, 100% Transparent Pricing) must remain 100% intact during UI redesigns.
3. **Color Palette & Theme Constraints**: Use the **Whitewater Teal & Crest Gold** palette (`#06b6d4` / `#22d3ee` teal/cyan accents, `#facc15` gold badges, `#021915` deep forest slate). Do NOT use generic oranges (`#ff6b00`), ambers, or purples.
4. **Navbar Design**: Keep the top fixed navigation bar layout using clean glassmorphic styling (`bg-slate-950/65 backdrop-blur-2xl border border-white/15`). Do NOT add floating lower search bars to the Hero section.
5. **Environment & Secrets**: Never expose Supabase service-role keys or private credentials in client-side code (`VITE_` variables are public in frontend bundles).
6. **Contact Information**: Always update contact numbers, social links, or physical location details in `client/src/lib/contact.js` rather than hardcoding in components.
7. **Fallback Resilience**: Ensure marketing components gracefully fallback to `client/src/data/seedData.js` when Supabase is unreachable or empty.
8. **Styling Tokens**: Tailwind CSS v4 variables and custom styles are maintained in `client/src/index.css`. Preserve responsive design conventions across mobile and desktop viewports.
9. **Linting**: Run `npm run lint` inside `client/` to verify code quality with `oxlint`.

---

## 9. Known TODOs & Improvement Areas

- **Backend CORS & Caching**: The server currently allows all origins (`cors()`). Production deployments should restrict origins and implement response caching to prevent excessive scraping of Karnataka SLDC.
- **Automated Testing**: There are currently no automated unit or end-to-end test suites (`npm test` is unconfigured).
