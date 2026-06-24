import { format, parseISO } from "date-fns";
import { redirect } from "next/navigation";

import { WeeklyForm } from "@/components/weekly/weekly-form";
import { Card, CardContent } from "@/components/ui/card";
import type { WeeklyReview } from "@/lib/database.types";
import { suggestTodaysFocus } from "@/lib/gaps";
import { derivePhase } from "@/lib/phase";
import { getSpringConcepts } from "@/lib/queries/concepts";
import { getUserConfig } from "@/lib/queries/config";
import { getWeeklyReviews } from "@/lib/queries/weekly";

export const dynamic = "force-dynamic";
export const metadata = { title: "Weekly review" };

const SECTIONS: { key: keyof WeeklyReview; label: string }[] = [
  { key: "words_from_you", label: "The week" },
  { key: "strongest_area", label: "Strongest" },
  { key: "weakest_area", label: "Weakest" },
  { key: "next_week_focus", label: "Next focus" },
];

function ReviewCard({ review }: { review: WeeklyReview }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium text-fg">{review.week_label}</span>
          <span className="text-xs text-faint">
            {format(parseISO(review.created_at), "d MMM yyyy")}
          </span>
        </div>
        {SECTIONS.map((s) => {
          const value = review[s.key] as string | null;
          if (!value) return null;
          return (
            <div key={s.key} className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wide text-faint">
                {s.label}
              </span>
              <p className="whitespace-pre-line text-sm text-muted">{value}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default async function WeeklyPage() {
  const config = await getUserConfig();
  if (!config) redirect("/onboarding");

  const phase = derivePhase(
    config.start_date,
    config.duration_weeks,
    config.daily_minutes_goal,
  );
  const [reviews, concepts] = await Promise.all([
    getWeeklyReviews(),
    getSpringConcepts(),
  ]);
  const weakest = suggestTodaysFocus(concepts, phase.current);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">
          Weekly review
        </h1>
        <p className="max-w-prose text-base text-muted">
          Step back once a week. What moved, what stalled, where to point next
          week.
        </p>
      </header>

      <WeeklyForm weekNumber={phase.weekNumber} suggestedWeakest={weakest?.title} />

      {reviews.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
            Past reviews
          </h2>
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
