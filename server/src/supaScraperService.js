import * as cheerio from "cheerio";

const STATE_GEN_URL = "https://kptclsldc.in/StateGen.aspx";

// The SLDC page itself only publishes a new reading roughly every 15 minutes,
// so scraping it on every visitor request just adds latency and load on a
// government site. Every request within this window gets the stored reading;
// the first request after it expires scrapes again and replaces it.
const CACHE_TTL_MS = 5 * 60 * 1000;

let cache = null; // { total, unit1, unit2, readingAt, fetchedAt, fetchedAtMs }
let inFlight = null;

// "27/10/2026 15:30" (IST) -> ISO string, or null if the format changes.
function parseReadingTime(text) {
  const m = text.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, dd, mm, yyyy, hh, min] = m;
  return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:00+05:30`).toISOString();
}

export async function fetchSupaValue() {
  const response = await fetch(STATE_GEN_URL);

  if (!response.ok) {
    throw new Error(`SLDC request failed with status ${response.status}`);
  }

  const html = await response.text();

  const $ = cheerio.load(html);

  const supaTotText = $("#lblsupatot").text().trim();
  const supa1Text = $("#lblsupa1").text().trim();
  const supa2Text = $("#lblsupa2").text().trim();
  const dateText = $("#lbldate").text().trim();

  if (!supaTotText) {
    throw new Error("SUPA total value was not found in the SLDC page");
  }

  const total = Number(supaTotText);
  const unit1 = supa1Text ? Number(supa1Text) : 0;
  const unit2 = supa2Text ? Number(supa2Text) : 0;

  if (Number.isNaN(total)) {
    throw new Error(`Invalid SUPA total value received: ${supaTotText}`);
  }

  return {
    total,
    unit1: Number.isNaN(unit1) ? 0 : unit1,
    unit2: Number.isNaN(unit2) ? 0 : unit2,
    readingAt: parseReadingTime(dateText),
  };
}

// Returns the stored reading while it is younger than CACHE_TTL_MS, otherwise
// scrapes once (concurrent requests share the same scrape) and stores the
// result. If a refresh fails, the last good reading is served (stale: true)
// rather than an error, so a slow SLDC page doesn't flip the site to offline.
export async function getSupaValue() {
  if (cache && Date.now() - cache.fetchedAtMs < CACHE_TTL_MS) {
    return { ...cache, stale: false };
  }

  if (!inFlight) {
    inFlight = fetchSupaValue()
      .then((reading) => {
        const now = Date.now();
        cache = { ...reading, fetchedAt: new Date(now).toISOString(), fetchedAtMs: now };
        return cache;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  try {
    return { ...(await inFlight), stale: false };
  } catch (error) {
    if (cache) {
      console.error("SLDC refresh failed, serving last reading:", error);
      return { ...cache, stale: true };
    }
    throw error;
  }
}
