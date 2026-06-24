"use client";

import * as React from "react";

import { saveWeeklyReview } from "@/app/(app)/weekly/actions";
import { Field } from "@/components/forms/field";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
  toast,
} from "@/components/ui";
import type { FormState } from "@/lib/form-state";

const initial: FormState = { error: null };

const FIELDS = [
  {
    name: "words_from_you",
    label: "How did the week go?",
    placeholder: "A few honest words…",
  },
  {
    name: "strongest_area",
    label: "Strongest area",
    placeholder: "What clicked this week.",
  },
  {
    name: "weakest_area",
    label: "Weakest area",
    placeholder: "What's still shaky.",
  },
  {
    name: "next_week_focus",
    label: "Next week's focus",
    placeholder: "One or two things to drill.",
  },
] as const;

export function WeeklyForm({
  weekNumber,
  suggestedWeakest,
}: {
  weekNumber: number;
  suggestedWeakest?: string;
}) {
  const [state, action, pending] = React.useActionState(
    saveWeeklyReview,
    initial,
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) {
      toast({ title: "Weekly review saved", variant: "success" });
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week {weekNumber} review</CardTitle>
        <CardDescription>
          A short, honest reflection. It feeds your weekly digest email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="flex flex-col gap-4">
          <input type="hidden" name="week_number" value={weekNumber} />
          {FIELDS.map((f) => (
            <Field key={f.name} label={f.label} htmlFor={`weekly-${f.name}`}>
              <Textarea
                id={`weekly-${f.name}`}
                name={f.name}
                placeholder={f.placeholder}
                defaultValue={
                  f.name === "weakest_area" ? (suggestedWeakest ?? "") : ""
                }
              />
            </Field>
          ))}
          {state.error ? (
            <p role="alert" className="text-sm text-danger">
              {state.error}
            </p>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
