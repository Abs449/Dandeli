import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In dev/preview without env vars, return a stub so the site still renders
// using the seed data fallback in lib/data.js.
const hasConfig = Boolean(url && anonKey);

export const supabase = hasConfig
  ? createClient(url, anonKey, {
      auth: { persistSession: false },
    })
  : null;

export const isSupabaseConfigured = hasConfig;
