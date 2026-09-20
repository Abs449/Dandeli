// POST a booking to the Google Apps Script Web App, which appends a row to
// the bound Google Sheet — currently the only place a booking is recorded.
//
// Apps Script always answers HTTP 200, even when the script fails, so the
// status code proves nothing: the outcome is the JSON body ({ ok: true } only
// after the script has confirmed the row is in the sheet). To read that body
// this must be a normal CORS request. A `text/plain` content type keeps it a
// "simple" request (no preflight), which Apps Script can't answer. Do NOT
// switch this back to `mode: 'no-cors'` — that makes the response opaque and
// turns every failure into a false success.
const TIMEOUT_MS = 25000;

// One id per form visit, re-sent on retries so the script can ignore a
// booking it already saved instead of adding a duplicate row.
export const newSubmissionId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export async function submitBookingToSheets(payload) {
  const url = import.meta.env.VITE_GOOGLE_SHEETS_URL;
  if (!url) {
    return { ok: false, reason: 'not-configured' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...payload, source: 'dandeli-website' }),
      signal: controller.signal,
    });

    const result = await response.json();

    if (result?.ok === true) {
      return { ok: true, duplicate: Boolean(result.duplicate) };
    }
    return { ok: false, reason: 'rejected', error: result?.error };
  } catch (err) {
    // Timeout, offline, or a non-JSON reply (e.g. an Apps Script error page).
    // We can't tell whether the row was saved, so this is NOT a success —
    // the same submission_id makes a retry safe.
    return {
      ok: false,
      reason: err?.name === 'AbortError' ? 'timeout' : 'network',
      error: err?.message,
    };
  } finally {
    clearTimeout(timer);
  }
}
