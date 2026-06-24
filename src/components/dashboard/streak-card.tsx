import { Card, CardContent } from "@/components/ui/card";

export function StreakCard({
  current,
  longest,
  totalDays,
}: {
  current: number;
  longest: number;
  totalDays: number;
}) {
  const line =
    current === 0
      ? "A fresh start. Log today to begin a streak."
      : `You showed up ${current} ${current === 1 ? "day" : "days"} straight.`;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-sm text-muted">Current streak</p>
          <p className="font-display text-3xl leading-none text-fg">
            {current}
            <span className="ml-1.5 text-lg text-muted">
              {current === 1 ? "day" : "days"}
            </span>
          </p>
          <p className="mt-2 text-sm text-muted">{line}</p>
        </div>
        <dl className="flex shrink-0 flex-col gap-1.5 text-right text-sm">
          <div className="flex items-center justify-end gap-2">
            <dt className="text-muted">Longest</dt>
            <dd className="font-mono tabular-nums text-fg">{longest}</dd>
          </div>
          <div className="flex items-center justify-end gap-2">
            <dt className="text-muted">Days logged</dt>
            <dd className="font-mono tabular-nums text-fg">{totalDays}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
