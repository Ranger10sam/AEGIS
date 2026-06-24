import "server-only";

import type { Mood, Session, SessionType } from "@/lib/database.types";
import { todayISO } from "@/lib/date";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export interface NewSession {
  session_date: string;
  duration_minutes: number;
  type: SessionType;
  spring_concept_id?: string | null;
  spring_depth?: number | null;
  spring_confidence?: number | null;
  dsa_pattern_id?: string | null;
  mood?: Mood | null;
  notes?: string | null;
  free_notes?: string | null;
}

export async function insertSession(session: NewSession): Promise<void> {
  const row = {
    user_key: getActiveUserKey(),
    ...session,
  } satisfies Partial<Session>;
  const { error } = await supabaseAdmin().from("sessions").insert(row);
  if (error) throw new Error(`Failed to log session: ${error.message}`);
}

export async function getRecentSessions(limit = 6): Promise<Session[]> {
  const { data, error } = await supabaseAdmin()
    .from("sessions")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .order("session_date", { ascending: false })
    .order("logged_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Failed to load sessions: ${error.message}`);
  return (data as Session[] | null) ?? [];
}

export async function getSessionsForConcept(
  conceptId: string,
  limit = 20,
): Promise<Session[]> {
  const { data, error } = await supabaseAdmin()
    .from("sessions")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .eq("spring_concept_id", conceptId)
    .order("session_date", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Failed to load concept history: ${error.message}`);
  return (data as Session[] | null) ?? [];
}

export async function getSessionsForPattern(
  patternId: string,
  limit = 20,
): Promise<Session[]> {
  const { data, error } = await supabaseAdmin()
    .from("sessions")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .eq("dsa_pattern_id", patternId)
    .order("session_date", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Failed to load pattern history: ${error.message}`);
  return (data as Session[] | null) ?? [];
}

export async function getAllSessions(): Promise<Session[]> {
  const { data, error } = await supabaseAdmin()
    .from("sessions")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .order("session_date", { ascending: true });
  if (error) throw new Error(`Failed to load sessions: ${error.message}`);
  return (data as Session[] | null) ?? [];
}

/** Total minutes studied today (in the user's timezone) — fills the Today ring. */
export async function getTodayMinutes(timeZone: string): Promise<number> {
  const { data, error } = await supabaseAdmin()
    .from("sessions")
    .select("duration_minutes")
    .eq("user_key", getActiveUserKey())
    .eq("session_date", todayISO(timeZone));
  if (error) throw new Error(`Failed to load today's sessions: ${error.message}`);
  const rows = (data as { duration_minutes: number }[] | null) ?? [];
  return rows.reduce((sum, r) => sum + (r.duration_minutes ?? 0), 0);
}
