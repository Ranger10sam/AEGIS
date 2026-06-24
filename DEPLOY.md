# Deploying Aegis

All 23 build blocks (CLAUDE.md §17) are complete and verified end-to-end against the live
Supabase project. What remains is operational, not code. This is the go-live runbook.

## Status snapshot

- [x] Schema applied in Supabase (all 12 tables reachable)
- [x] Seed run — 30 concepts, 14 patterns, 53 problems, 124 quiz questions per user
- [x] Test-user sample data present (config, streak, 5 sessions, 1 story, 2 notes, confidence spread)
- [x] Build green (`npm run build`) and authenticated smoke test passing against the live DB
- [ ] Manual browser pass (visual / responsive / dark+light) — human-only, see checklist below
- [ ] Production env values finalized (see below)
- [ ] Deployed to Vercel + GitHub keep-alive secrets set
- [ ] Switched to the real user when ready

## 1. Finalize environment values

`.env.local` is wired for local development. These values still need attention:

| Var | Now | Action |
|---|---|---|
| `AEGIS_PASSPHRASE` | `pick-something-memorable` (placeholder) | This is your login password. Change it to a strong passphrase before real use. |
| `CRON_SECRET` | `any-random-16-char-string` (placeholder) | Replace with a real random 16+ char string before deploy. |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Set to your Vercel URL on deploy (used in email links + push). |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | absent | Optional. Only needed for browser push. Generate with `npx web-push generate-vapid-keys`. Without them, push is gracefully disabled; everything else works. |

Supabase, Upstash, and Brevo credentials are already filled and verified.

> Security: `.env*` is gitignored, so these never reach git. Don't paste the service-role key,
> Upstash token, or Brevo key into chats/PRs/issues. Rotate any that have been shared widely.

## 2. Local browser verification (the human-only checklist)

Run `npm run dev`, log in with your `AEGIS_PASSPHRASE`, and walk CLAUDE.md §4:

- Dashboard: Today ring fills, streak, stats, recent sessions
- Mastery Map: mix of confidence colors (green/amber/gray)
- Session logger: all types (spring/dsa/behavioral/mock/quiz)
- Focus timer: counts down, completion chime, offers to log
- Quiz + Mock: pull questions, record results, confidence snapshot
- Stories: seeded story shows; recall mode works
- Notes: CRUD + pin + tag filter
- Insights: all six charts render; new user shows empty states
- Tutorial + Settings (theme/sound/goal/duration)
- Responsive at 360 / 768 / 1024 / 1440 — no horizontal scroll
- Dark and light both correct; no emojis; no layout shift

## 3. Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel (framework auto-detected as Next.js).
3. Add every var from `.env.local` to Vercel → Project → Settings → Environment Variables
   (with the production values from step 1, not the placeholders).
4. Deploy. `vercel.json` registers the two crons automatically:
   - `/api/cron/daily-nudge` — `0 2 * * *` (~07:30 IST)
   - `/api/cron/weekly-digest` — `30 3 * * 0` (~09:00 IST Sunday)
   Both require the `Authorization: Bearer ${CRON_SECRET}` header, which Vercel Cron sends.

## 4. Anti-pause GitHub Action

`.github/workflows/keep-alive.yml` pings the `ping` table every 3 days so the free Supabase
project never pauses. In GitHub → repo → Settings → Secrets and variables → Actions, add:

- `SUPABASE_URL` = your `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` = your `SUPABASE_SERVICE_ROLE_KEY`

Trigger it once manually (Actions tab → Keep Supabase Alive → Run workflow) to confirm it's green.

## 5. Go live with the real user

When you've verified everything with the test user:

1. Set `ACTIVE_USER_KEY=samprit-prod` (locally and in Vercel).
2. The `samprit-prod` user is seeded but not onboarded — log in and complete onboarding
   (sets your real start date, duration, goal, email, theme).
3. From here, Aegis runs against your real progress.

## Re-running the seed

`npm run seed` is idempotent: it skips any table that already has rows for a user, so it
only ever fills gaps — it will not clobber real progress. Safe to re-run anytime.
