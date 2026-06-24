import "server-only";

import type { QuizQuestion } from "@/lib/database.types";
import { todayISO } from "@/lib/date";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  const { data, error } = await supabaseAdmin()
    .from("quiz_questions")
    .select("*")
    .eq("user_key", getActiveUserKey());
  if (error) throw new Error(`Failed to load quiz: ${error.message}`);
  return (data as QuizQuestion[] | null) ?? [];
}

/** Record a self-rated answer: bump seen, add a correct, stamp last_seen. */
export async function recordQuiz(id: string, correct: boolean): Promise<void> {
  const userKey = getActiveUserKey();
  const { data } = await supabaseAdmin()
    .from("quiz_questions")
    .select("*")
    .eq("user_key", userKey)
    .eq("id", id)
    .maybeSingle();
  const row = data as QuizQuestion | null;
  if (!row) return;

  const patch = {
    times_seen: row.times_seen + 1,
    times_correct: row.times_correct + (correct ? 1 : 0),
    last_seen: todayISO(),
  } satisfies Partial<QuizQuestion>;

  const { error } = await supabaseAdmin()
    .from("quiz_questions")
    .update(patch)
    .eq("user_key", userKey)
    .eq("id", id);
  if (error) throw new Error(`Failed to record quiz result: ${error.message}`);
}
