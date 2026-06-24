"use client";

import * as React from "react";

import { completeOnboarding } from "@/app/onboarding/actions";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { FormState } from "@/lib/form-state";

export interface OnboardingDefaults {
  display_name: string;
  target_role: string;
  start_date: string;
  duration_weeks: number;
  daily_minutes_goal: number;
  email: string;
}

const initial: FormState = { error: null };
const ERROR_ID = "onboarding-error";

export function OnboardingForm({ defaults }: { defaults: OnboardingDefaults }) {
  const [state, action, pending] = React.useActionState(
    completeOnboarding,
    initial,
  );
  const [goal, setGoal] = React.useState<number[]>([
    defaults.daily_minutes_goal,
  ]);

  // Tie a validation error to the field it came from for assistive tech.
  function describe(name: string, hintId?: string) {
    const invalid = state.field === name;
    const ids = [hintId, invalid ? ERROR_ID : null].filter(Boolean);
    return {
      "aria-invalid": invalid || undefined,
      "aria-describedby": ids.length ? ids.join(" ") : undefined,
    };
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="What should I call you?" htmlFor="display_name">
        <Input
          id="display_name"
          name="display_name"
          defaultValue={defaults.display_name}
          maxLength={60}
          required
          autoFocus
          {...describe("display_name")}
        />
      </Field>

      <Field label="Target role" htmlFor="target_role">
        <Input
          id="target_role"
          name="target_role"
          defaultValue={defaults.target_role}
          maxLength={80}
          required
          {...describe("target_role")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Start date" htmlFor="start_date">
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={defaults.start_date}
            required
            {...describe("start_date")}
          />
        </Field>
        <Field label="Prep duration (weeks)" htmlFor="duration_weeks">
          <Input
            id="duration_weeks"
            name="duration_weeks"
            type="number"
            min={4}
            max={52}
            defaultValue={defaults.duration_weeks}
            required
            {...describe("duration_weeks")}
          />
        </Field>
      </div>

      <Field
        label="Daily goal"
        hint="Minutes a day. Start small — showing up matters more than length."
      >
        <div className="flex items-center gap-4">
          <Slider
            tone="neutral"
            min={10}
            max={180}
            step={5}
            value={goal}
            onValueChange={setGoal}
            aria-label="Daily goal in minutes"
            className="flex-1"
          />
          <span className="w-16 shrink-0 text-right font-mono text-sm text-muted">
            {goal[0]} min
          </span>
        </div>
        <input type="hidden" name="daily_minutes_goal" value={goal[0]} />
      </Field>

      <Field
        label="Email"
        htmlFor="email"
        hint="Optional — for the daily nudge and weekly digest."
      >
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={defaults.email}
          placeholder="you@example.com"
          {...describe("email", "email-hint")}
        />
      </Field>

      {state.error ? (
        <p id={ERROR_ID} role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" variant="accent" disabled={pending} className="w-full">
        {pending ? "Setting up…" : "Begin"}
      </Button>
    </form>
  );
}
