import "server-only";

import { cache } from "react";

import type { ThemePreference, UserConfig } from "@/lib/database.types";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

/**
 * Read the active user's config. Memoized per request via React cache(), so the
 * layout and a page can both call it without a double round-trip.
 */
export const getUserConfig = cache(async (): Promise<UserConfig | null> => {
  const { data, error } = await supabaseAdmin()
    .from("user_config")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to load config: ${error.message}`);
  }
  return (data as UserConfig | null) ?? null;
});

/** Upsert a partial config patch for the active user. */
export async function writeUserConfig(
  patch: Partial<Omit<UserConfig, "id" | "user_key" | "created_at">>,
): Promise<void> {
  // Validated against the Row shape via `satisfies`; the client is untyped.
  const row = {
    user_key: getActiveUserKey(),
    ...patch,
  } satisfies Partial<UserConfig>;
  const { error } = await supabaseAdmin()
    .from("user_config")
    .upsert(row, { onConflict: "user_key" });
  if (error) {
    throw new Error(`Failed to save config: ${error.message}`);
  }
}

export interface ConfigCore {
  display_name: string;
  target_role: string;
  start_date: string;
  duration_weeks: number;
  daily_minutes_goal: number;
  email: string | null;
  timezone: string;
}

export type ParseResult =
  | { ok: true; values: ConfigCore }
  | { ok: false; error: string; field?: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate + coerce the profile/plan fields shared by onboarding and settings. */
export function parseConfigCore(formData: FormData): ParseResult {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const targetRole = String(formData.get("target_role") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "").trim();
  const durationWeeks = Number(formData.get("duration_weeks"));
  const dailyGoal = Number(formData.get("daily_minutes_goal"));
  const emailRaw = String(formData.get("email") ?? "").trim();
  const timezone =
    String(formData.get("timezone") ?? "").trim() || "Asia/Kolkata";

  if (!displayName)
    return { ok: false, error: "Please enter a display name.", field: "display_name" };
  if (displayName.length > 60)
    return { ok: false, error: "Display name is too long.", field: "display_name" };
  if (!targetRole)
    return { ok: false, error: "Please enter a target role.", field: "target_role" };
  if (targetRole.length > 80)
    return { ok: false, error: "Target role is too long.", field: "target_role" };
  if (!DATE_RE.test(startDate) || Number.isNaN(Date.parse(startDate)))
    return { ok: false, error: "Please pick a valid start date.", field: "start_date" };
  if (!Number.isInteger(durationWeeks) || durationWeeks < 4 || durationWeeks > 52)
    return { ok: false, error: "Duration must be between 4 and 52 weeks.", field: "duration_weeks" };
  if (!Number.isInteger(dailyGoal) || dailyGoal < 10 || dailyGoal > 180)
    return { ok: false, error: "Daily goal must be between 10 and 180 minutes.", field: "daily_minutes_goal" };
  if (emailRaw && !EMAIL_RE.test(emailRaw))
    return { ok: false, error: "That email doesn't look right.", field: "email" };

  return {
    ok: true,
    values: {
      display_name: displayName,
      target_role: targetRole,
      start_date: startDate,
      duration_weeks: durationWeeks,
      daily_minutes_goal: dailyGoal,
      email: emailRaw || null,
      timezone,
    },
  };
}

/** Read a Radix Switch's submitted value ("on" when checked). */
export function readSwitch(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

const THEMES: ThemePreference[] = ["dark", "light", "system"];
export function readTheme(formData: FormData): ThemePreference | undefined {
  const value = String(formData.get("theme") ?? "");
  return THEMES.includes(value as ThemePreference)
    ? (value as ThemePreference)
    : undefined;
}
