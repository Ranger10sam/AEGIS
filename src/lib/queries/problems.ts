import "server-only";

import type { DsaProblem } from "@/lib/database.types";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export async function getDsaProblems(): Promise<DsaProblem[]> {
  const { data, error } = await supabaseAdmin()
    .from("dsa_problems")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .order("pattern_id", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load problems: ${error.message}`);
  return (data as DsaProblem[] | null) ?? [];
}

export async function getProblemsForPattern(
  patternId: string,
): Promise<DsaProblem[]> {
  const { data, error } = await supabaseAdmin()
    .from("dsa_problems")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .eq("pattern_id", patternId)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load problems: ${error.message}`);
  return (data as DsaProblem[] | null) ?? [];
}

/** A LeetCode outcome counts as "solved" only when explicitly solved. */
export function isSolved(p: DsaProblem): boolean {
  return p.outcome === "solved";
}
