import "server-only";

import type { SpringConcept } from "@/lib/database.types";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export async function getSpringConcepts(): Promise<SpringConcept[]> {
  const { data, error } = await supabaseAdmin()
    .from("spring_concepts")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .order("phase", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load concepts: ${error.message}`);
  return (data as SpringConcept[] | null) ?? [];
}

export async function getSpringConcept(
  id: string,
): Promise<SpringConcept | null> {
  const { data, error } = await supabaseAdmin()
    .from("spring_concepts")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load concept: ${error.message}`);
  return (data as SpringConcept | null) ?? null;
}

/** Record a study touch on a concept: set depth/confidence, bump times_studied. */
export async function touchSpringConcept(
  id: string,
  depth: number,
  confidence: number,
  date: string,
): Promise<void> {
  const userKey = getActiveUserKey();
  const { data } = await supabaseAdmin()
    .from("spring_concepts")
    .select("*")
    .eq("user_key", userKey)
    .eq("id", id)
    .maybeSingle();

  const timesStudied = ((data as SpringConcept | null)?.times_studied ?? 0) + 1;
  const patch = {
    current_depth: depth,
    current_confidence: confidence,
    times_studied: timesStudied,
    last_studied: date,
  } satisfies Partial<SpringConcept>;

  const { error } = await supabaseAdmin()
    .from("spring_concepts")
    .update(patch)
    .eq("user_key", userKey)
    .eq("id", id);
  if (error) throw new Error(`Failed to update concept: ${error.message}`);
}
