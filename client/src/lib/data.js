import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { seedServices, seedPackages, seedReviews } from "../data/seedData";

// Tiny in-memory cache so navigating between sections doesn't refetch.
const cache = {
  services: null,
  packages: null,
  reviews: null,
};

async function fetchOrFallback(table, fallback) {
  if (cache[table]) return { data: cache[table], source: "cache" };
  if (!supabase) {
    cache[table] = fallback;
    return { data: fallback, source: "seed" };
  }
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data || data.length === 0) {
      cache[table] = fallback;
      return { data: fallback, source: "seed", error: error?.message };
    }
    cache[table] = data;
    return { data, source: "supabase" };
  } catch (err) {
    cache[table] = fallback;
    return { data: fallback, source: "seed", error: err?.message };
  }
}

function useTable(table, fallback) {
  const initialData = cache[table] ?? fallback;
  const [state, setState] = useState({
    data: initialData,
    loading: false,
    error: null,
    source: cache[table] ? "cache" : "seed",
  });

  useEffect(() => {
    let cancelled = false;

    const applyResult = (res) => {
      if (cancelled) return;
      cache[table] = res.data;
      setState({
        data: res.data,
        loading: false,
        error: res.error ?? null,
        source: res.source,
      });
    };

    if (cache[table]) {
      setState({
        data: cache[table],
        loading: false,
        error: null,
        source: "cache",
      });
      return;
    }

    setState({
      data: fallback,
      loading: false,
      error: null,
      source: "seed",
    });

    fetchOrFallback(table, fallback).then(applyResult);

    return () => {
      cancelled = true;
    };
  }, [table, fallback]);

  return state;
}

export const useServices = () => useTable("services", seedServices);
export const usePackages = () => useTable("packages", seedPackages);
export const useReviews = () => useTable("reviews", seedReviews);

export async function submitBooking(payload) {
  if (!supabase) {
    // No Supabase configured — return a friendly error so the form shows it.
    return { ok: false, reason: "not-configured" };
  }
  try {
    const { error } = await supabase.from("bookings").insert([payload]);
    if (error) return { ok: false, reason: "db-error", error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: "exception", error: err?.message };
  }
}
