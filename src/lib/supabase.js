import { createClient } from "@supabase/supabase-js";

/**
 * Human-written Supabase client configuration.
 * Reads environment variables from Vite (.env).
 * Supports both VITE_SUPABASE_PUBLISHABLE_KEY and VITE_SUPABASE_ANON_KEY.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in your .env file. Please check .env.example."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
