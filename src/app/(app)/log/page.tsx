import { SessionLogger } from "@/components/log/session-logger";
import { getSpringConcepts } from "@/lib/queries/concepts";
import { getDsaPatterns } from "@/lib/queries/patterns";

export const dynamic = "force-dynamic";
export const metadata = { title: "Log session" };

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ minutes?: string }>;
}) {
  const [{ minutes }, concepts, patterns] = await Promise.all([
    searchParams,
    getSpringConcepts(),
    getDsaPatterns(),
  ]);

  // Optional duration handed off from the focus timer (/log?minutes=25),
  // snapped to the slider's 5-minute step and clamped to its range.
  const parsedMinutes = Number(minutes);
  const initialDuration = Number.isFinite(parsedMinutes)
    ? Math.min(180, Math.max(5, Math.round(parsedMinutes / 5) * 5))
    : 45;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">
          Log a session
        </h1>
        <p className="max-w-prose text-base text-muted">
          Record what you studied — the concept or pattern, how deep you went,
          and how confident you feel. Honest ratings are what make this useful.
        </p>
      </header>

      <SessionLogger
        initialDuration={initialDuration}
        concepts={concepts.map((c) => ({
          id: c.id,
          title: c.title,
          phase: c.phase,
          depth: c.current_depth,
          confidence: c.current_confidence,
        }))}
        patterns={patterns.map((p) => ({
          id: p.id,
          title: p.title,
          phase: p.phase,
          confidence: p.current_confidence,
        }))}
      />
    </div>
  );
}
