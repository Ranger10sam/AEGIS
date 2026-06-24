-- ============================================================================
-- Aegis — full schema (CLAUDE.md §3)
-- Run this once in the Supabase SQL Editor, then seed with `npm run seed`.
--
-- Deviation from §3: timestamp columns that carry `default now()` are declared
-- NOT NULL here, matching the non-null TS Row types in src/lib/database.types.ts
-- (a DEFAULT alone does not prevent an explicit NULL). Idempotent: safe to re-run.
-- ============================================================================

-- ============ CONFIG ============
create table if not exists user_config (
  id uuid primary key default gen_random_uuid(),
  user_key text unique not null,        -- maps to the single user
  display_name text not null default 'Samprit',
  target_role text not null default 'Backend Java/Spring Boot',
  start_date date not null default current_date,
  duration_weeks int not null default 16,
  daily_minutes_goal int not null default 45,
  email text,
  timezone text not null default 'Asia/Kolkata',
  sound_enabled boolean not null default true,
  push_enabled boolean not null default false,
  theme text not null default 'dark',   -- 'dark' | 'light' | 'system'
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============ SPRING CONCEPTS ============
create table if not exists spring_concepts (
  id text not null,                     -- e.g. 'spring-ioc'
  user_key text not null,
  category text not null,               -- core|web|data|security|testing|advanced|patterns
  title text not null,
  phase int not null,                   -- 1|2|3
  description text,
  taskflow_anchor text,
  current_depth int not null default 0,       -- 0-5
  current_confidence int not null default 0,  -- 0-5
  times_studied int not null default 0,
  last_studied date,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  primary key (user_key, id)
);

-- ============ DSA PATTERNS ============
create table if not exists dsa_patterns (
  id text not null,
  user_key text not null,
  title text not null,
  phase int not null,
  description text,
  current_confidence int not null default 0,
  last_studied date,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  primary key (user_key, id)
);

-- ============ DSA PROBLEMS ============
create table if not exists dsa_problems (
  id uuid primary key default gen_random_uuid(),
  pattern_id text not null,
  user_key text not null,
  lc_number int,
  title text not null,
  difficulty text not null,             -- easy|medium|hard
  is_core boolean not null default true,
  outcome text,                         -- null|solved|needed-hint|struggled|revisit|skipped
  time_minutes int,
  last_attempted date,
  attempts int not null default 0,
  notes text,
  sort_order int not null default 0
);

-- ============ SESSIONS ============
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  session_date date not null default current_date,
  logged_at timestamptz not null default now(),
  duration_minutes int not null,
  type text not null,                   -- spring|dsa|behavioral|mock|quiz|mixed
  spring_concept_id text,
  spring_depth int,
  spring_confidence int,
  dsa_pattern_id text,
  mood text,                            -- sharp|okay|tired
  notes text,
  free_notes text
);

-- ============ INTERVIEW STORIES ============
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  project text not null default 'taskflow',
  question text not null,
  situation text,
  task text,
  action text,
  result text,
  linked_concept_ids text[],
  confidence int not null default 0,
  last_reviewed date,
  created_at timestamptz not null default now()
);

-- ============ QUIZ QUESTIONS ============
create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  category text not null,               -- spring|dsa|behavioral
  concept_id text,
  question text not null,
  answer text not null,
  difficulty text not null default 'medium',
  times_seen int not null default 0,
  times_correct int not null default 0,
  last_seen date,
  created_at timestamptz not null default now()
);

-- ============ WEEKLY REVIEWS ============
create table if not exists weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  week_label text not null,
  week_number int not null,
  words_from_you text,
  weakest_area text,
  strongest_area text,
  next_week_focus text,
  created_at timestamptz not null default now()
);

-- ============ STREAK ============
create table if not exists streak (
  user_key text primary key,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_logged_date date,
  total_days_logged int not null default 0,
  total_minutes int not null default 0
);

-- ============ PING (anti-pause heartbeat) ============
create table if not exists ping (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now()
);

-- ============ QUICK NOTES ============
create table if not exists quick_notes (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  title text,
  body text not null,
  tag text,                             -- 'spring'|'dsa'|'idea'|'mistake'
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ PUSH SUBSCRIPTIONS ============
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

-- ============ INDEXES (hot read paths) ============
create index if not exists idx_spring_concepts_user on spring_concepts (user_key, phase, sort_order);
create index if not exists idx_dsa_patterns_user on dsa_patterns (user_key, phase, sort_order);
create index if not exists idx_dsa_problems_user_pattern on dsa_problems (user_key, pattern_id, sort_order);
create index if not exists idx_sessions_user_date on sessions (user_key, session_date desc);
create index if not exists idx_quiz_user_category on quiz_questions (user_key, category);
create index if not exists idx_stories_user on stories (user_key);
create index if not exists idx_quick_notes_user on quick_notes (user_key, pinned, updated_at desc);
create index if not exists idx_weekly_reviews_user on weekly_reviews (user_key, week_number desc);

-- ============ ROW LEVEL SECURITY ============
-- All access is server-side via the service role key, which BYPASSES RLS.
-- Enabling RLS with no policies is defense-in-depth: if the anon key were ever
-- used from the browser, it would see nothing (CLAUDE.md §3 security model).
alter table user_config enable row level security;
alter table spring_concepts enable row level security;
alter table dsa_patterns enable row level security;
alter table dsa_problems enable row level security;
alter table sessions enable row level security;
alter table stories enable row level security;
alter table quiz_questions enable row level security;
alter table weekly_reviews enable row level security;
alter table streak enable row level security;
alter table ping enable row level security;
alter table quick_notes enable row level security;
alter table push_subscriptions enable row level security;
