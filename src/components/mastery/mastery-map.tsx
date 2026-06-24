"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConceptCard, type ConceptCardData } from "./concept-card";
import { DSAPatternCard, type PatternCardData } from "./dsa-pattern-card";

const PHASES = [
  { n: 1, label: "Phase 1 · Foundation" },
  { n: 2, label: "Phase 2 · Depth" },
  { n: 3, label: "Phase 3 · Advanced" },
];

type WithPhase<T> = T & { phase: number };

function PhaseHeading({ label }: { label: string }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
      {label}
    </h2>
  );
}

export function MasteryMap({
  concepts,
  patterns,
}: {
  concepts: WithPhase<ConceptCardData>[];
  patterns: WithPhase<PatternCardData>[];
}) {
  return (
    <Tabs defaultValue="spring">
      <TabsList>
        <TabsTrigger value="spring">Spring ({concepts.length})</TabsTrigger>
        <TabsTrigger value="dsa">DSA ({patterns.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="spring" className="flex flex-col gap-6">
        {PHASES.map((ph) => {
          const items = concepts.filter((c) => c.phase === ph.n);
          if (!items.length) return null;
          return (
            <section key={ph.n} className="flex flex-col gap-3">
              <PhaseHeading label={ph.label} />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <ConceptCard key={c.id} concept={c} />
                ))}
              </div>
            </section>
          );
        })}
      </TabsContent>

      <TabsContent value="dsa" className="flex flex-col gap-6">
        {PHASES.map((ph) => {
          const items = patterns.filter((p) => p.phase === ph.n);
          if (!items.length) return null;
          return (
            <section key={ph.n} className="flex flex-col gap-3">
              <PhaseHeading label={ph.label} />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <DSAPatternCard key={p.id} pattern={p} />
                ))}
              </div>
            </section>
          );
        })}
      </TabsContent>
    </Tabs>
  );
}
