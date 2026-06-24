"use server";

import { revalidatePath } from "next/cache";

import type { FormState } from "@/lib/form-state";
import { createWeeklyReview, type WeeklyInput } from "@/lib/queries/weekly";

function text(formData: FormData, name: string): string | null {
  return String(formData.get(name) ?? "").trim() || null;
}

export async function saveWeeklyReview(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const weekNumber = Math.max(
    1,
    Math.round(Number(formData.get("week_number")) || 1),
  );
  const words = text(formData, "words_from_you");
  const weakest = text(formData, "weakest_area");
  const strongest = text(formData, "strongest_area");
  const next = text(formData, "next_week_focus");

  if (!words && !weakest && !strongest && !next) {
    return { error: "Write at least one reflection before saving." };
  }

  const input: WeeklyInput = {
    week_label: `Week ${weekNumber}`,
    week_number: weekNumber,
    words_from_you: words,
    weakest_area: weakest,
    strongest_area: strongest,
    next_week_focus: next,
  };
  await createWeeklyReview(input);
  revalidatePath("/weekly");
  return { error: null, ok: true };
}
