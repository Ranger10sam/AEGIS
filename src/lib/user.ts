/**
 * The single-user identity (CLAUDE.md §4). All rows are namespaced by user_key.
 *
 *  - test-aegis-2026 → pre-seeded test user, used during development
 *  - samprit-prod    → the real user, onboards fresh
 *
 * The active key comes from ACTIVE_USER_KEY (a server-side env var), defaulting
 * to the test user. Switch it to 'samprit-prod' when going live.
 */
export const TEST_USER_KEY = "test-aegis-2026";
export const PROD_USER_KEY = "samprit-prod";

export function getActiveUserKey(): string {
  return process.env.ACTIVE_USER_KEY?.trim() || TEST_USER_KEY;
}
