# Supabase setup

One-time steps to stand up the Aegis database (CLAUDE.md §3, §4).

## 1. Create the project
- New Supabase project, region **Southeast Asia (Singapore)** (closest to Kolkata).
- Project Settings → API: copy the **Project URL** and the **service_role** key into `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY=eyJ...`  (server-only — never exposed to the browser)

## 2. Apply the schema
Open the Supabase **SQL Editor**, paste the contents of [`schema.sql`](./schema.sql), and run it.
Safe to re-run (`create table if not exists`).

## 3. Seed the data
From the project root:

```bash
npm run seed
```

This populates **both** users (`test-aegis-2026`, `samprit-prod`) from `src/data/*`:
30 Spring concepts, 14 DSA patterns + 56 problems, and 124 quiz questions — plus
the test user's sample sessions/story/notes/streak so every screen has content.

The seed is **idempotent** (seed-if-empty per table per user), so re-running won't
duplicate rows or clobber real progress.

## Notes
- All DB access is server-side via the service role key; the client never talks to
  Supabase directly. RLS is enabled on every table as defense-in-depth.
- Active user is chosen by `ACTIVE_USER_KEY` (defaults to `test-aegis-2026`). Switch
  to `samprit-prod` when ready for real use.
- The anti-pause GitHub Action (build block 22) keeps the free project alive.
