import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PhaseState } from "@/lib/phase";

export function MissionBrief({
  phase,
  todayMinutes,
  goal,
}: {
  phase: PhaseState;
  todayMinutes: number;
  goal: number;
}) {
  const remaining = Math.max(0, goal - todayMinutes);
  const todayLine =
    remaining === 0
      ? "You've met today's goal — anything more is a bonus."
      : phase.current === 1
        ? `${remaining} min to today's goal. Just showing up is the win right now.`
        : `${remaining} min to today's goal. Pick one concept and go deep — tie it to TaskFlow.`;

  return (
    <Card>
      <CardHeader>
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
          Phase {phase.current} · {phase.label} · Week {phase.weekNumber} of{" "}
          {phase.totalWeeks}
        </span>
        <CardTitle>Today&apos;s mission</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-muted">{phase.description}</p>
        <p className="text-base text-fg">{todayLine}</p>
      </CardContent>
    </Card>
  );
}
