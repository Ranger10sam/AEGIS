import Link from "next/link";

import type { PhaseState } from "@/lib/phase";

/**
 * Slim sticky header showing the current phase, week, and overall progress.
 * On mobile it also carries the wordmark (the sidebar is hidden there).
 * Presentational — it receives a derived PhaseState (CLAUDE.md §5).
 */
export function PhaseBar({ phase }: { phase: PhaseState }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-line bg-canvas/85 px-4 backdrop-blur sm:gap-3 sm:px-6">
      <Link
        href="/dashboard"
        className="shrink-0 rounded-sm font-display text-lg text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong lg:hidden"
      >
        Aegis
      </Link>

      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-fg">
          Phase {phase.current}
          {/* Label only once there's room — keeps the 360px row from overflowing. */}
          <span className="hidden sm:inline"> · {phase.label}</span>
        </span>
        <span className="hidden truncate text-sm text-muted md:inline">
          {phase.description}
        </span>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
        <span className="hidden font-mono text-xs text-muted sm:inline">
          Week {phase.weekNumber} / {phase.totalWeeks}
        </span>
        <div
          className="h-1.5 w-16 overflow-hidden rounded-full bg-elevated sm:w-24"
          role="progressbar"
          aria-valuenow={phase.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Preparation progress"
        >
          <div
            className="h-full rounded-full bg-fg"
            style={{ width: `${phase.progressPercent}%` }}
          />
        </div>
        <span className="font-mono text-xs tabular-nums text-muted">
          {phase.progressPercent}%
        </span>
      </div>
    </header>
  );
}
