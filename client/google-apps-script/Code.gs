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
// The script handles CORS for us by responding with a permissive header on
// a separate `/exec` redirect — the client uses `mode: 'no-cors'` so this is
// purely informational.

const SHEET_NAME = 'Bookings';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return _json({ ok: false, error: 'Sheet "' + SHEET_NAME + '" not found' });
    }

    const body = JSON.parse(e.postData.contents || '{}');
    const row = [
      new Date(),
      body.full_name || '',
      body.email || '',
      body.phone || '',
      body.whatsapp || '',
      body.package_name || '',
      body.preferred_date || '',
      body.adults ?? '',
      body.children ?? '',
      body.accommodation ? 'Yes' : 'No',
      body.transportation ? 'Yes' : 'No',
      body.food_package ? 'Yes' : 'No',
      body.special_requests || '',
    ];

    sheet.appendRow(row);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: err.message });
  }
}

function doGet() {
  return _json({ ok: true, message: 'Dandeli booking endpoint. Use POST.' });
}

function _json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
