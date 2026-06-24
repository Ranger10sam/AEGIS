import { format, parseISO } from "date-fns";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
import type { DsaProblem } from "@/lib/database.types";
import { getDsaPattern } from "@/lib/queries/patterns";
import { getProblemsForPattern } from "@/lib/queries/problems";
import { getSessionsForPattern } from "@/lib/queries/sessions";

export const dynamic = "force-dynamic";

const PHASE_LABEL: Record<number, string> = {
  1: "Phase 1",
  2: "Phase 2",
  3: "Phase 3",
};
const DIFF_TONE: Record<string, string> = {
  easy: "text-success",
  medium: "text-warning",
  hard: "text-danger",
};
const OUTCOME: Record<string, { label: string; tone: string }> = {
  solved: { label: "Solved", tone: "text-success" },
  "needed-hint": { label: "Needed a hint", tone: "text-info" },
  struggled: { label: "Struggled", tone: "text-warning" },
  revisit: { label: "Revisit", tone: "text-warning" },
  skipped: { label: "Skipped", tone: "text-faint" },
};

function lcSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ProblemRow({ p }: { p: DsaProblem }) {
  const outcome = p.outcome ? OUTCOME[p.outcome] : null;
  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
      <a
        href={`https://leetcode.com/problems/${lcSlug(p.title)}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-w-0 items-center gap-2 rounded-sm text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong"
      >
        {p.lc_number ? (
          <span className="w-10 shrink-0 font-mono text-xs text-faint">
            {p.lc_number}
          </span>
        ) : null}
        <span className="truncate text-fg group-hover:underline">
          {p.title}
        </span>
        <ExternalLink
          className="size-3 shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      </a>
      <div className="flex shrink-0 items-center gap-3 text-xs">
        <span className={`capitalize ${DIFF_TONE[p.difficulty] ?? "text-muted"}`}>
          {p.difficulty}
        </span>
        <span className={outcome ? outcome.tone : "text-faint"}>
          {outcome ? outcome.label : "—"}
        </span>
      </div>
    </li>
  );
}

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pattern = await getDsaPattern(id);
  if (!pattern) notFound();

  const [problems, sessions] = await Promise.all([
    getProblemsForPattern(pattern.id),
    getSessionsForPattern(pattern.id),
  ]);
  const solvedCount = problems.filter((p) => p.outcome === "solved").length;

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
          DSA · {PHASE_LABEL[pattern.phase]}
        </span>
        <h1 className="font-display text-2xl text-fg sm:text-3xl">
          {pattern.title}
        </h1>
        {pattern.description ? (
          <p className="max-w-prose text-base text-muted">
            {pattern.description}
          </p>
        ) : null}
      </header>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Confidence</span>
              <span className="text-fg">
                {confidenceLabel(pattern.current_confidence)}
              </span>
            </div>
            <ConfidenceBar value={pattern.current_confidence} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Problems solved</span>
            <span className="font-mono tabular-nums text-fg">
              {solvedCount}/{problems.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Last studied</span>
            <span className="text-fg">
              {pattern.last_studied
                ? format(parseISO(pattern.last_studied), "d MMM yyyy")
                : "Not yet"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core problems</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {problems.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-muted sm:px-6 sm:pb-6">
              No problems seeded for this pattern.
            </p>
          ) : (
            <ul className="divide-y divide-line border-t border-line">
              {problems.map((p) => (
                <ProblemRow key={p.id} p={p} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {sessions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Study history</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-line border-t border-line">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm text-fg">
                      {format(parseISO(s.session_date), "d MMM yyyy")}
                    </span>
                    {s.notes ? (
                      <p className="truncate text-sm text-muted">{s.notes}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-faint">
                    {s.duration_minutes}m
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
