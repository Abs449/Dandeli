# Google Sheets lead capture — setup

The Dandeli website sends every booking form submission to a Google Sheet via
the Apps Script in this folder. **The sheet is currently the only record of a
booking**, so the site only shows its success screen after the script has
confirmed the row is really in the sheet.

How the confirmation works: Apps Script always answers HTTP 200, even when it
fails, so the client reads the JSON body (`{ ok: true }` / `{ ok: false,
error }`) instead of the status code. That is why `client/src/lib/sheets.js`
uses a normal CORS `text/plain` POST and must never use `mode: 'no-cors'`
(which hides the response and turns every failure into a false success). Each
booking carries a `submission_id`, so a retry after a timeout never creates a
duplicate row.

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
3. Open the site's browser dev tools → Network and confirm the request to the
   script URL returns `{"ok":true}`. GA4 → Realtime should also show a
   `generate_lead` event.

If Sheets rows don't appear:

- Re-check the column headers match exactly.
- Re-deploy the Web App: **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**.
- The URL stays the same after re-deploying as a new version, **but the live
  script does not change until you do this** — editing the code alone is not
  enough. Opening the script URL in a browser should show
  `{"ok":true,"message":"Dandeli booking endpoint. Use POST."}`; a
  "Script function not found: doGet" error means an outdated version is live.
