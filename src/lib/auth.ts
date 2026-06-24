/**
 * Passphrase auth (CLAUDE.md §14). These helpers are runtime-agnostic and
 * deliberately do NOT import next/headers, so the edge middleware can use them
 * too. Reading/writing the cookie happens in the caller's context (middleware
 * uses request/response cookies; server actions use next/headers).
 *
 * The secret (AEGIS_PASSPHRASE) is only ever read here, and this module is only
 * imported by the middleware and server actions — never by client code — so it
 * never reaches the browser bundle.
 */

export const AUTH_COOKIE = "aegis-auth";
export const AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * True only for an internal path safe to redirect to — guards against open
 * redirects. Rejects protocol-relative (`//host`), backslashes (`/\host`, which
 * browsers normalize to `//host`), and control chars (CR/LF header injection).
 */
export function isSafeInternalPath(
  target: string | null | undefined,
): target is string {
  return (
    typeof target === "string" &&
    target.startsWith("/") &&
    !target.startsWith("//") &&
    // eslint-disable-next-line no-control-regex
    !/[\\\x00-\x1f]/.test(target)
  );
}

/** Constant-time-ish comparison of a submitted passphrase to the configured one. */
export function verifyPassphrase(input: string): boolean {
  const expected = process.env.AEGIS_PASSPHRASE;
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < input.length; i += 1) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Opaque session token = SHA-256 of the passphrase. Deterministic so the edge
 * middleware can validate the cookie without a session store, but it is never
 * the raw passphrase. Web Crypto is available in both edge and Node runtimes.
 */
export async function sessionToken(): Promise<string> {
  const passphrase = process.env.AEGIS_PASSPHRASE;
  if (!passphrase) {
    throw new Error("AEGIS_PASSPHRASE is not set.");
  }
  const data = new TextEncoder().encode(`aegis:v1:${passphrase}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Whether a cookie value is a currently valid session token. */
export async function isValidToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  try {
    return token === (await sessionToken());
  } catch {
    return false;
  }
}

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: AUTH_MAX_AGE_SECONDS,
};

/** Cron routes authenticate with a bearer secret instead of the cookie (§16). */
export function verifyCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}
