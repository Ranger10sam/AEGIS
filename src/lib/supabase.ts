import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

let client: SupabaseClient<Database> | null = null;

/**
 * Server-only Supabase client using the service role key.
 *
 * Security model (CLAUDE.md §3): all database access happens server-side; the
 * browser NEVER talks to Supabase directly and the service role key is NEVER
 * exposed to the client. `import "server-only"` makes a client-side import a
 * build error. Created lazily so a missing env var fails at use, not at build.
 */
export function supabaseAdmin(): SupabaseClient<Database> {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }

  client = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
