export const APP_TIMEZONE = "Asia/Kolkata";

/**
 * Today's calendar date as YYYY-MM-DD in the given IANA timezone.
 *
 * Use this instead of `new Date().toISOString().slice(0,10)` for session dates,
 * streak days, and start-date defaults: the latter is UTC, so for a Kolkata user
 * (UTC+5:30) it reports the previous day between 00:00 and 05:30 local — which
 * would mis-date sessions and break the streak boundary (CLAUDE.md North Star).
 */
export function todayISO(timeZone: string = APP_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Current hour (0–23) in the given timezone — for time-of-day greetings. */
export function hourInTimezone(timeZone: string = APP_TIMEZONE): number {
  const hour = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone,
  }).format(new Date());
  return Number(hour) % 24;
}
