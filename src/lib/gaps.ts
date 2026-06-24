import { differenceInCalendarDays, parseISO } from "date-fns";

import type { SpringConcept } from "@/lib/database.types";
import type { Phase } from "@/lib/phase";

export interface DangerAlert {
  concept: SpringConcept;
  days: number;
  weak: boolean;
}

/** Days since a concept was last studied; Infinity if never. */
function gapDays(lastStudied: string | null): number {
  if (!lastStudied) return Number.POSITIVE_INFINITY;
  return differenceInCalendarDays(new Date(), parseISO(lastStudied));
}

/**
 * Concepts at risk (CLAUDE.md §12): weak (confidence ≤ 2) and untouched ≥ 7
 * days, or any concept untouched ≥ 14 days. Limited to the current phase's
 * concepts, top 2 by staleness. Phase 1 should not surface these (encouragement
 * only) — the caller gates on phase.
 */
export function computeDangerAlerts(
  concepts: SpringConcept[],
  phase: Phase,
): DangerAlert[] {
  return concepts
    .filter((c) => c.phase <= phase && c.last_studied)
    .map((c) => {
      const days = gapDays(c.last_studied);
      const weak = c.current_confidence <= 2;
      return (weak && days >= 7) || days >= 14
        ? { concept: c, days, weak }
        : null;
    })
    .filter((x): x is DangerAlert => x !== null)
    .sort((a, b) => b.days - a.days)
    .slice(0, 2);
}

/**
 * The single concept to nudge today: lowest confidence, then stalest. In Phase 3
 * this becomes "weakest link" mode across all phases; earlier, it's limited to
 * concepts the current phase has unlocked.
 */
export function suggestTodaysFocus(
  concepts: SpringConcept[],
  phase: Phase,
): SpringConcept | null {
  const pool =
    phase >= 3 ? concepts : concepts.filter((c) => c.phase <= phase);
  return (
    [...pool].sort(
      (a, b) =>
        a.current_confidence - b.current_confidence ||
        gapDays(b.last_studied) - gapDays(a.last_studied),
    )[0] ?? null
  );
}
