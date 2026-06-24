"use client";

// Last-resort boundary: catches errors that propagate past the (app)/error.tsx
// segment boundary — notably a config-load failure thrown inside (app)/layout
// itself, and any throw on the top-level /onboarding route. Renders its own
// <html>/<body> (it replaces the root layout). Dark-first; system sans fallback.
import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh bg-canvas font-sans text-fg antialiased">
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Something broke
          </h1>
          <p className="max-w-md text-sm text-muted">
            Aegis hit an unexpected error. Try again — if it keeps happening,
            check your Supabase connection and environment variables.
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-fg px-4 text-sm font-medium text-canvas transition-colors hover:bg-fg/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
