import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "https://obtbmywqrzotvspgmaiq.supabase.co";

export const GALLERY_BUCKET = "glacier-air";

export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

function anonKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return key || undefined;
}

export function createAnonClient(): SupabaseClient | null {
  const key = anonKey();
  if (!key) return null;
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createServiceClient(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error("Photo storage is not connected.");
  }
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Public reads can use the anon key; writes always need the service role. */
export function createGalleryReadClient(): SupabaseClient | null {
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (service) {
    return createClient(SUPABASE_URL, service, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return createAnonClient();
}
