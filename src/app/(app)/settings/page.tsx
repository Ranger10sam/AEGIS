import { PushControl } from "@/components/settings/push-control";
import { SettingsForm } from "@/components/settings/settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { todayISO } from "@/lib/date";
import { getUserConfig } from "@/lib/queries/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  // The (app) layout guarantees an onboarded config before we get here; fall
  // back defensively just in case.
  const config = await getUserConfig();

  const values = {
    display_name: config?.display_name ?? "Samprit",
    target_role: config?.target_role ?? "Backend Java/Spring Boot",
    start_date: config?.start_date ?? todayISO(config?.timezone),
    duration_weeks: config?.duration_weeks ?? 16,
    daily_minutes_goal: config?.daily_minutes_goal ?? 45,
    email: config?.email ?? "",
    timezone: config?.timezone ?? "Asia/Kolkata",
    sound_enabled: config?.sound_enabled ?? true,
    push_enabled: config?.push_enabled ?? false,
    theme: config?.theme ?? "dark",
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">Settings</h1>
        <p className="max-w-prose text-base text-muted">
          Theme, sounds, notifications, your daily goal, and prep duration — all
          in one calm place.
        </p>
      </header>
      <SettingsForm values={values} />

      <Card>
        <CardHeader>
          <CardTitle>Browser notifications</CardTitle>
          <CardDescription>
            Separate from the in-app sound toggle — this subscribes this device
            to push, so nudges reach you even when Aegis is closed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PushControl vapidPublicKey={process.env.VAPID_PUBLIC_KEY ?? null} />
        </CardContent>
      </Card>
    </div>
  );
}
