import Link from "next/link";

import { Button, Card, CardContent } from "@/components/ui";
import type { SpringConcept } from "@/lib/database.types";

export function SuggestedFocus({
  concept,
  phase,
}: {
  concept: SpringConcept | null;
  phase: number;
}) {
  if (!concept) return null;
  const lead = phase >= 3 ? "Weakest link" : "Suggested focus";

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5 sm:p-6">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
            {lead}
          </span>
          <p className="text-base font-medium text-fg">{concept.title}</p>
          <p className="truncate text-sm text-muted">
            {concept.taskflow_anchor ?? "Tie it back to TaskFlow."}
          </p>
        </div>
        <Button asChild variant="secondary" className="shrink-0">
          <Link href={`/mastery/spring/${concept.id}`}>Study</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
