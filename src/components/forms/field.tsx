import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A labelled form row: label, control, and an optional hint beneath.
 *
 * - With `htmlFor`, renders a real <label> tied to that control, and the hint
 *   gets id `${htmlFor}-hint` so the control can reference it via
 *   aria-describedby.
 * - Without `htmlFor` (e.g. a slider group whose control is labelled another
 *   way), renders the label text as a <span> rather than an orphaned <label>.
 */
export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const labelClass = "text-sm font-medium text-fg";
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelClass}>
          {label}
        </label>
      ) : (
        <span className={labelClass}>{label}</span>
      )}
      {children}
      {hint ? (
        <p
          id={htmlFor ? `${htmlFor}-hint` : undefined}
          className="text-xs text-faint"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
