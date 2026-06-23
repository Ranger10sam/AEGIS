# CLAUDE.md — Aegis: The Interview Prep Companion

> A personal, information-rich, single-user prep companion for Samprit's job switch.
> Codename: **Aegis** (a shield — it guards your discipline and carries your progress).
> Goal: become genuinely good at Java/Spring Boot and DSA over 3–4 months.
> The job offer is a byproduct of actually becoming good — not the reverse.
>
> This is the ONE place Samprit opens every day. It must make him feel disciplined,
> motivated to return, and genuinely supported — like a superhuman study partner.

---

## 0. North Star

Aegis is not a habit tracker with interview tips bolted on. It is a daily operating
system for deliberate, structured preparation, dense with information and genuinely
useful every single day.

Five things must be true after 3–4 months of using Aegis:

1. Samprit can speak with total confidence about every annotation, pattern, and design
   decision in TaskFlow — not from rote memory but from real understanding.
2. Samprit reliably solves Medium LeetCode problems by recognising the pattern.
3. Samprit sat down nearly every day, even for 20 minutes, and never lost the thread.
4. Samprit has a bank of rehearsed, real interview stories grounded in his own work.
5. Samprit feels calm and prepared walking into interviews — not anxious and scattered.

Every feature serves those five outcomes. If a feature doesn't, cut it.

---

## 1. Design Philosophy (READ THIS BEFORE WRITING ANY UI)

**The user is a creative person and a developer. A UI flaw mid-study-session will break
his focus and ruin the experience. Design quality is a hard requirement, not a nice-to-have.**

### Non-negotiable design rules

- **No emojis as UI decoration.** None. Not in buttons, not in headers, not in empty
  states. Use a proper icon library (Lucide React) sparingly and purposefully. Icons
  are functional, never decorative filler.
- **One signature element, everything else quiet.** The boldness budget is spent in ONE
  place (see Signature below). Everything else is disciplined and calm.
- **Typography carries the personality.** Use a deliberate type pairing (see Design
  Tokens). Never the system default. Set a clear type scale.
- **No jitter, no layout shift.** Reserve space for async content. Use skeleton loaders.
  Nothing should jump when data arrives. Use CSS `min-height` and aspect-ratio locks.
- **Motion is deliberate and subtle.** Micro-interactions on hover/tap, smooth page
  transitions, a satisfying session-logged confirmation. Never gratuitous. Always respect
  `prefers-reduced-motion`.
- **End-to-end responsive.** Every single view works flawlessly from 360px (small phone)
  to 1440px+ (desktop). Test every component at 360, 768, 1024, 1440. No horizontal
  scroll ever. No cramped tap targets (min 44x44px touch targets on mobile).
- **Encouraging, not cheesy.** Copy is warm, direct, and human — never corporate, never
  fake hype. "You showed up 5 days straight." not "You're crushing it!!"
- **Dark mode first, light mode supported.** The app is used in evenings and late nights.
  Dark is the default. Both must be flawless.

### Design Tokens

**Concept:** A calm, focused command center. Think: the cockpit of someone serious about
their craft. Not a flashy SaaS dashboard. Quiet confidence.

**Color palette (dark mode primary):**
```
--bg-base:       #0E0F11   (near-black, the canvas)
--bg-surface:    #17181B   (cards, raised surfaces)
--bg-elevated:   #1F2024   (modals, popovers, inputs)
--border:        #2A2B30   (hairline borders, 1px)
--border-strong: #3A3B42   (emphasis borders, focus rings)

--text-primary:   #ECECEC   (headings, key numbers)
--text-secondary: #A0A0A8   (body, descriptions)
--text-tertiary:  #6B6B73   (hints, timestamps, captions)

--accent:         #C8A24B   (signature gold — used with extreme restraint)
--accent-soft:    #2A2418   (gold-tinted background for accent surfaces)

--success:        #5CB87A   (high confidence, completed, streak alive)
--warning:        #D9A441   (medium confidence, gaps forming)
--danger:         #D9614B   (low confidence, streak broken, overdue)
--info:           #6B9BD9   (neutral informational)
```

**Light mode palette:**
```
--bg-base:       #FAFAF8
--bg-surface:    #FFFFFF
--bg-elevated:   #FFFFFF
--border:        #E4E4E0
--border-strong: #D0D0CA
--text-primary:   #1A1A1A
--text-secondary: #555560
--text-tertiary:  #8A8A92
--accent:         #A6802E   (slightly darker gold for contrast on light)
--accent-soft:    #F5EFE0
--success:        #3E9960
--warning:        #B8852A
--danger:         #C04A34
--info:           #4A7BC0
```

**Typography:**
- Display / headings: **"Fraunces"** (a characterful serif with optical sizing) OR
  **"Instrument Serif"** for big numbers and section titles. Used with restraint.
- Body / UI: **"Inter"** (clean, neutral, excellent at small sizes) OR **"Geist"**.
- Monospace (code, LC numbers, timers): **"JetBrains Mono"** or **"Geist Mono"**.
- Load via `next/font/google` for zero layout shift.

**Type scale (rem):**
```
--text-xs:   0.75rem   (12px — captions, timestamps)
--text-sm:   0.875rem  (14px — secondary text)
--text-base: 1rem      (16px — body)
--text-lg:   1.125rem  (18px — emphasized body)
--text-xl:   1.5rem    (24px — card titles)
--text-2xl:  2rem      (32px — section heads)
--text-3xl:  3rem      (48px — the streak number, hero stats)
```

**Spacing:** Use a consistent 4px base scale (4, 8, 12, 16, 24, 32, 48, 64).

**Radius:** `--radius-sm: 6px`, `--radius-md: 10px`, `--radius-lg: 16px`. Cards use md/lg.

**Signature element:** The **"Today" ring** on the dashboard — a single, beautifully
animated circular progress indicator that fills as you complete today's session goal.
It's the emotional anchor of the whole app. Spend the design boldness here: smooth SVG
arc animation, the gold accent, a satisfying fill when you complete. Everything else
stays quiet so this shines.

### Anti-patterns to avoid (these read as AI-generated / templated)
- Cream background + serif + terracotta accent (overdone)
- Generic gradient hero with a big number and small label
- Emoji-laden motivational copy
- Purple/blue SaaS gradient buttons
- Card grids with drop shadows everywhere
- Stock "productivity app" aesthetic

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Vercel-native, familiar, best-in-class |
| Language | TypeScript (strict) | Type safety throughout |
| Styling | Tailwind CSS + CSS variables | Utility-first, themeable via the tokens above |
| UI primitives | Radix UI (headless) | Accessible, unstyled — we style with our tokens |
| Icons | Lucide React | Clean, consistent, used sparingly |
| Database | Supabase (Postgres) — FREE tier | Real SQL for analytics, RLS, Realtime |
| Hot cache | Upstash Redis — free | Instant dashboard reads, streak counters |
| Email | Brevo (free, 300/day) | Daily nudge + weekly digest |
| Cron | Vercel Cron (2 jobs, daily) | Nudge + digest |
| Anti-pause | GitHub Actions (every 3 days) | Keeps Supabase free project alive |
| Auth | Single passphrase (env var) | Personal tool, no OAuth overhead |
| Push/sound | Web Push API + Web Audio API | In-app notification sounds, desktop push |
| Charts | Recharts | Confidence trends, velocity graphs |
| Hosting | Vercel Hobby (free) | Best Next.js platform |
| Animations | Framer Motion | Smooth, controlled, reduced-motion aware |
| State | React hooks + SWR | Client freshness, optimistic updates |

### Key packages
```
@supabase/supabase-js
@upstash/redis
swr
date-fns
recharts
framer-motion
lucide-react
@radix-ui/react-dialog
@radix-ui/react-tabs
@radix-ui/react-tooltip
@radix-ui/react-progress
@radix-ui/react-slider
@radix-ui/react-switch
@radix-ui/react-toast
@radix-ui/react-dropdown-menu
```

---

## 3. Supabase Setup — Free Tier with Anti-Pause

**Critical:** Supabase free projects pause after 7 days of no database activity. We solve
this with a GitHub Actions ping every 3 days (Section 16). This keeps the project alive
without upgrading. The daily nudge cron also touches the DB daily as a natural backstop.

### Database region
Choose **Southeast Asia (Singapore)** or the closest available to Kolkata for low latency.

### Schema

Run this SQL in the Supabase SQL Editor. This is the full schema.

```sql
-- ============ CONFIG ============
create table user_config (
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
  created_at timestamptz default now()
);

-- ============ SPRING CONCEPTS ============
create table spring_concepts (
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
  created_at timestamptz default now(),
  primary key (user_key, id)
);

-- ============ DSA PATTERNS ============
create table dsa_patterns (
  id text not null,
  user_key text not null,
  title text not null,
  phase int not null,
  description text,
  current_confidence int not null default 0,
  last_studied date,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  primary key (user_key, id)
);

-- ============ DSA PROBLEMS ============
create table dsa_problems (
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
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  session_date date not null default current_date,
  logged_at timestamptz default now(),
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
create table stories (
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
  created_at timestamptz default now()
);

-- ============ QUIZ QUESTIONS ============
create table quiz_questions (
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
  created_at timestamptz default now()
);

-- ============ WEEKLY REVIEWS ============
create table weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  week_label text not null,
  week_number int not null,
  words_from_you text,
  weakest_area text,
  strongest_area text,
  next_week_focus text,
  created_at timestamptz default now()
);

-- ============ STREAK ============
create table streak (
  user_key text primary key,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_logged_date date,
  total_days_logged int not null default 0,
  total_minutes int not null default 0
);

-- ============ PING (anti-pause heartbeat) ============
create table ping (
  id bigint generated always as identity primary key,
  created_at timestamptz default now()
);

-- ============ QUICK NOTES ============
create table quick_notes (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  title text,
  body text not null,
  tag text,                             -- 'spring'|'dsa'|'idea'|'mistake'
  pinned boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ PUSH SUBSCRIPTIONS ============
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  subscription jsonb not null,
  created_at timestamptz default now()
);
```

### Security model — IMPORTANT
This is a single-user app with passphrase auth (NOT Supabase Auth). The security boundary
is: **all database access happens server-side in Next.js API routes using the Supabase
service role key. The client NEVER talks to Supabase directly and the service role key is
NEVER exposed to the browser.** Enable RLS on all tables (the service role bypasses RLS),
or leave RLS off given the server-only access pattern. Do not use the anon key in client
components for this app.

---

## 4. Test User + Seed Data

**Create a test user first so the app can be fully tested before real use.**

All data is namespaced by `user_key`. Two users:

- **Test user:** `user_key = 'test-aegis-2026'` — pre-seeded with sample data so every
  screen has content. Use it to click through and verify the whole app.
- **Real user:** `user_key = 'samprit-prod'` — starts empty, onboards fresh.

The active user_key is set via env var `ACTIVE_USER_KEY`. Default to the test user during
development; switch to `samprit-prod` when ready to use it for real.

### Seed steps (Claude Code, do all of these)
1. Seed `spring_concepts` and `dsa_patterns` (and their `dsa_problems`) for BOTH user keys
   from the master lists in Sections 7–8.
2. Seed `quiz_questions` for BOTH user keys from Section 9.
3. For the TEST user only, add fake progress + sessions + a story + notes so charts and
   history render. SQL below.

```sql
-- Test user config (already onboarded, mid-Phase-2 so all features are visible)
insert into user_config (user_key, display_name, target_role, start_date, duration_weeks,
  daily_minutes_goal, email, timezone, onboarded, theme)
values ('test-aegis-2026', 'Test User', 'Backend Java/Spring Boot',
  current_date - interval '35 days', 16, 60, 'test@example.com', 'Asia/Kolkata', true, 'dark');

-- Real user config (NOT onboarded — will go through onboarding)
insert into user_config (user_key, display_name, onboarded)
values ('samprit-prod', 'Samprit', false);

-- Test user streak
insert into streak (user_key, current_streak, longest_streak, last_logged_date,
  total_days_logged, total_minutes)
values ('test-aegis-2026', 7, 12, current_date - interval '1 day', 28, 1540);

-- Real user streak (empty)
insert into streak (user_key, current_streak, longest_streak, total_days_logged, total_minutes)
values ('samprit-prod', 0, 0, 0, 0);

-- Test user sample sessions
insert into sessions (user_key, session_date, duration_minutes, type, spring_concept_id,
  spring_depth, spring_confidence, mood, notes)
values
  ('test-aegis-2026', current_date - interval '1 day', 65, 'spring', 'spring-transactions', 4, 3, 'sharp', 'Propagation finally clicked: REQUIRES_NEW vs REQUIRED.'),
  ('test-aegis-2026', current_date - interval '2 days', 45, 'dsa', null, null, null, 'okay', 'Two pointers — solved 3, one needed a hint'),
  ('test-aegis-2026', current_date - interval '3 days', 50, 'spring', 'spring-data-jpa', 3, 3, 'sharp', 'Entity mapping + repository methods'),
  ('test-aegis-2026', current_date - interval '5 days', 30, 'behavioral', null, null, null, 'tired', 'Drafted the performance-improvement story'),
  ('test-aegis-2026', current_date - interval '6 days', 70, 'mock', null, null, null, 'sharp', 'Self mock: 5 Spring questions, solid on 3');

-- Test user sample story
insert into stories (user_key, question, situation, task, action, result, linked_concept_ids, confidence)
values ('test-aegis-2026',
  'Tell me about a time you handled a tricky data-consistency problem.',
  'While building TaskFlow''s task assignment feature, concurrent updates could overwrite each other.',
  'I needed updates to be atomic without locking the whole table.',
  'I applied @Transactional with the right isolation level and optimistic locking via a version column.',
  'Updates became safe under concurrency, and I understood exactly how Spring manages transaction boundaries.',
  array['spring-transactions','spring-data-jpa'], 3);

-- Test user quick notes
insert into quick_notes (user_key, title, body, tag, pinned)
values
  ('test-aegis-2026', 'N+1 reminder', 'TaskRepository findAll fetches tasks lazily in a loop. Use @EntityGraph.', 'spring', true),
  ('test-aegis-2026', 'LC pattern insight', 'When I see "subarray" or "substring", think sliding window first.', 'dsa', false);

-- Give the test user a realistic spread of confidence on concepts
update spring_concepts set current_confidence = 4, current_depth = 4, times_studied = 3,
  last_studied = current_date - interval '1 day'
where user_key = 'test-aegis-2026' and id in ('spring-ioc','spring-di-types','spring-transactions');

update spring_concepts set current_confidence = 3, current_depth = 3, times_studied = 2,
  last_studied = current_date - interval '4 days'
where user_key = 'test-aegis-2026' and id in ('spring-data-jpa','spring-rest-basics');

update spring_concepts set current_confidence = 2, current_depth = 2, times_studied = 1,
  last_studied = current_date - interval '15 days'
where user_key = 'test-aegis-2026' and id in ('spring-security-basics','spring-jwt');

update dsa_patterns set current_confidence = 3, last_studied = current_date - interval '2 days'
where user_key = 'test-aegis-2026' and id = 'two-pointers';
```

### Test user verification checklist (before switching to the real user)
- [ ] Dashboard shows the Today ring, streak, stats, recent sessions
- [ ] Mastery Map shows a mix of confidence colors (green/amber/gray)
- [ ] Session logger works for all types (spring/dsa/behavioral/mock/quiz)
- [ ] Focus timer counts down and plays the completion chime
- [ ] Quiz mode pulls questions and records results
- [ ] Mock mode runs a session and shows a confidence snapshot
- [ ] Story bank shows the seeded story; flashcard recall works
- [ ] Quick notes CRUD works; pin works
- [ ] Insights charts render (confidence trend, velocity, calendar, coverage)
- [ ] Gap analysis / danger alerts appear
- [ ] Tutorial page displays correctly
- [ ] Settings change theme, sound, goal, duration
- [ ] Every screen responsive at 360 / 768 / 1024 / 1440 — no horizontal scroll
- [ ] Dark and light mode both correct
- [ ] No emojis anywhere; no layout shift on load

---

## 5. Phase Engine

Phase is always derived at runtime from start_date + duration_weeks.

```ts
// lib/phase.ts
import { differenceInCalendarWeeks } from 'date-fns'

export type Phase = 1 | 2 | 3
export interface PhaseState {
  current: Phase; weekNumber: number; totalWeeks: number
  label: string; description: string; dailyGoalMinutes: number
  intensityUnlocked: boolean; progressPercent: number
}

export function derivePhase(startDate: string, durationWeeks: number, baseGoal: number): PhaseState {
  const start = new Date(startDate)
  const weekNumber = Math.max(1, differenceInCalendarWeeks(new Date(), start) + 1)
  const phase1End = 3
  const phase2End = Math.round(durationWeeks * 0.65)
  let current: Phase, label: string, description: string, dailyGoalMinutes: number
  if (weekNumber <= phase1End) {
    current = 1; label = 'Habit Lock'
    description = 'The only goal is showing up. Short sessions. Build the daily reflex.'
    dailyGoalMinutes = baseGoal
  } else if (weekNumber <= phase2End) {
    current = 2; label = 'Depth Build'
    description = 'Go deeper. Tie every concept to TaskFlow. Patterns over problems.'
    dailyGoalMinutes = Math.round(baseGoal * 1.6)
  } else {
    current = 3; label = 'Peak Mode'
    description = 'Full intensity. Mocks, quizzes, weak-link drilling. Interview-ready.'
    dailyGoalMinutes = Math.round(baseGoal * 2)
  }
  const progressPercent = Math.min(100, Math.round((weekNumber / durationWeeks) * 100))
  return { current, weekNumber, totalWeeks: durationWeeks, label, description,
    dailyGoalMinutes, intensityUnlocked: current >= 2, progressPercent }
}
```

**Phase-gated behaviour:**
- Phase 1: Daily prompt is just "log a session." DSA limited to foundation patterns. No
  danger alerts (encouragement only). Quiz/mock visible but gently introduced.
- Phase 2: Full Mastery Map. Gap analysis on. Daily suggested focus. Quizzes ramp up.
- Phase 3: Mock mode prominent. Weak-link daily prompt. Full LC medium tracking.
  Pre-interview "confidence report" available.

---

## 6. App Structure & Feature Map

```
src/
├── app/
│   ├── layout.tsx                  # Root: fonts, theme provider, auth gate
│   ├── login/page.tsx              # Passphrase entry
│   ├── (app)/
│   │   ├── layout.tsx              # App shell: sidebar (desktop) / bottom-nav (mobile)
│   │   ├── dashboard/page.tsx      # The War Room (home)
│   │   ├── log/page.tsx            # Session logger
│   │   ├── focus/page.tsx          # Focus timer (Pomodoro-style, with sound)
│   │   ├── mastery/
│   │   │   ├── page.tsx            # Mastery map (Spring + DSA tabs)
│   │   │   ├── spring/[id]/page.tsx
│   │   │   └── dsa/[id]/page.tsx
│   │   ├── quiz/page.tsx           # Quiz / flashcard mode
│   │   ├── mock/page.tsx           # Mock interview mode
│   │   ├── stories/page.tsx        # Interview story bank
│   │   ├── notes/page.tsx          # Quick notes
│   │   ├── insights/page.tsx       # Charts: trends, velocity, gaps, calendar
│   │   ├── weekly/page.tsx         # Weekly review
│   │   ├── tutorial/page.tsx       # In-app guide to everything (Section 13)
│   │   └── settings/page.tsx       # Config, theme, sound, notifications
│   └── api/
│       ├── config/route.ts
│       ├── session/route.ts
│       ├── concepts/route.ts
│       ├── patterns/route.ts
│       ├── problems/route.ts
│       ├── stories/route.ts
│       ├── quiz/route.ts
│       ├── notes/route.ts
│       ├── streak/route.ts
│       ├── weekly/route.ts
│       ├── insights/route.ts
│       ├── push/route.ts
│       └── cron/
│           ├── daily-nudge/route.ts
│           └── weekly-digest/route.ts
│
├── components/
│   ├── shell/ (Sidebar, BottomNav, PhaseBar)
│   ├── dashboard/ (TodayRing [SIGNATURE], StreakCard, StatGrid, MissionBrief,
│   │               DangerAlerts, SuggestedFocus, RecentSessions)
│   ├── mastery/ (MasteryMap, ConceptCard, ConfidenceBar, DSAPatternCard)
│   ├── log/ (SessionLogger)
│   ├── focus/ (FocusTimer)
│   ├── quiz/ (QuizCard)
│   ├── mock/ (MockSession)
│   ├── stories/ (StoryCard)
│   ├── notes/ (NoteCard)
│   ├── insights/ (chart components)
│   └── ui/ (Button, Card, Input, Slider, Switch, Tabs, Dialog, Toast, Tooltip, Skeleton)
│
├── lib/ (supabase, redis, phase, streak, gaps, brevo, auth, sound, push)
└── data/ (spring-concepts.ts, dsa-patterns.ts, quiz-seed.ts)
```

### Full feature list (what makes this "superhuman")

1. **War Room dashboard** — Today ring, streak, stats, mission brief, danger alerts,
   suggested focus, recent sessions.
2. **Session logger** — structured per type (Spring concept + depth + confidence; DSA
   pattern + problems; behavioral; mock; quiz), free notes, mood, duration.
3. **Focus timer** — built-in Pomodoro-style timer with configurable durations, optional
   calm tick, gentle chime on completion. Offers to log the session when finished.
4. **Mastery Map** — every Spring concept and DSA pattern with confidence, last-studied,
   TaskFlow anchor, and detail pages with study history + confidence timeline.
5. **Quiz / flashcard mode** — concept-tied questions, reveal answer, self-rate, tracks
   accuracy. Spaced-repetition-lite: surfaces low-accuracy questions more often.
6. **Mock interview mode** — pulls a random set (Spring + behavioral), simulates a session,
   you self-assess, generates a confidence snapshot.
7. **Interview story bank** — STAR stories linked to TaskFlow concepts; flashcard recall.
8. **Quick notes** — free-floating notes with tags and pinning. The scratchpad.
9. **Insights** — confidence trend, weekly velocity (with goal line), coverage heatmap,
   streak/contribution calendar, DSA progress, mood-vs-performance.
10. **Weekly review** — guided reflection, feeds the weekly digest email.
11. **Daily nudge + weekly digest emails** (Brevo).
12. **In-app + push notifications with sound** — daily reminder, streak-at-risk, timer
    completion, suggested focus.
13. **In-app tutorial** — one page explaining every feature + the recommended daily flow.
14. **Settings** — theme, sound on/off, push on/off, daily goal, prep duration, email.

---

## 7. Spring Boot Concept Master List

Stored in `src/data/spring-concepts.ts`; seeded to `spring_concepts` for both users.
Each concept has a `taskflow_anchor` (exact place in TaskFlow) and a short `description`.

### Phase 1 — Core Foundation (Weeks 1–3)
| id | category | title | taskflow_anchor |
|---|---|---|---|
| spring-ioc | core | IoC Container & ApplicationContext | Application.java — SpringApplication.run() |
| spring-di-types | core | DI: Constructor vs Field vs Setter | UserService.java — constructor injection |
| spring-bean-lifecycle | core | Bean lifecycle, scope, init/destroy | @Bean config methods |
| spring-annotations-core | core | @Component/@Service/@Repository/@Controller | Every layer |
| spring-auto-config | core | @SpringBootApplication & auto-configuration | Application.java |
| spring-properties | core | application.yml, @Value, @ConfigurationProperties | DB + JWT config |
| spring-rest-basics | web | @RestController, @RequestMapping, @PathVariable, @RequestBody | TaskController.java |
| spring-response-entity | web | ResponseEntity, HTTP status codes | Controller return types |

### Phase 2 — Depth (Weeks 4–10)
| id | category | title | taskflow_anchor |
|---|---|---|---|
| spring-data-jpa | data | Spring Data JPA, @Entity, @Repository | Task.java, TaskRepository.java |
| spring-transactions | data | @Transactional: propagation, isolation, rollback | TaskService.java |
| spring-jpql | data | JPQL vs native, @Query | TaskRepository custom queries |
| spring-exception-handling | web | @ControllerAdvice, @ExceptionHandler, ProblemDetail | GlobalExceptionHandler.java |
| spring-validation | web | @Valid, constraint annotations, BindingResult | DTO classes |
| spring-security-basics | security | SecurityFilterChain, authN vs authZ | SecurityConfig.java |
| spring-jwt | security | JWT filter, auth token flow | JwtFilter.java |
| spring-dto-pattern | patterns | DTO vs Entity separation, mapping | Request/Response DTOs |
| spring-service-layer | patterns | Service responsibilities, transaction boundaries | TaskService.java |
| spring-layered-arch | patterns | Controller→Service→Repository, why each layer | Whole structure |
| spring-testing-unit | testing | Mockito, @Mock, @InjectMocks | TaskServiceTest.java |
| spring-testing-integration | testing | @SpringBootTest, MockMvc, @DataJpaTest | Integration tests |

### Phase 3 — Advanced & Interview-Critical (Weeks 11–16)
| id | category | title | taskflow_anchor |
|---|---|---|---|
| spring-aop | advanced | AOP, @Aspect, @Around, cross-cutting | Logging aspect (to build) |
| spring-caching | advanced | @Cacheable, @CacheEvict, strategies | To add to TaskFlow |
| spring-async | advanced | @Async, @EnableAsync, thread pools | Background tasks |
| spring-actuator | advanced | Actuator, health checks, metrics | pom.xml actuator dep |
| spring-profiles | advanced | @Profile, env-specific config | application-dev.yml |
| spring-event-driven | advanced | ApplicationEvent, @EventListener | To add (decoupling) |
| spring-n-plus-one | data | N+1 problem, @EntityGraph, fetch strategy | TaskRepository.java |
| spring-bean-scopes | core | Singleton vs Prototype vs Request | Config classes |
| spring-circular-deps | core | Circular dependencies & fixes | Architecture decisions |
| spring-filter-interceptor | web | OncePerRequestFilter vs HandlerInterceptor | JwtFilter.java |

For each concept, write a 1–2 sentence `description` for the UI (Claude Code: generate
these from your Spring knowledge).

---

## 8. DSA Pattern Master List

Stored in `src/data/dsa-patterns.ts`. Philosophy baked in: learn the pattern deeply, then
solve 4–6 targeted problems requiring ONLY that pattern. Don't advance until confidence >= 3.

### Phase 1 — Foundation (Weeks 1–3)
| id | title | core LC problems |
|---|---|---|
| arrays-hashing | Arrays & Hashing — frequency maps, index tricks | 217, 242, 1, 49, 347 |
| two-pointers | Two Pointers — opposite ends, sorted arrays | 125, 167, 15, 11 |
| sliding-window | Sliding Window — subarray/substring | 643, 3, 424, 76 |

### Phase 2 — Core Medium (Weeks 4–10)
| id | title | core LC problems |
|---|---|---|
| stack-basics | Stack — monotonic, next greater | 20, 155, 739, 84 |
| binary-search | Binary Search — sorted + search space | 704, 74, 153, 33 |
| linked-list | Linked List — fast/slow, reversal | 206, 21, 141, 143 |
| trees-dfs | Trees — DFS traversals | 104, 226, 100, 112 |
| trees-bfs | Trees — BFS, level order | 102, 199, 111 |
| backtracking | Backtracking — subsets, permutations | 78, 46, 39, 79 |

### Phase 3 — Interview-Critical (Weeks 11–16)
| id | title | core LC problems |
|---|---|---|
| heap-priority | Heap / Priority Queue | 703, 1046, 215, 973 |
| dp-1d | DP — 1D, house robber family | 70, 198, 322, 139 |
| dp-2d | DP — 2D grids | 62, 64, 1143 |
| graphs-bfs-dfs | Graphs — BFS/DFS adjacency | 200, 133, 417 |
| intervals | Intervals — merge, insert | 57, 56, 435 |

When seeding, create a `dsa_problems` row per LC problem listed, with `is_core = true`,
`difficulty` set correctly, and `outcome = null`. Add a short `description` per pattern.

---

## 9. Quiz Seed Questions

Stored in `src/data/quiz-seed.ts`; seeded to `quiz_questions` for both users. Provide at
least 3–5 questions per Phase-1 and Phase-2 Spring concept, a couple per DSA pattern, and
several behavioral questions. Each is `{ category, concept_id, difficulty, question, answer }`.

Examples (Claude Code: expand to full coverage across all concepts):

```ts
export const QUIZ_SEED = [
  { category:'spring', concept_id:'spring-di-types', difficulty:'medium',
    question:'Why is constructor injection preferred over field injection?',
    answer:'It makes dependencies explicit and final (immutable), enables unit testing '
      +'without a container, fails fast on missing dependencies, and surfaces circular '
      +'dependencies instead of hiding them. Field injection also cannot set final fields.' },
  { category:'spring', concept_id:'spring-transactions', difficulty:'hard',
    question:'Difference between REQUIRED and REQUIRES_NEW propagation?',
    answer:'REQUIRED joins an existing transaction or creates one if none exists. '
      +'REQUIRES_NEW always suspends any current transaction and creates an independent '
      +'one that commits/rolls back on its own, regardless of the outer transaction.' },
  { category:'spring', concept_id:'spring-data-jpa', difficulty:'medium',
    question:'What does Spring Data JPA generate from a method name like findByStatus?',
    answer:'It derives a query at runtime by parsing the method name into a JPQL query '
      +'(SELECT ... WHERE status = ?1), so you get the implementation for free without '
      +'writing the query yourself.' },
  { category:'behavioral', concept_id:null, difficulty:'medium',
    question:'Tell me about a time you learned something complex quickly.',
    answer:'Use the TaskFlow transaction-management story: Situation, Task, Action, Result.' },
  // ... expand: arrays-hashing, two-pointers, sliding-window, security, jwt, testing, etc.
]
```

---

## 10. Notifications, Sound & Push

### Sound — `lib/sound.ts`
- Prefer generating tones with the Web Audio API (no asset files): a soft two-note chime
  for timer completion, an optional subtle tick for the timer, a gentle confirmation tone
  when a session is logged.
- Respect the `sound_enabled` setting. Keep volume modest. Nothing jarring.

### Push — `lib/push.ts`
- Register a service worker (`public/sw.js`), request permission only when the user enables
  push in Settings. Store the subscription in `push_subscriptions`.
- Use for: evening reminder if not logged, streak-at-risk, timer done while backgrounded.
- Trigger from cron routes (daily-nudge) using the `web-push` library with VAPID keys.
  Add `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` env vars if implementing push.

### In-app notifications
- Radix Toast for: session logged, streak milestone, quiz result, gap alert. Subtle,
  dismissible, never more than 2 stacked.

---

## 11. Insights / Charts (Recharts)

The `/insights` page makes Aegis feel data-rich and intelligent. All charts responsive,
all colors from the design tokens (never default Recharts palette):

- **Confidence trend** — average Spring confidence over time (line).
- **Weekly velocity** — minutes studied per week (bar) with the phase goal as a reference line.
- **Coverage heatmap** — grid of all concepts colored by confidence (where am I weak).
- **Streak calendar** — contribution-style calendar of daily sessions.
- **DSA progress** — core problems solved per pattern (stacked progress).
- **Mood vs performance** — light insight: confidence on sharp vs tired days.

---

## 12. Gap Analysis & Suggested Focus — `lib/gaps.ts`

```ts
export function computeDangerAlerts(concepts, phase) {
  const today = new Date()
  return concepts
    .filter(c => c.phase <= phase && c.last_studied)
    .map(c => {
      const days = daysBetween(today, new Date(c.last_studied))
      const weak = c.current_confidence <= 2
      return ((weak && days >= 7) || days >= 14) ? { concept: c, days, weak } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.days - a.days)
    .slice(0, 2)
}

export function suggestTodaysFocus(concepts, phase) {
  const pool = concepts.filter(c => c.phase <= phase)
  return pool.sort((a, b) =>
    a.current_confidence - b.current_confidence ||
    gapDays(b.last_studied) - gapDays(a.last_studied)
  )[0] ?? null
}
```

Phase 3 adds a "weakest link" mode: pick the single lowest-confidence concept across all
phases and build today's suggested session around it.

---

## 13. In-App Tutorial (REQUIRED)

A dedicated `/tutorial` page — the single place explaining everything Aegis does and how to
use it well. Calm, scannable sections (NOT a wall of text, NOT a carousel). It should feel
like a thoughtful guide you can return to anytime.

Sections:
1. **What Aegis is for** — the North Star, two sentences.
2. **The daily flow** — the recommended ritual:
   - Open the dashboard, read the mission brief.
   - Start a focus session (use the timer).
   - Study the suggested concept or your own pick; tie it to TaskFlow.
   - Log the session honestly (depth + confidence).
   - Optionally: one quiz round or rehearse a story.
3. **The three phases** — what each expects and why intensity ramps up.
4. **Each feature, briefly** — Dashboard, Logger, Focus timer, Mastery Map, Quiz, Mock,
   Stories, Notes, Insights, Weekly review — one short paragraph each, with a link.
5. **The method** — why concept-first DSA beats random grinding; why confidence is tracked;
   why everything ties back to TaskFlow.
6. **Honesty matters** — the app only works if confidence ratings are truthful; mark low
   when it's low.

Add a "How it works" link in the nav and a one-time gentle prompt to read it after onboarding.

---

## 14. Auth (Passphrase)

```ts
// middleware.ts — gate everything except /login and cron
import { NextRequest, NextResponse } from 'next/server'
export function middleware(req: NextRequest) {
  const token = req.cookies.get('aegis-auth')?.value
  const isLogin = req.nextUrl.pathname === '/login'
  const isCron = req.nextUrl.pathname.startsWith('/api/cron')
  if (!token && !isLogin && !isCron) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}
export const config = { matcher: ['/((?!_next|favicon|manifest|sw.js).*)'] }
```

Login: single password field, compare to `process.env.AEGIS_PASSPHRASE`, set httpOnly cookie
(30-day). Cron routes protected by `CRON_SECRET` Bearer header.

---

## 15. Environment Variables

```env
# .env.local
AEGIS_PASSPHRASE=choose-a-strong-passphrase
ACTIVE_USER_KEY=test-aegis-2026          # switch to 'samprit-prod' when ready

# Supabase (project settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...         # SERVER ONLY — never expose to client

# Upstash Redis (Upstash console)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx

# Brevo
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=your-email@gmail.com

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
CRON_SECRET=a-random-16+-char-string

# Optional (only if implementing web push)
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

---

## 16. Cron + Anti-Pause

### vercel.json
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    { "path": "/api/cron/daily-nudge", "schedule": "0 2 * * *" },
    { "path": "/api/cron/weekly-digest", "schedule": "30 3 * * 0" }
  ]
}
```
Hobby allows 2 daily crons. 02:00 UTC ≈ 07:30 IST nudge; Sun 03:30 UTC ≈ 09:00 IST digest.
Note: Vercel hobby triggers crons anytime within the scheduled hour — fine for nudges.
Each cron route checks `Authorization: Bearer ${CRON_SECRET}`.

### Anti-pause GitHub Action — `.github/workflows/keep-alive.yml`
```yaml
name: Keep Supabase Alive
on:
  schedule:
    - cron: '0 6 */3 * *'   # every 3 days at 06:00 UTC
  workflow_dispatch:
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/rest/v1/ping" \
            -H "apikey: ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{}'
```
Add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` as GitHub repo secrets.

---

## 17. Build Order for Claude Code

Build in this sequence. Verify each block with the TEST USER before moving on.

1. **Scaffold** — create-next-app (TS, Tailwind, App Router, src dir); install all packages;
   set up fonts via next/font; wire design tokens into Tailwind config + globals.css.
2. **Base UI kit** — Button, Card, Input, Slider, Switch, Tabs, Dialog, Toast, Tooltip,
   Skeleton via Radix + tokens. Pixel-clean and responsive first.
3. **Theme + shell** — dark/light provider; responsive shell (sidebar desktop, bottom nav
   mobile); PhaseBar.
4. **Supabase + Redis libs** — server clients, typed helpers.
5. **Auth** — passphrase login + middleware.
6. **Schema + seed** — run schema SQL; seed concepts/patterns/quizzes for both users;
   populate test user fake data.
7. **Onboarding + Settings** — config form; theme/sound/notification toggles.
8. **Session logger** — all types, optimistic save, streak update.
9. **Focus timer** — Pomodoro with sound; offer to log on completion.
10. **Dashboard** — Today ring (signature), streak, stats, mission brief, recent.
11. **Mastery Map** — Spring + DSA tabs; concept/pattern detail pages.
12. **Quiz mode** — question cards, self-rate, accuracy tracking.
13. **Mock mode** — random question set, self-assessment, confidence snapshot.
14. **Story bank** — STAR form, concept linking, flashcard recall.
15. **Quick notes** — CRUD, tags, pinning.
16. **Insights** — all charts, responsive, tokenized colors.
17. **Gap analysis** — danger alerts + suggested focus on dashboard.
18. **Weekly review** — guided form.
19. **Tutorial page** — the in-app guide.
20. **Email (Brevo)** — nudge + digest templates and cron routes.
21. **Notifications + push** — toasts, service worker, web push.
22. **Anti-pause** — GitHub Action.
23. **Final polish** — responsiveness audit at 360/768/1024/1440, reduced-motion, keyboard
    focus, empty/loading/error states everywhere.

**Give Claude Code ONE block at a time.** After each, test with the test user, then continue.

---

## 18. Quality Floor (verify before declaring done)

- Every view responsive 360px → 1440px+, no horizontal scroll, 44px tap targets on mobile.
- Dark and light mode both flawless.
- No layout shift on data load (skeletons reserve space).
- Visible keyboard focus everywhere.
- `prefers-reduced-motion` respected on all animations.
- No emojis anywhere in the UI.
- Type pairing loaded with no FOUT (next/font).
- All async states have loading + empty + error views.
- Copy is warm, plain, sentence-case, never cheesy.
- The Today ring animates smoothly and is satisfying to complete.

---

## 19. What Aegis Is Not

- Not a generic habit tracker.
- Not a LeetCode mirror (it tracks pattern confidence, not raw counts).
- Not a note app (notes serve the prep, anchored to concepts).
- Not a dopamine slot machine (no confetti, no fake hype, no emoji spam).
- Not a replacement for opening TaskFlow and reading the code.

Aegis makes sure Samprit shows up, studies deliberately, tracks honestly, and walks into
interviews genuinely prepared and calm. The offer follows.
