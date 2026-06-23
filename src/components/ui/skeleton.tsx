import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Placeholder block that reserves layout space while async data loads, so
 * nothing jumps when it arrives (CLAUDE.md §1: "No jitter, no layout shift").
 * The pulse is neutralized automatically under prefers-reduced-motion.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-elevated", className)}
      {...props}
    />
  );
}

export { Skeleton };
