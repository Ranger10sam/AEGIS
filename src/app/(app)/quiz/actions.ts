"use server";

import { recordQuiz } from "@/lib/queries/quiz";

export async function recordQuizResult(
  id: string,
  correct: boolean,
): Promise<void> {
  await recordQuiz(id, correct);
}
