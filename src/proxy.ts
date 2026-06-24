import { NextResponse, type NextRequest } from "next/server";

import { AUTH_COOKIE, isValidToken } from "@/lib/auth";

/**
 * Gate the whole app behind the passphrase cookie (CLAUDE.md §14). /login is
 * always reachable; /api/cron carries its own bearer-secret auth.
 *
 * Next 16 renamed the "middleware" convention to "proxy" (same behavior) — see
 * the project AGENTS.md note about heeding Next 16 deprecations.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cron endpoints verify CRON_SECRET themselves — let them through.
  // Segment-anchored so it can't exempt sibling routes like /api/cron-public.
  if (pathname === "/api/cron" || pathname.startsWith("/api/cron/")) {
    return NextResponse.next();
  }

  const authed = await isValidToken(request.cookies.get(AUTH_COOKIE)?.value);

  if (pathname === "/login") {
    // Already signed in? Skip the login screen.
    return authed
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next();
  }

  if (!authed) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Exact asset names (not bare `manifest`, which would also exempt /manifest*).
  matcher: ["/((?!_next|favicon.ico|manifest.webmanifest|sw.js).*)"],
};
