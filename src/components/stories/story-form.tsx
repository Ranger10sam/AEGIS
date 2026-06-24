"use client";

import * as React from "react";

import { saveStory } from "@/app/(app)/stories/actions";
import { Field } from "@/components/forms/field";
import { Button, Slider, Textarea } from "@/components/ui";
import type { Story } from "@/lib/database.types";
import type { FormState } from "@/lib/form-state";

const initial: FormState = { error: null };

export interface ConceptOption {
  id: string;
  title: string;
}

const STAR_FIELDS = [
  { name: "situation", label: "Situation" },
  { name: "task", label: "Task" },
  { name: "action", label: "Action" },
  { name: "result", label: "Result" },
] as const;

export function StoryForm({
  concepts,
  story,
  onSaved,
}: {
  concepts: ConceptOption[];
  story?: Story;
  onSaved: () => void;
}) {
  const [state, action, pending] = React.useActionState(saveStory, initial);
  const [confidence, setConfidence] = React.useState<number[]>([
    story?.confidence ?? 0,
  ]);
  const linked = new Set(story?.linked_concept_ids ?? []);

  React.useEffect(() => {
    if (state.ok) onSaved();
  }, [state, onSaved]);

  return (
    <form action={action} className="flex flex-col gap-4">
      {story ? <input type="hidden" name="id" value={story.id} /> : null}

      <Field label="Question" htmlFor="story-question">
        <Textarea
          id="story-question"
          name="question"
          defaultValue={story?.question ?? ""}
          placeholder="Tell me about a time…"
          required
          aria-invalid={state.field === "question" || undefined}
          aria-describedby={state.field === "question" ? "story-error" : undefined}
        />
      </Field>

      {STAR_FIELDS.map((f) => (
        <Field key={f.name} label={f.label} htmlFor={`story-${f.name}`}>
          <Textarea
            id={`story-${f.name}`}
            name={f.name}
            defaultValue={(story?.[f.name] as string | null) ?? ""}
          />
        </Field>
      ))}

      <Field label="Linked concepts" hint="Tie this story to what it demonstrates.">
        <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-md border border-line p-2">
          {concepts.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 rounded px-1 py-1 text-sm text-fg hover:bg-elevated"
            >
              <input
                type="checkbox"
                name="concepts"
                value={c.id}
                defaultChecked={linked.has(c.id)}
                className="size-4 accent-accent"
              />
              {c.title}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Confidence">
        <div className="flex items-center gap-4">
          <Slider
            min={0}
            max={5}
            step={1}
            value={confidence}
            onValueChange={setConfidence}
            aria-label="Story confidence from 0 to 5"
            className="flex-1"
          />
          <span className="w-10 shrink-0 text-right font-mono text-sm text-muted">
            {confidence[0]}/5
          </span>
        </div>
        <input type="hidden" name="confidence" value={confidence[0]} />
      </Field>

      {state.error ? (
        <p id="story-error" role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : story ? "Save changes" : "Add story"}
        </Button>
      </div>
    </form>
  );
}
