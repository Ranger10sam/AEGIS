"use client";

import * as React from "react";

import { logSession } from "@/app/(app)/log/actions";
import { Field } from "@/components/forms/field";
import {
  Button,
  Card,
  CardContent,
  Segmented,
  Select,
  Slider,
  Textarea,
  toast,
} from "@/components/ui";
import type { FormState } from "@/lib/form-state";

export interface ConceptOption {
  id: string;
  title: string;
  phase: number;
  depth: number;
  confidence: number;
}
export interface PatternOption {
  id: string;
  title: string;
  phase: number;
  confidence: number;
}

const TYPES = [
  { value: "spring", label: "Spring" },
  { value: "dsa", label: "DSA" },
  { value: "behavioral", label: "Behavioral" },
  { value: "mock", label: "Mock" },
  { value: "quiz", label: "Quiz" },
  { value: "mixed", label: "Mixed" },
] as const;

const MOODS = [
  { value: "sharp", label: "Sharp" },
  { value: "okay", label: "Okay" },
  { value: "tired", label: "Tired" },
] as const;

const PHASE_LABEL: Record<number, string> = {
  1: "Phase 1 · Foundation",
  2: "Phase 2 · Depth",
  3: "Phase 3 · Advanced",
};

const initial: FormState = { error: null };
const ERROR_ID = "log-error";

function groupByPhase<T extends { phase: number }>(items: T[]) {
  return [1, 2, 3]
    .map((phase) => ({ phase, items: items.filter((i) => i.phase === phase) }))
    .filter((g) => g.items.length > 0);
}

export function SessionLogger({
  concepts,
  patterns,
  initialDuration = 45,
}: {
  concepts: ConceptOption[];
  patterns: PatternOption[];
  initialDuration?: number;
}) {
  const [state, action, pending] = React.useActionState(logSession, initial);

  const [type, setType] = React.useState<string>("spring");
  const [conceptId, setConceptId] = React.useState("");
  const [depth, setDepth] = React.useState<number[]>([3]);
  const [confidence, setConfidence] = React.useState<number[]>([3]);
  const [patternId, setPatternId] = React.useState("");
  const [patternConfidence, setPatternConfidence] = React.useState<number[]>([3]);
  const [duration, setDuration] = React.useState<number[]>([initialDuration]);
  const [mood, setMood] = React.useState<string>("okay");
  const [notes, setNotes] = React.useState("");

  // Satisfying confirmation + clear notes once a session is logged.
  React.useEffect(() => {
    if (state.ok) {
      toast({
        title: "Session logged",
        description: "Tracked — and your streak is updated.",
        variant: "success",
      });
      setNotes("");
    }
  }, [state]);

  function onConceptChange(id: string) {
    setConceptId(id);
    const c = concepts.find((x) => x.id === id);
    if (c) {
      setDepth([c.depth]);
      setConfidence([c.confidence]);
    }
  }
  function onPatternChange(id: string) {
    setPatternId(id);
    const p = patterns.find((x) => x.id === id);
    if (p) setPatternConfidence([p.confidence]);
  }

  const conceptGroups = groupByPhase(concepts);
  const patternGroups = groupByPhase(patterns);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="duration_minutes" value={duration[0]} />

      <Card>
        <CardContent className="flex flex-col gap-6 p-5 sm:p-6">
          <Field label="What kind of session?">
            <Segmented
              name="type"
              ariaLabel="Session type"
              value={type}
              onValueChange={setType}
              options={TYPES.map((t) => ({ value: t.value, label: t.label }))}
            />
          </Field>

          {type === "spring" ? (
            <div className="flex flex-col gap-5">
              <Field label="Concept" htmlFor="spring_concept_id">
                <Select
                  id="spring_concept_id"
                  name="spring_concept_id"
                  value={conceptId}
                  onChange={(e) => onConceptChange(e.target.value)}
                  aria-invalid={state.field === "spring_concept_id" || undefined}
                  aria-describedby={
                    state.field === "spring_concept_id" ? ERROR_ID : undefined
                  }
                >
                  <option value="" disabled>
                    Select a concept…
                  </option>
                  {conceptGroups.map((g) => (
                    <optgroup key={g.phase} label={PHASE_LABEL[g.phase]}>
                      {g.items.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <RatingSlider
                  label="Depth"
                  name="spring_depth"
                  value={depth}
                  onChange={setDepth}
                />
                <RatingSlider
                  label="Confidence"
                  name="spring_confidence"
                  value={confidence}
                  onChange={setConfidence}
                />
              </div>
            </div>
          ) : null}

          {type === "dsa" ? (
            <div className="flex flex-col gap-5">
              <Field label="Pattern" htmlFor="dsa_pattern_id">
                <Select
                  id="dsa_pattern_id"
                  name="dsa_pattern_id"
                  value={patternId}
                  onChange={(e) => onPatternChange(e.target.value)}
                  aria-invalid={state.field === "dsa_pattern_id" || undefined}
                  aria-describedby={
                    state.field === "dsa_pattern_id" ? ERROR_ID : undefined
                  }
                >
                  <option value="" disabled>
                    Select a pattern…
                  </option>
                  {patternGroups.map((g) => (
                    <optgroup key={g.phase} label={PHASE_LABEL[g.phase]}>
                      {g.items.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              </Field>
              <RatingSlider
                label="Confidence"
                name="dsa_confidence"
                value={patternConfidence}
                onChange={setPatternConfidence}
              />
            </div>
          ) : null}

          <Field label="Duration">
            <div className="flex items-center gap-4">
              <Slider
                tone="neutral"
                min={5}
                max={180}
                step={5}
                value={duration}
                onValueChange={setDuration}
                aria-label="Duration in minutes"
                className="flex-1"
              />
              <span className="w-16 shrink-0 text-right font-mono text-sm text-muted">
                {duration[0]} min
              </span>
            </div>
          </Field>

          <Field label="How did it feel?">
            <Segmented
              name="mood"
              ariaLabel="Mood"
              value={mood}
              onValueChange={setMood}
              options={MOODS.map((m) => ({ value: m.value, label: m.label }))}
            />
          </Field>

          <Field
            label="Notes"
            htmlFor="notes"
            hint="What clicked, what to revisit. Be honest — it only helps if it's true."
          >
            <Textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Propagation finally clicked: REQUIRES_NEW vs REQUIRED."
              aria-describedby="notes-hint"
            />
          </Field>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? "Logging…" : "Log session"}
        </Button>
        {state.error ? (
          <span id={ERROR_ID} role="alert" className="text-sm text-danger">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}

/** A 0–5 self-rating slider with a live value read-out (gold "your level" tone). */
function RatingSlider({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: number[];
  onChange: (v: number[]) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-4">
        <Slider
          min={0}
          max={5}
          step={1}
          value={value}
          onValueChange={onChange}
          aria-label={`${label} from 0 to 5`}
          className="flex-1"
        />
        <span className="w-10 shrink-0 text-right font-mono text-sm text-muted">
          {value[0]} / 5
        </span>
      </div>
      <input type="hidden" name={name} value={value[0]} />
    </Field>
  );
}
