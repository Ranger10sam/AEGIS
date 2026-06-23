import "server-only";

import { Redis } from "@upstash/redis";

let client: Redis | null = null;

/** Whether Upstash is configured. Lets caching layers degrade gracefully. */
export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

/**
 * Server-only Upstash Redis client — the hot cache for instant dashboard reads
 * and streak counters (CLAUDE.md §2). Redis is a cache, not the source of
 * truth: callers should fall back to Supabase when it is unavailable.
 */
export function getRedis(): Redis {
  if (client) return client;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Upstash Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local.",
    );
  }

  client = new Redis({ url, token });
  return client;
}

/** Returns the Redis client, or null when unconfigured (cache becomes a no-op). */
export function tryGetRedis(): Redis | null {
  return isRedisConfigured() ? getRedis() : null;
}

/** Namespaced cache keys, scoped per user_key. */
export const redisKeys = {
  dashboard: (userKey: string) => `aegis:${userKey}:dashboard`,
  streak: (userKey: string) => `aegis:${userKey}:streak`,
  suggestedFocus: (userKey: string) => `aegis:${userKey}:focus`,
} as const;

/** Default lifetime for hot cached reads (seconds). */
export const CACHE_TTL_SECONDS = 60 * 5;
