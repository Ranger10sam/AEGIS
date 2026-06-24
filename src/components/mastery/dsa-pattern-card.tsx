import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ConfidenceBar, confidenceLabel } from "./confidence-bar";

export interface PatternCardData {
  id: string;
  title: string;
  confidence: number;
  solved: number;
  total: number;
}

export function DSAPatternCard({ pattern }: { pattern: PatternCardData }) {
  return (
    <Link
      href={`/mastery/dsa/${pattern.id}`}
      className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong"
    >
      <Card className="h-full transition-colors hover:border-line-strong">
        {/* Plain div, not CardContent: no CardHeader here, so CardContent's
            pt-0/sm:pt-0 would collapse the top padding. */}
        <div className="flex h-full flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium leading-snug text-fg">
              {pattern.title}
            </h3>
            <span className="shrink-0 font-mono text-xs tabular-nums text-faint">
              {pattern.solved}/{pattern.total}
            </span>
          </div>
          <div className="mt-auto flex flex-col gap-2">
            <ConfidenceBar value={pattern.confidence} />
            <p className="text-xs text-faint">
              {confidenceLabel(pattern.confidence)}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
