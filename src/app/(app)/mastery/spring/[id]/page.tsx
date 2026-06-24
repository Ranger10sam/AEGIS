import { format, parseISO } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ConfidenceBar,
  confidenceLabel,
} from "@/components/mastery/confidence-bar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSpringConcept } from "@/lib/queries/concepts";
import { getSessionsForConcept } from "@/lib/queries/sessions";

export const dynamic = "force-dynamic";

const PHASE_LABEL: Record<number, string> = {
  1: "Phase 1",
  2: "Phase 2",
  3: "Phase 3",
};

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = await getSpringConcept(id);
  if (!concept) notFound();

  const sessions = await getSessionsForConcept(concept.id);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/mastery"
        className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm text-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Mastery Map
      </Link>

      <header className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
          {concept.category} · {PHASE_LABEL[concept.phase]}
        </span>
        <h1 className="font-display text-2xl text-fg sm:text-3xl">
          {concept.title}
        </h1>
        {concept.description ? (
          <p className="max-w-prose text-base text-muted">
            {concept.description}
          </p>
        ) : null}
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Confidence</span>
                <span className="text-fg">
                  {confidenceLabel(concept.current_confidence)}
                </span>
              </div>
              <ConfidenceBar value={concept.current_confidence} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Depth</span>
                <span className="font-mono tabular-nums text-fg">
                  {concept.current_depth} / 5
                </span>
              </div>
              <ConfidenceBar value={concept.current_depth} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3 p-5 text-sm sm:p-6">
            {concept.taskflow_anchor ? (
              <div className="flex flex-col gap-0.5">
                <span className="text-muted">In TaskFlow</span>
                <span className="text-fg">{concept.taskflow_anchor}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-muted">Times studied</span>
              <span className="font-mono tabular-nums text-fg">
                {concept.times_studied}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Last studied</span>
              <span className="text-fg">
                {concept.last_studied
                  ? format(parseISO(concept.last_studied), "d MMM yyyy")
                  : "Not yet"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study history</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sessions.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-muted sm:px-6 sm:pb-6">
              No sessions logged for this concept yet.
            </p>
          ) : (
            <ul className="divide-y divide-line border-t border-line">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-start gap-3 px-5 py-3.5 sm:px-6">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm text-fg">
                      {format(parseISO(s.session_date), "d MMM yyyy")}
                    </span>
                    {s.notes ? (
                      <p className="text-sm text-muted">{s.notes}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5 font-mono text-xs tabular-nums text-faint">
                    <span>{s.duration_minutes}m</span>
                    {s.spring_confidence !== null ? (
                      <span>conf {s.spring_confidence}/5</span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
