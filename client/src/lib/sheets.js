// POST to a Google Apps Script Web App, which appends a row to the bound
// Google Sheet — this is currently the only place a booking is recorded.
// We use `mode: 'no-cors'` because the script endpoint doesn't return CORS
// headers, which means the response is opaque: `ok: true` here only means
// the request left the browser, not that the Apps Script actually saved
// the row. A server-side failure in the script (quota, a script error,
// revoked permissions) is invisible to this code and to the user, who
// still sees a success screen.
export async function submitBookingToSheets(payload) {
  const url = import.meta.env.VITE_GOOGLE_SHEETS_URL;
  if (!url) {
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
