import { differenceInCalendarDays, parseISO } from "date-fns";

export interface StreakState {
  current_streak: number;
  longest_streak: number;
  last_logged_date: string | null;
  total_days_logged: number;
  total_minutes: number;
}

/**
 * Pure streak transition. Given the previous streak (or null for a first-ever
 * log) and a newly logged session, return the new state:
 *  - same day  → add minutes only (streak/day count unchanged)
 *  - next day  → extend the streak
 *  - a gap     → reset the streak to 1
 *  - backfill an earlier day → add minutes only, don't disturb the streak
 */
export function computeStreak(
  prev: StreakState | null,
  sessionDate: string,
  durationMinutes: number,
): StreakState {
  const minutes = Math.max(0, Math.round(durationMinutes));

  if (!prev || !prev.last_logged_date) {
    return {
      current_streak: 1,
      longest_streak: Math.max(prev?.longest_streak ?? 0, 1),
      last_logged_date: sessionDate,
      total_days_logged: (prev?.total_days_logged ?? 0) + 1,
      total_minutes: (prev?.total_minutes ?? 0) + minutes,
    };
  }

  const total_minutes = prev.total_minutes + minutes;
  const diff = differenceInCalendarDays(
    parseISO(sessionDate),
    parseISO(prev.last_logged_date),
  );

  // Same day or backfilling an earlier day → minutes only.
  if (diff <= 0) {
    return { ...prev, total_minutes };
  }

  const current_streak = diff === 1 ? prev.current_streak + 1 : 1;
  return {
    current_streak,
    longest_streak: Math.max(prev.longest_streak, current_streak),
    last_logged_date: sessionDate,
    total_days_logged: prev.total_days_logged + 1,
    total_minutes,
  };
}
