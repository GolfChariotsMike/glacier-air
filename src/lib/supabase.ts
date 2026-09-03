import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "https://obtbmywqrzotvspgmaiq.supabase.co";

/** Legacy anon JWT for GolfChariotsMike's Project — already public. */
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9idGJteXdxcnpvdHZzcGdtYWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NzcwMDYsImV4cCI6MjA1MTA1MzAwNn0.8tenOBgmnxwKlFt6roAT7m8OGKmIHdxnAij6seKojsY";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || DEFAULT_ANON_KEY;

export const GALLERY_BUCKET = "glacier-air";

export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function createAnonClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
