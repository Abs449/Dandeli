import * as cheerio from "cheerio";

const STATE_GEN_URL = "https://kptclsldc.in/StateGen.aspx";

export async function fetchSupaValue() {
  const response = await fetch(STATE_GEN_URL);

  if (!response.ok) {
    throw new Error(`SLDC request failed with status ${response.status}`);
  }

  const html = await response.text();

  const $ = cheerio.load(html);

  const supaText = $("#lblsupatot").text().trim();

  if (!supaText) {
    throw new Error("SUPA value was not found in the SLDC page");
  }

  const supaValue = Number(supaText);

  if (Number.isNaN(supaValue)) {
    throw new Error(`Invalid SUPA value received: ${supaText}`);
  }

  return supaValue;
}
