/**
 * Hand-authored types mirroring the Supabase schema (CLAUDE.md §3). These drive
 * `createClient<Database>()` so server queries return typed rows.
 *
 * Convention: `Row` is what a SELECT returns; `Insert`/`Update` are permissive
 * (Partial) because most columns carry DB defaults and writes go through the
 * server with snake_case payloads. Postgres remains the source of truth for
 * NOT NULL / check constraints at runtime.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ── Domain enums (stored as text in Postgres) ───────────────────────────────
export type ThemePreference = "dark" | "light" | "system";
export type ConceptCategory =
  | "core"
  | "web"
  | "data"
  | "security"
  | "testing"
  | "advanced"
  | "patterns";
export type SessionType =
  | "spring"
  | "dsa"
  | "behavioral"
  | "mock"
  | "quiz"
  | "mixed";
export type Mood = "sharp" | "okay" | "tired";
export type Difficulty = "easy" | "medium" | "hard";
export type ProblemOutcome =
  | "solved"
  | "needed-hint"
  | "struggled"
  | "revisit"
  | "skipped";
export type QuizCategory = "spring" | "dsa" | "behavioral";
export type NoteTag = "spring" | "dsa" | "idea" | "mistake";
export type StudyPhase = 1 | 2 | 3;

// ── Table row shapes ─────────────────────────────────────────────────────────
export interface UserConfig {
  id: string;
  user_key: string;
  display_name: string;
  target_role: string;
  start_date: string;
  duration_weeks: number;
  daily_minutes_goal: number;
  email: string | null;
  timezone: string;
  sound_enabled: boolean;
  push_enabled: boolean;
  theme: ThemePreference;
  onboarded: boolean;
  created_at: string;
}

export interface SpringConcept {
  id: string;
  user_key: string;
  category: ConceptCategory;
  title: string;
  phase: StudyPhase;
  description: string | null;
  taskflow_anchor: string | null;
  current_depth: number;
  current_confidence: number;
  times_studied: number;
  last_studied: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
}

export interface DsaPattern {
  id: string;
  user_key: string;
  title: string;
  phase: StudyPhase;
  description: string | null;
  current_confidence: number;
  last_studied: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
}

export interface DsaProblem {
  id: string;
  pattern_id: string;
  user_key: string;
  lc_number: number | null;
  title: string;
  difficulty: Difficulty;
  is_core: boolean;
  outcome: ProblemOutcome | null;
  time_minutes: number | null;
  last_attempted: string | null;
  attempts: number;
  notes: string | null;
  sort_order: number;
}

export interface Session {
  id: string;
  user_key: string;
  session_date: string;
  logged_at: string;
  duration_minutes: number;
  type: SessionType;
  spring_concept_id: string | null;
  spring_depth: number | null;
  spring_confidence: number | null;
  dsa_pattern_id: string | null;
  mood: Mood | null;
  notes: string | null;
  free_notes: string | null;
}

export interface Story {
  id: string;
  user_key: string;
  project: string;
  question: string;
  situation: string | null;
  task: string | null;
  action: string | null;
  result: string | null;
  linked_concept_ids: string[] | null;
  confidence: number;
  last_reviewed: string | null;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  user_key: string;
  category: QuizCategory;
  concept_id: string | null;
  question: string;
  answer: string;
  difficulty: Difficulty;
  times_seen: number;
  times_correct: number;
  last_seen: string | null;
  created_at: string;
}

export interface WeeklyReview {
  id: string;
  user_key: string;
  week_label: string;
  week_number: number;
  words_from_you: string | null;
  weakest_area: string | null;
  strongest_area: string | null;
  next_week_focus: string | null;
  created_at: string;
}

export interface Streak {
  user_key: string;
  current_streak: number;
  longest_streak: number;
  last_logged_date: string | null;
  total_days_logged: number;
  total_minutes: number;
}

export interface Ping {
  id: number;
  created_at: string;
}

export interface QuickNote {
  id: string;
  user_key: string;
  title: string | null;
  body: string;
  tag: NoteTag | null;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface PushSubscription {
  id: string;
  user_key: string;
  subscription: Json;
  created_at: string;
}

// ── Supabase client shape ────────────────────────────────────────────────────
type TableTypes<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      user_config: TableTypes<UserConfig>;
      spring_concepts: TableTypes<SpringConcept>;
      dsa_patterns: TableTypes<DsaPattern>;
      dsa_problems: TableTypes<DsaProblem>;
      sessions: TableTypes<Session>;
      stories: TableTypes<Story>;
      quiz_questions: TableTypes<QuizQuestion>;
      weekly_reviews: TableTypes<WeeklyReview>;
      streak: TableTypes<Streak>;
      ping: TableTypes<Ping>;
      quick_notes: TableTypes<QuickNote>;
      push_subscriptions: TableTypes<PushSubscription>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
