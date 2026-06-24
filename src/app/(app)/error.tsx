"use client";

import { Button } from "@/components/ui/button";

/** Catches errors thrown while rendering an (app) page (e.g. a failed read). */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-2xl text-fg">Something went sideways</h1>
      <p className="max-w-md text-sm text-muted">
        That screen couldn&apos;t load — usually a momentary connection hiccup.
        Try again, and if it persists, check your Supabase connection.
      </p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
