import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { seedServices, seedPackages, seedReviews } from "../data/seedData";

// In-memory cache + localStorage fallback for low-bandwidth resilience
const cache = {
  services: null,
  packages: null,
  reviews: null,
};

function getLocalCache(table) {
  try {
    const raw = localStorage.getItem(`dandeli_cache_${table}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocalCache(table, data) {
  try {
    localStorage.setItem(`dandeli_cache_${table}`, JSON.stringify(data));
  } catch {
    // ignore storage quota errors
  }
}

async function fetchOrFallback(table, fallback) {
  const cached = cache[table] || getLocalCache(table);
  if (cached) cache[table] = cached;

  if (!supabase) {
    const data = cached || fallback;
    cache[table] = data;
    return { data, source: cached ? "cache" : "seed" };
  }

  try {
    // 3.5-second network timeout for slow 2G/3G connections
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Network timeout")), 3500)
    );

    const supabasePromise = supabase
      .from(table)
      .select("*")
      .order("display_order", { ascending: true });

    const result = await Promise.race([supabasePromise, timeoutPromise]);
    const { data, error } = result || {};

    if (error || !data || data.length === 0) {
      const dataToUse = cached || fallback;
      cache[table] = dataToUse;
      return { data: dataToUse, source: cached ? "cache" : "seed", error: error?.message };
    }

    cache[table] = data;
    setLocalCache(table, data);
    return { data, source: "supabase" };
  } catch (err) {
    const dataToUse = cached || fallback;
    cache[table] = dataToUse;
    return { data: dataToUse, source: cached ? "cache" : "seed", error: err?.message };
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
    // If Supabase is not configured (e.g. local dev / preview),
    // save to localStorage as a mock database and simulate a successful booking response.
    // This allows the booking flow and loading spinner to be fully functional and testable!
    try {
      const mockBookings = JSON.parse(localStorage.getItem("mock_bookings") || "[]");
      mockBookings.push({
        id: Date.now(),
        created_at: new Date().toISOString(),
        ...payload
      });
      localStorage.setItem("mock_bookings", JSON.stringify(mockBookings));
      
      // Simulate a small network delay for a realistic loading spinner experience
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ok: true, source: "mock-storage" };
    } catch {
      return { ok: true, source: "mock-memory" }; // Always succeed in fallback
    }
  }
  try {
    const { error } = await supabase.from("bookings").insert([payload]);
    if (error) return { ok: false, reason: "db-error", error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: "exception", error: err?.message };
  }
}
