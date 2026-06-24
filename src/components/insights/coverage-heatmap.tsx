import { cn } from "@/lib/utils";
import { EmptyChart } from "./chart-card";

function tone(c: number): string {
  if (c <= 0) return "bg-elevated";
  if (c <= 2) return "bg-danger";
  if (c <= 3) return "bg-warning";
  return "bg-success";
}

export interface CoverageCell {
  id: string;
  title: string;
  confidence: number;
}

export function CoverageHeatmap({ concepts }: { concepts: CoverageCell[] }) {
  if (concepts.length === 0)
    return <EmptyChart message="No concepts seeded yet." />;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-12">
        {concepts.map((c) => (
          <div
            key={c.id}
            title={`${c.title}: ${c.confidence}/5`}
            aria-label={`${c.title}, confidence ${c.confidence} of 5`}
            className={cn("aspect-square rounded", tone(c.confidence))}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-faint">
        <span>Low</span>
        <span className="size-3 rounded bg-danger" aria-hidden />
        <span className="size-3 rounded bg-warning" aria-hidden />
        <span className="size-3 rounded bg-success" aria-hidden />
        <span>High</span>
      </div>
    </div>
  );
}
