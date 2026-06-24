import { format, parseISO } from "date-fns";
import { redirect } from "next/navigation";

import { DangerAlerts } from "@/components/dashboard/danger-alerts";
import { MissionBrief } from "@/components/dashboard/mission-brief";
import {
  RecentSessions,
  type RecentItem,
} from "@/components/dashboard/recent-sessions";
import { StatGrid, type Stat } from "@/components/dashboard/stat-grid";
import { StreakCard } from "@/components/dashboard/streak-card";
import { SuggestedFocus } from "@/components/dashboard/suggested-focus";
import { TodayRing } from "@/components/dashboard/today-ring";
import { Card } from "@/components/ui/card";
import { hourInTimezone } from "@/lib/date";
import { computeDangerAlerts, suggestTodaysFocus } from "@/lib/gaps";
import { derivePhase } from "@/lib/phase";
import { getUserConfig } from "@/lib/queries/config";
import { getDsaPatterns } from "@/lib/queries/patterns";
import { getSpringConcepts } from "@/lib/queries/concepts";
import {
  getRecentSessions,
  getTodayMinutes,
} from "@/lib/queries/sessions";
import { getStreak } from "@/lib/queries/streak";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

const TYPE_LABEL: Record<string, string> = {
  spring: "Spring",
  dsa: "DSA",
  behavioral: "Behavioral",
  mock: "Mock",
  quiz: "Quiz",
  mixed: "Mixed",
};

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Working late";
}

// Compact for a narrow stat tile (3-up at 360px): minutes under an hour, else
// whole hours.
function formatMinutes(total: number): string {
  return total < 60 ? `${total}m` : `${Math.round(total / 60)}h`;
}

export default async function DashboardPage() {
  const config = await getUserConfig();
  // The (app) layout guarantees an onboarded config before we render; guard for types.
  if (!config) redirect("/onboarding");

  const tz = config.timezone;
  const phase = derivePhase(
    config.start_date,
    config.duration_weeks,
    config.daily_minutes_goal,
  );

  const [streak, todayMinutes, recent, concepts, patterns] = await Promise.all([
    getStreak(),
    getTodayMinutes(tz),
    getRecentSessions(5),
    getSpringConcepts(),
    getDsaPatterns(),
  ]);

  const goal = phase.dailyGoalMinutes;
  const confidentConcepts = concepts.filter(
    (c) => c.current_confidence >= 4,
  ).length;
  const readyPatterns = patterns.filter(
    (p) => p.current_confidence >= 3,
  ).length;

  // Phase 1 stays encouragement-only (no danger alerts); 2+ surfaces gaps.
  const alerts =
    phase.current >= 2 ? computeDangerAlerts(concepts, phase.current) : [];
  const focus = suggestTodaysFocus(concepts, phase.current);

  const stats: Stat[] = [
    {
      label: "Total time",
      value: formatMinutes(streak?.total_minutes ?? 0),
    },
    {
      label: "Concepts",
      value: `${confidentConcepts}/${concepts.length}`,
      hint: "confident",
    },
    {
      label: "Patterns",
      value: `${readyPatterns}/${patterns.length}`,
      hint: "ready",
    },
  ];

  const conceptTitle = new Map(concepts.map((c) => [c.id, c.title]));
  const patternTitle = new Map(patterns.map((p) => [p.id, p.title]));
  const recentItems: RecentItem[] = recent.map((s) => ({
    id: s.id,
    dateLabel: format(parseISO(s.session_date), "d MMM"),
    typeLabel: TYPE_LABEL[s.type] ?? s.type,
    title: s.spring_concept_id
      ? (conceptTitle.get(s.spring_concept_id) ?? null)
      : s.dsa_pattern_id
        ? (patternTitle.get(s.dsa_pattern_id) ?? null)
        : null,
    durationMinutes: s.duration_minutes,
    mood: s.mood,
    notes: s.notes,
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted">{greeting(hourInTimezone(tz))},</p>
        <h1 className="font-display text-2xl text-fg sm:text-3xl">
          {config.display_name}
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          {/* Plain div, not CardContent (no CardHeader → pt-0 would collapse). */}
          <div className="flex flex-col items-center gap-4 p-6">
            <p className="self-start text-sm font-medium text-muted">Today</p>
            <TodayRing minutes={todayMinutes} goal={goal} />
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <StreakCard
            current={streak?.current_streak ?? 0}
            longest={streak?.longest_streak ?? 0}
            totalDays={streak?.total_days_logged ?? 0}
          />
          <StatGrid stats={stats} />
        </div>
      </div>

      <MissionBrief phase={phase} todayMinutes={todayMinutes} goal={goal} />
      <DangerAlerts alerts={alerts} />
      <SuggestedFocus concept={focus} phase={phase.current} />
      <RecentSessions items={recentItems} />
    </div>
  );
}
