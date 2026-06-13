import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

/**
 * Browser-safe Supabase client built from NEXT_PUBLIC env vars only.
 * Returns null when the app runs without Supabase configured — every
 * caller must treat that as "feature off", never as an error.
 */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    client = null;
    return client;
  }

  try {
    client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch {
    client = null;
  }
  return client;
}

export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}
