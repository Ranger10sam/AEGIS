/**
 * Aegis seed script (CLAUDE.md §4 + §7–9).
 *
 * Prerequisite: run supabase/schema.sql in the Supabase SQL Editor first.
 * Then: `npm run seed` (loads .env.local for the service-role credentials).
 *
 * Idempotent: each table is seeded only if empty for that user_key, so re-runs
 * are safe and won't clobber real progress. Builds its own admin client (it is
 * a standalone Node script, so it does not import the server-only lib client).
 */
import { createClient } from "@supabase/supabase-js";

import { DSA_PATTERNS } from "../src/data/dsa-patterns";
import { SPRING_CONCEPTS } from "../src/data/spring-concepts";
import { QUIZ_SEED } from "../src/data/quiz-seed";

const TEST = "test-aegis-2026";
const PROD = "samprit-prod";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(
    "Missing env. Run with the project env loaded, e.g. `npm run seed` (uses .env.local).",
  );
  process.exit(1);
}

// Untyped on purpose: this one-off script doesn't need typed queries, and the
// union-over-tables typing fights helpers like seedIfEmpty. Data is still typed.
const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** ISO date (YYYY-MM-DD) n days before today. */
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Insert rows only if the user has none in this table yet. */
async function seedIfEmpty(
  table: string,
  userKey: string,
  rows: Record<string, unknown>[],
): Promise<void> {
  const { count, error: countError } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("user_key", userKey);
  if (countError) throw new Error(`${table} count: ${countError.message}`);

  if ((count ?? 0) > 0) {
    console.log(`  • ${table} [${userKey}]: ${count} rows present — skipped`);
    return;
  }
  if (rows.length === 0) return;

  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`${table} insert: ${error.message}`);
  console.log(`  • ${table} [${userKey}]: inserted ${rows.length}`);
}

function conceptRows(userKey: string) {
  return SPRING_CONCEPTS.map((c, i) => ({
    id: c.id,
    user_key: userKey,
    category: c.category,
    title: c.title,
    phase: c.phase,
    description: c.description,
    taskflow_anchor: c.taskflowAnchor,
    sort_order: i,
  }));
}

function patternRows(userKey: string) {
  return DSA_PATTERNS.map((p, i) => ({
    id: p.id,
    user_key: userKey,
    title: p.title,
    phase: p.phase,
    description: p.description,
    sort_order: i,
  }));
}

function problemRows(userKey: string) {
  return DSA_PATTERNS.flatMap((p) =>
    p.problems.map((pr, i) => ({
      pattern_id: p.id,
      user_key: userKey,
      lc_number: pr.lc,
      title: pr.title,
      difficulty: pr.difficulty,
      is_core: true,
      sort_order: i,
    })),
  );
}

function quizRows(userKey: string) {
  return QUIZ_SEED.map((q) => ({
    user_key: userKey,
    category: q.category,
    concept_id: q.conceptId,
    question: q.question,
    answer: q.answer,
    difficulty: q.difficulty,
  }));
}

function configRow(userKey: string) {
  if (userKey === TEST) {
    return {
      user_key: TEST,
      display_name: "Test User",
      target_role: "Backend Java/Spring Boot",
      start_date: daysAgo(35),
      duration_weeks: 16,
      daily_minutes_goal: 60,
      email: "test@example.com",
      timezone: "Asia/Kolkata",
      onboarded: true,
      theme: "dark",
    };
  }
  return { user_key: PROD, display_name: "Samprit", onboarded: false };
}

function streakRow(userKey: string) {
  if (userKey === TEST) {
    return {
      user_key: TEST,
      current_streak: 7,
      longest_streak: 12,
      last_logged_date: daysAgo(1),
      total_days_logged: 28,
      total_minutes: 1540,
    };
  }
  return {
    user_key: PROD,
    current_streak: 0,
    longest_streak: 0,
    total_days_logged: 0,
    total_minutes: 0,
  };
}

const TEST_SESSIONS = [
  {
    user_key: TEST,
    session_date: daysAgo(1),
    duration_minutes: 65,
    type: "spring",
    spring_concept_id: "spring-transactions",
    spring_depth: 4,
    spring_confidence: 3,
    mood: "sharp",
    notes: "Propagation finally clicked: REQUIRES_NEW vs REQUIRED.",
  },
  {
    user_key: TEST,
    session_date: daysAgo(2),
    duration_minutes: 45,
    type: "dsa",
    dsa_pattern_id: "two-pointers",
    mood: "okay",
    notes: "Two pointers — solved 3, one needed a hint",
  },
  {
    user_key: TEST,
    session_date: daysAgo(3),
    duration_minutes: 50,
    type: "spring",
    spring_concept_id: "spring-data-jpa",
    spring_depth: 3,
    spring_confidence: 3,
    mood: "sharp",
    notes: "Entity mapping + repository methods",
  },
  {
    user_key: TEST,
    session_date: daysAgo(5),
    duration_minutes: 30,
    type: "behavioral",
    mood: "tired",
    notes: "Drafted the performance-improvement story",
  },
  {
    user_key: TEST,
    session_date: daysAgo(6),
    duration_minutes: 70,
    type: "mock",
    mood: "sharp",
    notes: "Self mock: 5 Spring questions, solid on 3",
  },
];

const TEST_STORY = {
  user_key: TEST,
  question: "Tell me about a time you handled a tricky data-consistency problem.",
  situation:
    "While building TaskFlow's task assignment feature, concurrent updates could overwrite each other.",
  task: "I needed updates to be atomic without locking the whole table.",
  action:
    "I applied @Transactional with the right isolation level and optimistic locking via a version column.",
  result:
    "Updates became safe under concurrency, and I understood exactly how Spring manages transaction boundaries.",
  linked_concept_ids: ["spring-transactions", "spring-data-jpa"],
  confidence: 3,
};

const TEST_NOTES = [
  {
    user_key: TEST,
    title: "N+1 reminder",
    body: "TaskRepository findAll fetches tasks lazily in a loop. Use @EntityGraph.",
    tag: "spring",
    pinned: true,
  },
  {
    user_key: TEST,
    title: "LC pattern insight",
    body: 'When I see "subarray" or "substring", think sliding window first.',
    tag: "dsa",
    pinned: false,
  },
];

/** Test-user confidence/last-studied spread so charts and the map render (§4). */
async function applyTestProgress(): Promise<void> {
  const updates: { ids: string[]; values: Record<string, unknown> }[] = [
    {
      ids: ["spring-ioc", "spring-di-types", "spring-transactions"],
      values: {
        current_confidence: 4,
        current_depth: 4,
        times_studied: 3,
        last_studied: daysAgo(1),
      },
    },
    {
      ids: ["spring-data-jpa", "spring-rest-basics"],
      values: {
        current_confidence: 3,
        current_depth: 3,
        times_studied: 2,
        last_studied: daysAgo(4),
      },
    },
    {
      ids: ["spring-security-basics", "spring-jwt"],
      values: {
        current_confidence: 2,
        current_depth: 2,
        times_studied: 1,
        last_studied: daysAgo(15),
      },
    },
  ];
  for (const u of updates) {
    const { error } = await supabase
      .from("spring_concepts")
      .update(u.values)
      .eq("user_key", TEST)
      .in("id", u.ids);
    if (error) throw new Error(`test progress: ${error.message}`);
  }
  const { error } = await supabase
    .from("dsa_patterns")
    .update({ current_confidence: 3, last_studied: daysAgo(2) })
    .eq("user_key", TEST)
    .eq("id", "two-pointers");
  if (error) throw new Error(`test dsa progress: ${error.message}`);
  console.log("  • applied test-user progress");
}

async function main(): Promise<void> {
  console.log("Seeding Aegis…");

  for (const userKey of [TEST, PROD]) {
    console.log(`\nUser: ${userKey}`);
    await seedIfEmpty("user_config", userKey, [configRow(userKey)]);
    await seedIfEmpty("streak", userKey, [streakRow(userKey)]);
    await seedIfEmpty("spring_concepts", userKey, conceptRows(userKey));
    await seedIfEmpty("dsa_patterns", userKey, patternRows(userKey));
    await seedIfEmpty("dsa_problems", userKey, problemRows(userKey));
    await seedIfEmpty("quiz_questions", userKey, quizRows(userKey));
  }

  console.log(`\nTest-user sample data: ${TEST}`);
  await seedIfEmpty("sessions", TEST, TEST_SESSIONS);
  await seedIfEmpty("stories", TEST, [TEST_STORY]);
  await seedIfEmpty("quick_notes", TEST, TEST_NOTES);
  await applyTestProgress();

  console.log(
    `\nDone. Seeded ${SPRING_CONCEPTS.length} concepts, ${DSA_PATTERNS.length} patterns, ${QUIZ_SEED.length} quiz questions per user.`,
  );
}

main().catch((err) => {
  console.error("\nSeed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
