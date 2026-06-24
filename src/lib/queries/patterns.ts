import "server-only";

import type { DsaPattern } from "@/lib/database.types";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export async function getDsaPatterns(): Promise<DsaPattern[]> {
  const { data, error } = await supabaseAdmin()
    .from("dsa_patterns")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .order("phase", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load patterns: ${error.message}`);
  return (data as DsaPattern[] | null) ?? [];
}

export async function getDsaPattern(id: string): Promise<DsaPattern | null> {
  const { data, error } = await supabaseAdmin()
    .from("dsa_patterns")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load pattern: ${error.message}`);
  return (data as DsaPattern | null) ?? null;
}

/** Record a study touch on a pattern: set last_studied and optionally confidence. */
export async function touchDsaPattern(
  id: string,
  confidence: number | null,
  date: string,
): Promise<void> {
  const userKey = getActiveUserKey();
  const patch = {
    last_studied: date,
    ...(confidence !== null ? { current_confidence: confidence } : {}),
  } satisfies Partial<DsaPattern>;

  const { error } = await supabaseAdmin()
    .from("dsa_patterns")
    .update(patch)
    .eq("user_key", userKey)
    .eq("id", id);
  if (error) throw new Error(`Failed to update pattern: ${error.message}`);
}
