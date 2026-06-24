import {
  eachDayOfInterval,
  format,
  parseISO,
  startOfWeek,
  subDays,
  subWeeks,
} from "date-fns";

import { APP_TIMEZONE, todayISO } from "@/lib/date";
import type { DsaPattern, DsaProblem, Session } from "@/lib/database.types";

export interface WeekPoint {
  week: string;
  minutes: number;
  avgConfidence: number | null;
}

/** Minutes + average Spring confidence per calendar week, last `weeks` weeks. */
export function weeklyStats(
  sessions: Session[],
  weeks = 8,
  timeZone: string = APP_TIMEZONE,
): WeekPoint[] {
  // Anchor to the user's calendar day, not the server clock (UTC on Vercel), so
  // week buckets line up with how session_date is stored (see lib/date.ts).
  const now = parseISO(todayISO(timeZone));
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const ws = startOfWeek(subWeeks(now, weeks - 1 - i), { weekStartsOn: 1 });
    return {
      key: format(ws, "yyyy-MM-dd"),
      label: format(ws, "d MMM"),
      minutes: 0,
      confSum: 0,
      confN: 0,
    };
  });
  const byKey = new Map(buckets.map((b) => [b.key, b]));

  for (const s of sessions) {
    const key = format(startOfWeek(parseISO(s.session_date), { weekStartsOn: 1 }), "yyyy-MM-dd");
    const b = byKey.get(key);
    if (!b) continue;
    b.minutes += s.duration_minutes;
    if (s.spring_confidence != null) {
      b.confSum += s.spring_confidence;
      b.confN += 1;
    }
  }

  return buckets.map((b) => ({
    week: b.label,
    minutes: b.minutes,
    avgConfidence: b.confN ? Number((b.confSum / b.confN).toFixed(2)) : null,
  }));
}

export interface MoodPoint {
  mood: string;
  avgConfidence: number;
  count: number;
}

/** Average Spring confidence grouped by mood (sharp / okay / tired). */
export function moodPerformance(sessions: Session[]): MoodPoint[] {
  const order = ["sharp", "okay", "tired"];
  const map = new Map<string, { sum: number; n: number; count: number }>();
  for (const s of sessions) {
    if (!s.mood) continue;
    const e = map.get(s.mood) ?? { sum: 0, n: 0, count: 0 };
    e.count += 1;
    if (s.spring_confidence != null) {
      e.sum += s.spring_confidence;
      e.n += 1;
    }
    map.set(s.mood, e);
  }
  return order
    // Only moods with at least one Spring-confidence sample — otherwise a bar
    // at 0 reads as "measured zero" rather than "no data for this mood".
    .filter((m) => (map.get(m)?.n ?? 0) > 0)
    .map((m) => {
      const e = map.get(m)!;
      return {
        mood: m,
        avgConfidence: Number((e.sum / e.n).toFixed(2)),
        count: e.count,
      };
    });
}

export interface DsaProgressRow {
  id: string;
  title: string;
  solved: number;
  total: number;
}

export function dsaProgress(
  patterns: DsaPattern[],
  problems: DsaProblem[],
): DsaProgressRow[] {
  const total = new Map<string, number>();
  const solved = new Map<string, number>();
  for (const p of problems) {
    total.set(p.pattern_id, (total.get(p.pattern_id) ?? 0) + 1);
    if (p.outcome === "solved") {
      solved.set(p.pattern_id, (solved.get(p.pattern_id) ?? 0) + 1);
    }
  }
  return patterns.map((p) => ({
    id: p.id,
    title: p.title,
    solved: solved.get(p.id) ?? 0,
    total: total.get(p.id) ?? 0,
  }));
}

export interface DayPoint {
  date: string;
  minutes: number;
}

/** Minutes per day for the last `days` days (oldest first) — streak calendar. */
export function dailyMinutes(
  sessions: Session[],
  days = 84,
  timeZone: string = APP_TIMEZONE,
): DayPoint[] {
  const map = new Map<string, number>();
  for (const s of sessions) {
    map.set(s.session_date, (map.get(s.session_date) ?? 0) + s.duration_minutes);
  }
  // Anchor "today" to the user's calendar day so a session logged tonight in
  // Kolkata isn't dropped from the grid between 00:00–05:30 IST (UTC lag).
  const today = parseISO(todayISO(timeZone));
  return eachDayOfInterval({ start: subDays(today, days - 1), end: today }).map(
    (d) => {
      const key = format(d, "yyyy-MM-dd");
      return { date: key, minutes: map.get(key) ?? 0 };
    },
  );
}
