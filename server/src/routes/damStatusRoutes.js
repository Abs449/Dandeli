import express from "express";
import { getSupaValue } from "../supaScraperService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { total, unit1, unit2, readingAt, fetchedAt, stale } = await getSupaValue();

    const isClosed = total === 0;

    res.json({
      success: true,
      supaValue: total,
      unit1,
      unit2,
      isClosed,
      status: isClosed ? "closed" : "open",
      message: isClosed
        ? "Water activities are temporarily unavailable."
        : "Water activities are available.",
      readingAt,
      fetchedAt,
      stale,
    });
  } catch (error) {
    console.error("Failed to fetch SUPA values:", error);

    res.status(500).json({
      success: false,
      message: "Unable to determine dam status.",
    });
  }
});

export default router;
