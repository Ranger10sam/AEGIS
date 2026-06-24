import { FocusTimer } from "@/components/focus/focus-timer";
import { getUserConfig } from "@/lib/queries/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Focus" };

export default async function FocusPage() {
  const config = await getUserConfig();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">Focus</h1>
        <p className="max-w-prose text-base text-muted">
          Set a timer and study one thing. When it ends, log the session while
          it&apos;s still fresh.
        </p>
      </header>

      <FocusTimer soundEnabled={config?.sound_enabled ?? true} />
    </div>
  );
}
