import { MasteryMap } from "@/components/mastery/mastery-map";
import { getSpringConcepts } from "@/lib/queries/concepts";
import { getDsaPatterns } from "@/lib/queries/patterns";
import { getDsaProblems, isSolved } from "@/lib/queries/problems";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mastery" };

export default async function MasteryPage() {
  const [concepts, patterns, problems] = await Promise.all([
    getSpringConcepts(),
    getDsaPatterns(),
    getDsaProblems(),
  ]);

  const total = new Map<string, number>();
  const solved = new Map<string, number>();
  for (const p of problems) {
    total.set(p.pattern_id, (total.get(p.pattern_id) ?? 0) + 1);
    if (isSolved(p)) solved.set(p.pattern_id, (solved.get(p.pattern_id) ?? 0) + 1);
  }

  const conceptCards = concepts.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    confidence: c.current_confidence,
    anchor: c.taskflow_anchor,
    phase: c.phase,
  }));
  const patternCards = patterns.map((p) => ({
    id: p.id,
    title: p.title,
    confidence: p.current_confidence,
    solved: solved.get(p.id) ?? 0,
    total: total.get(p.id) ?? 0,
    phase: p.phase,
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">
          Mastery Map
        </h1>
        <p className="max-w-prose text-base text-muted">
          Every Spring concept and DSA pattern, colored by confidence. Tap one
          to see its TaskFlow anchor and your study history.
        </p>
      </header>
      <MasteryMap concepts={conceptCards} patterns={patternCards} />
    </div>
  );
}
