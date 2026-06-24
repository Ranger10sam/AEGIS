"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { saveSettings } from "@/app/(app)/settings/actions";
import { Field } from "@/components/forms/field";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { FormState } from "@/lib/form-state";

export interface SettingsValues {
  display_name: string;
  target_role: string;
  start_date: string;
  duration_weeks: number;
  daily_minutes_goal: number;
  email: string;
  timezone: string;
  sound_enabled: boolean;
  push_enabled: boolean;
  theme: string;
}

const initial: FormState = { error: null };
const ERROR_ID = "settings-error";

export function SettingsForm({ values }: { values: SettingsValues }) {
  const [state, action, pending] = React.useActionState(saveSettings, initial);
  const [goal, setGoal] = React.useState<number[]>([values.daily_minutes_goal]);

  // Persist the live next-themes choice; fall back to the stored theme pre-mount.
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const themeValue = (mounted && theme) || values.theme;

  function describe(name: string, hintId?: string) {
    const invalid = state.field === name;
    const ids = [hintId, invalid ? ERROR_ID : null].filter(Boolean);
    return {
      "aria-invalid": invalid || undefined,
      "aria-describedby": ids.length ? ids.join(" ") : undefined,
    };
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="theme" value={themeValue} />

      <Card>
        <CardHeader>
          <CardTitle>Profile &amp; plan</CardTitle>
          <CardDescription>
            Your name, target role, and the shape of your prep. Changing the
            start date or duration re-derives your phase.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Field label="Display name" htmlFor="display_name">
            <Input
              id="display_name"
              name="display_name"
              defaultValue={values.display_name}
              maxLength={60}
              required
              {...describe("display_name")}
            />
          </Field>
          <Field label="Target role" htmlFor="target_role">
            <Input
              id="target_role"
              name="target_role"
              defaultValue={values.target_role}
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
                defaultValue={values.start_date}
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
                defaultValue={values.duration_weeks}
                required
                {...describe("duration_weeks")}
              />
            </Field>
          </div>
          <Field label="Daily goal">
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
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" htmlFor="email" hint="For nudges and the digest.">
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={values.email}
                placeholder="you@example.com"
                {...describe("email", "email-hint")}
              />
            </Field>
            <Field label="Timezone" htmlFor="timezone">
              <Input
                id="timezone"
                name="timezone"
                defaultValue={values.timezone}
                placeholder="Asia/Kolkata"
                {...describe("timezone")}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Theme, sounds, and notifications.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Field label="Theme">
            <ThemeToggle />
          </Field>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="sound_enabled" className="text-sm font-medium text-fg">
              Session sounds
            </label>
            <Switch
              id="sound_enabled"
              name="sound_enabled"
              defaultChecked={values.sound_enabled}
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <label htmlFor="push_enabled" className="flex flex-col gap-1">
              <span className="text-sm font-medium text-fg">
                Push notifications
              </span>
              <span className="text-xs text-faint">
                Saves the preference; the subscription is wired up later.
              </span>
            </label>
            <Switch
              id="push_enabled"
              name="push_enabled"
              defaultChecked={values.push_enabled}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        {state.ok ? (
          <span role="status" className="text-sm text-success">
            Saved.
          </span>
        ) : null}
        {state.error ? (
          <span id={ERROR_ID} role="alert" className="text-sm text-danger">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
