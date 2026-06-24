import { cn } from "@/lib/utils";

/** Confidence color: untouched → quiet, low → danger, mid → warning, high → success. */
function toneFor(value: number): string {
  if (value <= 0) return "bg-elevated";
  if (value <= 2) return "bg-danger";
  if (value <= 3) return "bg-warning";
  return "bg-success";
}

const LABELS = [
  "Not started",
  "Shaky",
  "Shaky",
  "Getting there",
  "Solid",
  "Confident",
];

export function confidenceLabel(value: number): string {
  return LABELS[value] ?? "—";
}

export function ConfidenceBar({
  value,
  max = 5,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const tone = toneFor(value);
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`Confidence ${value} of ${max} — ${confidenceLabel(value)}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "h-1.5 flex-1 rounded-full",
            i < value ? tone : "bg-elevated",
          )}
        />
      ))}
    </div>
  );
}
