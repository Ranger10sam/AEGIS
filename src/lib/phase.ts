import { differenceInCalendarWeeks } from "date-fns";

export type Phase = 1 | 2 | 3;

export interface PhaseState {
  current: Phase;
  weekNumber: number;
  totalWeeks: number;
  label: string;
  description: string;
  dailyGoalMinutes: number;
  intensityUnlocked: boolean;
  progressPercent: number;
}

/**
 * Phase is always derived at runtime from start_date + duration_weeks
 * (CLAUDE.md §5). Phase 1 is "just show up"; phase 2 deepens; phase 3 is peak.
 */
export function derivePhase(
  startDate: string,
  durationWeeks: number,
  baseGoal: number,
): PhaseState {
  const start = new Date(startDate);
  const weekNumber = Math.max(
    1,
    differenceInCalendarWeeks(new Date(), start) + 1,
  );
  const phase1End = 3;
  const phase2End = Math.round(durationWeeks * 0.65);

  let current: Phase;
  let label: string;
  let description: string;
  let dailyGoalMinutes: number;

  if (weekNumber <= phase1End) {
    current = 1;
    label = "Habit Lock";
    description =
      "The only goal is showing up. Short sessions. Build the daily reflex.";
    dailyGoalMinutes = baseGoal;
  } else if (weekNumber <= phase2End) {
    current = 2;
    label = "Depth Build";
    description =
      "Go deeper. Tie every concept to TaskFlow. Patterns over problems.";
    dailyGoalMinutes = Math.round(baseGoal * 1.6);
  } else {
    current = 3;
    label = "Peak Mode";
    description =
      "Full intensity. Mocks, quizzes, weak-link drilling. Interview-ready.";
    dailyGoalMinutes = Math.round(baseGoal * 2);
  }

  const progressPercent = Math.min(
    100,
    Math.round((weekNumber / durationWeeks) * 100),
  );

  return {
    current,
    weekNumber,
    totalWeeks: durationWeeks,
    label,
    description,
    dailyGoalMinutes,
    intensityUnlocked: current >= 2,
    progressPercent,
  };
}
