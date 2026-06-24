import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface RecentItem {
  id: string;
  dateLabel: string;
  typeLabel: string;
  title: string | null;
  durationMinutes: number;
  mood: string | null;
  notes: string | null;
}

const moodDot: Record<string, string> = {
  sharp: "bg-success",
  okay: "bg-muted",
  tired: "bg-warning",
};

export function RecentSessions({ items }: { items: RecentItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent sessions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-muted sm:px-6 sm:pb-6">
            No sessions yet. Start a focus timer or log one to see it here.
          </p>
        ) : (
          <ul className="divide-y divide-line border-t border-line">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-start gap-3 px-5 py-3.5 sm:px-6"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded border border-line px-1.5 py-0.5 text-xs font-medium text-muted">
                      {it.typeLabel}
                    </span>
                    {it.title ? (
                      <span className="truncate text-sm font-medium text-fg">
                        {it.title}
                      </span>
                    ) : null}
                  </div>
                  {it.notes ? (
                    <p className="line-clamp-1 text-sm text-muted">{it.notes}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-mono text-sm tabular-nums text-fg">
                    {it.durationMinutes}m
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-faint">
                    {it.mood ? (
                      <>
                        <span
                          className={cn(
                            "inline-block size-2 rounded-full",
                            moodDot[it.mood] ?? "bg-muted",
                          )}
                          aria-hidden
                        />
                        <span className="sr-only">Felt {it.mood}.</span>
                      </>
                    ) : null}
                    <span>{it.dateLabel}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
