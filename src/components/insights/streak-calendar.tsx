import type { DayPoint } from "@/lib/insights";
import { cn } from "@/lib/utils";
import { EmptyChart } from "./chart-card";

function tone(minutes: number): string {
  if (minutes <= 0) return "bg-elevated";
  if (minutes < 30) return "bg-success/30";
  if (minutes < 60) return "bg-success/60";
  return "bg-success";
}

export function StreakCalendar({ days }: { days: DayPoint[] }) {
  if (days.every((d) => d.minutes <= 0)) {
    return <EmptyChart message="No sessions logged yet." />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <div
          className="grid grid-flow-col grid-rows-7 gap-1"
          style={{ width: "max-content" }}
        >
          {days.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.minutes} min`}
              className={cn("size-3 rounded-[3px]", tone(d.minutes))}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-faint">
        Last {Math.round(days.length / 7)} weeks · darker means more minutes
      </p>
    </div>
  );
}
