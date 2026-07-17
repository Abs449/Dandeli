import * as cheerio from "cheerio";

const STATE_GEN_URL = "https://kptclsldc.in/StateGen.aspx";

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
  };
}
