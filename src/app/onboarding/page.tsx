import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { todayISO } from "@/lib/date";
import { getUserConfig } from "@/lib/queries/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Welcome" };

export default async function OnboardingPage() {
  const config = await getUserConfig();
  if (config?.onboarded) {
    redirect("/dashboard");
  }

  const defaults = {
    display_name: config?.display_name ?? "Samprit",
    target_role: config?.target_role ?? "Backend Java/Spring Boot",
    start_date: config?.start_date ?? todayISO(config?.timezone),
    duration_weeks: config?.duration_weeks ?? 16,
    daily_minutes_goal: config?.daily_minutes_goal ?? 45,
    email: config?.email ?? "",
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-4 py-12">
      <div className="mb-8 flex flex-col gap-2">
        <span className="font-display text-3xl text-fg">Welcome to Aegis</span>
        <p className="text-base text-muted">
          A few details and you&apos;re set. This shapes your phases and your
          daily goal — you can change any of it later in settings.
        </p>
      </div>
      <div className="rounded-lg border border-line bg-surface p-5 sm:p-6">
        <OnboardingForm defaults={defaults} />
      </div>
    </main>
  );
}
