// Google Apps Script — Dandeli website booking lead capture
//
// 1. Open https://sheets.google.com and create a new spreadsheet.
// 2. Rename the first sheet "Bookings" and add this header row:
//      Timestamp | Full Name | Email | Phone | WhatsApp | Package | Date
//      | Adults | Children | Accommodation | Transportation | Food | Notes
// 3. In the spreadsheet, click Extensions → Apps Script.
// 4. Replace the placeholder code with this file's contents.
// 5. Click Deploy → New deployment → type "Web app".
//      Execute as: Me
//      Who has access: Anyone
//    Click Deploy, copy the Web App URL.
// 6. Paste the URL into the client/.env file as VITE_GOOGLE_SHEETS_URL.
//
// RE-DEPLOYING AFTER EDITS: Deploy → Manage deployments → pencil icon →
// Version: "New version" → Deploy. The URL stays the same, but the live
// script does NOT change until you publish a new version.
//
// Response contract (read by client/src/lib/sheets.js):
//   Apps Script web apps always answer HTTP 200 — even for errors — so the
//   real outcome is the JSON body:
//     { ok: true }                    the row was written and verified
//     { ok: true, duplicate: true }   this submission_id was already saved
//     { ok: false, error: "..." }     nothing was saved
//   `ok: true` is only returned AFTER the row is confirmed in the sheet.
//   The client must call this in normal CORS mode with a text/plain body
//   (a "simple" request, so there is no preflight) to be able to read it.

const SHEET_NAME = "Bookings";
const REQUIRED_FIELDS = ["full_name", "phone"];
const DEDUPE_SECONDS = 6 * 60 * 60; // remember submission ids for 6 hours

function doPost(e) {
  // One booking at a time, so the "row count grew" check below can't be
  // confused by a concurrent submission.
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);

    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    for (const field of REQUIRED_FIELDS) {
      if (!body[field]) {
        return _json({ ok: false, error: "Missing required field: " + field });
      }
    }

    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return _json({
        ok: false,
        error: 'Sheet "' + SHEET_NAME + '" not found',
      });
    }

    // A retry after a timeout/network blip re-sends the same submission_id.
    // Treat it as already done instead of adding a duplicate row.
    const cache = CacheService.getScriptCache();
    const dedupeKey = body.submission_id ? "sub_" + body.submission_id : null;
    if (dedupeKey && cache.get(dedupeKey)) {
      return _json({ ok: true, duplicate: true });
    }

    const rowsBefore = sheet.getLastRow();

    sheet.appendRow([
      new Date(),
      body.full_name || "",
      body.email || "",
      body.phone || "",
      body.whatsapp || "",
      body.package_name || "",
      body.preferred_date || "",
      body.adults ?? "",
      body.children ?? "",
      body.accommodation ? "Yes" : "No",
      body.transportation ? "Yes" : "No",
      body.food_package ? "Yes" : "No",
      body.special_requests || "",
    ]);

    // Force the write to commit, then confirm the sheet really grew before
    // we claim success.
    SpreadsheetApp.flush();
    if (sheet.getLastRow() <= rowsBefore) {
      return _json({ ok: false, error: "Row was not written to the sheet" });
    }

    if (dedupeKey) cache.put(dedupeKey, "1", DEDUPE_SECONDS);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String((err && err.message) || err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {
      // lock was never acquired
    }
  }
}

function doGet() {
  return _json({ ok: true, message: "Dandeli booking endpoint. Use POST." });
}

function _json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
