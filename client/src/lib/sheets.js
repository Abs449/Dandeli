// Fire-and-forget POST to a Google Apps Script Web App. The Apps Script
// appends a row to the bound Google Sheet. We use `mode: 'no-cors'` because
// the script endpoint doesn't return CORS headers; with no-cors the request
// is sent and we just can't read the response. Supabase (in supabase.js) is
// the source of truth for the booking — this Sheets write is the lead-capture
// copy the client wants in their spreadsheet.
export async function submitBookingToSheets(payload) {
  const url = import.meta.env.VITE_GOOGLE_SHEETS_URL;
  if (!url) {
    // No URL configured — silently skip; Supabase write is still the source of truth.
    return { ok: false, reason: 'not-configured' };
  }

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...payload, source: 'dandeli-website' }),
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: 'network', error: err?.message };
  }
}
