"use server";

import { revalidatePath } from "next/cache";

import type { Mood, SessionType } from "@/lib/database.types";
import { todayISO } from "@/lib/date";
import type { FormState } from "@/lib/form-state";
import { getUserConfig } from "@/lib/queries/config";
import { touchSpringConcept } from "@/lib/queries/concepts";
import { touchDsaPattern } from "@/lib/queries/patterns";
import { insertSession } from "@/lib/queries/sessions";
import { getStreak, writeStreak } from "@/lib/queries/streak";
import { computeStreak } from "@/lib/streak";

const SESSION_TYPES: SessionType[] = [
  "spring",
  "dsa",
  "behavioral",
  "mock",
  "quiz",
  "mixed",
];
const MOODS: Mood[] = ["sharp", "okay", "tired"];

function clampRating(value: FormDataEntryValue | null): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(5, Math.max(0, Math.round(n)));
}

export async function logSession(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const type = String(formData.get("type") ?? "") as SessionType;
  if (!SESSION_TYPES.includes(type)) {
    return { error: "Pick a session type.", field: "type" };
  }

  const duration = Number(formData.get("duration_minutes"));
  if (!Number.isInteger(duration) || duration < 1 || duration > 600) {
    return { error: "Duration must be between 1 and 600 minutes.", field: "duration_minutes" };
  }

  const moodRaw = String(formData.get("mood") ?? "");
  const mood: Mood | null = MOODS.includes(moodRaw as Mood)
    ? (moodRaw as Mood)
    : null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  // "Today" in the user's timezone, not UTC — so the streak day boundary is
  // local midnight (not 05:30 IST). Falls back to the app default.
  const config = await getUserConfig();
  const sessionDate = todayISO(config?.timezone);

  let springConceptId: string | null = null;
  let springDepth: number | null = null;
  let springConfidence: number | null = null;
  let dsaPatternId: string | null = null;
  let dsaConfidence: number | null = null;

  if (type === "spring") {
    springConceptId = String(formData.get("spring_concept_id") ?? "") || null;
    if (!springConceptId) {
      return { error: "Choose the concept you studied.", field: "spring_concept_id" };
    }
    springDepth = clampRating(formData.get("spring_depth"));
    springConfidence = clampRating(formData.get("spring_confidence"));
  } else if (type === "dsa") {
    dsaPatternId = String(formData.get("dsa_pattern_id") ?? "") || null;
    if (!dsaPatternId) {
      return { error: "Choose the pattern you practised.", field: "dsa_pattern_id" };
    }
    dsaConfidence = clampRating(formData.get("dsa_confidence"));
  }

  // Writes run sequentially (no cross-table transaction). The streak write is
  // last so a mid-flight failure can't double-count minutes on a manual retry;
  // the submit button is disabled while pending to avoid double-clicks.
  await insertSession({
    session_date: sessionDate,
    duration_minutes: duration,
    type,
    spring_concept_id: springConceptId,
    spring_depth: springDepth,
    spring_confidence: springConfidence,
    dsa_pattern_id: dsaPatternId,
    mood,
    notes,
  });

  if (type === "spring" && springConceptId) {
    await touchSpringConcept(
      springConceptId,
      springDepth ?? 0,
      springConfidence ?? 0,
      sessionDate,
    );
  } else if (type === "dsa" && dsaPatternId) {
    await touchDsaPattern(dsaPatternId, dsaConfidence, sessionDate);
  }

  const prev = await getStreak();
  await writeStreak(computeStreak(prev, sessionDate, duration));

  revalidatePath("/", "layout");
  return { error: null, ok: true };
}
