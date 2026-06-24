import "server-only";

import type { WeeklyReview } from "@/lib/database.types";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export async function getWeeklyReviews(): Promise<WeeklyReview[]> {
  const { data, error } = await supabaseAdmin()
    .from("weekly_reviews")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .order("week_number", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load reviews: ${error.message}`);
  return (data as WeeklyReview[] | null) ?? [];
}

export interface WeeklyInput {
  week_label: string;
  week_number: number;
  words_from_you: string | null;
  weakest_area: string | null;
  strongest_area: string | null;
  next_week_focus: string | null;
}

export async function createWeeklyReview(input: WeeklyInput): Promise<void> {
  const row = { user_key: getActiveUserKey(), ...input } satisfies Partial<WeeklyReview>;
  const { error } = await supabaseAdmin().from("weekly_reviews").insert(row);
  if (error) throw new Error(`Failed to save review: ${error.message}`);
}
