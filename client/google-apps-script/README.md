# Google Sheets lead capture — setup

The Dandeli website sends every booking form submission to two places:

1. **Supabase** (`bookings` table) — the source of truth, with RLS so the
   public can only insert, not read.
2. **Google Sheets** (via the Apps Script in this folder) — a copy the team
   can browse, filter, and export from.

The Supabase write happens regardless. The Sheets write is best-effort and
silently skipped if `VITE_GOOGLE_SHEETS_URL` is empty.

## One-time setup

1. **Create the spreadsheet**
   - Go to [sheets.google.com](https://sheets.google.com) and create a new
     blank spreadsheet.
   - Rename the default tab to `Bookings`.

2. **Add the header row** in row 1 (case-sensitive, exact order):

   | A         | B         | C     | D     | E        | F       | G    | H      | I        | J             | K              | L    | M     |
   | --------- | --------- | ----- | ----- | -------- | ------- | ---- | ------ | -------- | ------------- | -------------- | ---- | ----- |
   | Timestamp | Full Name | Email | Phone | WhatsApp | Package | Date | Adults | Children | Accommodation | Transportation | Food | Notes |

3. **Attach the Apps Script**
   - In the spreadsheet, click **Extensions → Apps Script**.
   - Delete the placeholder `function myFunction() {}` and paste the
     contents of `Code.gs` from this folder.
   - Click the floppy-disk icon to save. Name the project "Dandeli Leads"
     (or anything you like).

4. **Deploy as a Web App**
   - Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Set **Description** to "Dandeli booking lead capture".
   - Set **Execute as** to **Me** (your Google account).
   - Set **Who has access** to **Anyone**.
   - Click **Deploy**. Authorize the script when prompted.
   - Copy the **Web app URL** — it ends in `/exec`.

5. **Wire it into the website**
   - In the `client/` folder, open `.env` (or copy `.env.example` to `.env`).
   - Set `VITE_GOOGLE_SHEETS_URL` to the URL you copied.
   - Restart the dev server.

## Verifying it works

1. Submit a test booking from the website.
2. Check the spreadsheet — a new row should appear at the bottom.
3. Also check the Supabase `bookings` table — a row should be there too.

If Sheets rows don't appear:

- Re-check the column headers match exactly.
- Re-deploy the Web App: **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**.
- The URL stays the same after re-deploying as a new version.
