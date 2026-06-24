import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ConfidenceBar } from "./confidence-bar";

export interface ConceptCardData {
  id: string;
  title: string;
  category: string;
  confidence: number;
  anchor: string | null;
}

export function ConceptCard({ concept }: { concept: ConceptCardData }) {
  return (
    <Link
      href={`/mastery/spring/${concept.id}`}
      className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong"
    >
      <Card className="h-full transition-colors hover:border-line-strong">
        {/* Plain div, not CardContent: this card has no CardHeader, and
            CardContent's header-coupled pt-0/sm:pt-0 would zero the top padding. */}
        <div className="flex h-full flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium leading-snug text-fg">
              {concept.title}
            </h3>
            <span className="shrink-0 rounded border border-line px-1.5 py-0.5 text-[0.6875rem] uppercase tracking-wide text-faint">
              {concept.category}
            </span>
          </div>
          <div className="mt-auto flex flex-col gap-2">
            <ConfidenceBar value={concept.confidence} />
            {concept.anchor ? (
              <p className="truncate text-xs text-faint">{concept.anchor}</p>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
