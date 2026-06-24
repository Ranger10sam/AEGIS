import "server-only";

import type { Streak } from "@/lib/database.types";
import type { StreakState } from "@/lib/streak";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export async function getStreak(): Promise<Streak | null> {
  const { data, error } = await supabaseAdmin()
    .from("streak")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .maybeSingle();
  if (error) throw new Error(`Failed to load streak: ${error.message}`);
  return (data as Streak | null) ?? null;
}

export async function writeStreak(state: StreakState): Promise<void> {
  const row = { user_key: getActiveUserKey(), ...state } satisfies Partial<Streak>;
  const { error } = await supabaseAdmin()
    .from("streak")
    .upsert(row, { onConflict: "user_key" });
  if (error) throw new Error(`Failed to save streak: ${error.message}`);
}
