"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * The signature element (CLAUDE.md §1): a single gold circular progress ring
 * that fills as you reach today's minutes goal. The boldness budget is spent
 * here — smooth SVG arc, the accent gold, a satisfying fill on completion.
 * Everything else in the app stays quiet.
 */
export function TodayRing({ minutes, goal }: { minutes: number; goal: number }) {
  const reduce = useReducedMotion();
  const safeGoal = Math.max(1, goal);
  const fraction = Math.min(1, minutes / safeGoal);
  const met = goal > 0 && minutes >= goal;
  const percent = Math.round(fraction * 100);

  const R = 120;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - fraction);

  return (
    <div
      className="relative grid size-60 place-items-center sm:size-64"
      role="img"
      aria-label={`Today: ${minutes} of ${goal} minutes (${percent}%)`}
    >
      <svg viewBox="0 0 280 280" className="size-full -rotate-90" aria-hidden>
        <circle
          cx="140"
          cy="140"
          r={R}
          className="fill-none stroke-elevated"
          strokeWidth="14"
        />
        <motion.circle
          cx="140"
          cy="140"
          r={R}
          className="fill-none stroke-accent"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: reduce ? offset : CIRC }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" aria-hidden>
        <span className="font-mono text-5xl tabular-nums text-fg sm:text-6xl">
          {minutes}
        </span>
        <span className="mt-1 text-sm text-muted">of {goal} min today</span>
        {met ? (
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent">
            <Check className="size-4" aria-hidden />
            Goal met
          </span>
        ) : (
          <span className="mt-2 font-mono text-xs text-faint">{percent}%</span>
        )}
      </div>
    </div>
  );
}
