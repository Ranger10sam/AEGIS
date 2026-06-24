import { redirect } from "next/navigation";

import { ChartCard } from "@/components/insights/chart-card";
import { ConfidenceTrend } from "@/components/insights/confidence-trend";
import { CoverageHeatmap } from "@/components/insights/coverage-heatmap";
import { DsaProgress } from "@/components/insights/dsa-progress";
import { MoodChart } from "@/components/insights/mood-chart";
import { StreakCalendar } from "@/components/insights/streak-calendar";
import { VelocityChart } from "@/components/insights/velocity-chart";
import {
  dailyMinutes,
  dsaProgress,
  moodPerformance,
  weeklyStats,
} from "@/lib/insights";
import { derivePhase } from "@/lib/phase";
import { getUserConfig } from "@/lib/queries/config";
import { getDsaPatterns } from "@/lib/queries/patterns";
import { getDsaProblems } from "@/lib/queries/problems";
import { getAllSessions } from "@/lib/queries/sessions";
import { getSpringConcepts } from "@/lib/queries/concepts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Insights" };

export default async function InsightsPage() {
  const config = await getUserConfig();
  if (!config) redirect("/onboarding");

  const phase = derivePhase(
    config.start_date,
    config.duration_weeks,
    config.daily_minutes_goal,
  );

  const [sessions, concepts, patterns, problems] = await Promise.all([
    getAllSessions(),
    getSpringConcepts(),
    getDsaPatterns(),
    getDsaProblems(),
  ]);

  const weekly = weeklyStats(sessions, 8, config.timezone);
  const weeklyGoal = phase.dailyGoalMinutes * 5;
  const mood = moodPerformance(sessions);
  const dsa = dsaProgress(patterns, problems);
  const days = dailyMinutes(sessions, 84, config.timezone);
  const coverage = concepts.map((c) => ({
    id: c.id,
    title: c.title,
    confidence: c.current_confidence,
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">Insights</h1>
        <p className="max-w-prose text-base text-muted">
          The shape of your prep — where the momentum is, and where the gaps
          are.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="sr-only">Trends</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Weekly velocity"
            description="Minutes per week against your goal line."
          >
            <VelocityChart data={weekly} goal={weeklyGoal} />
          </ChartCard>
          <ChartCard
            title="Confidence trend"
            description="Average Spring confidence per week."
          >
            <ConfidenceTrend data={weekly} />
          </ChartCard>
          <ChartCard
            title="DSA progress"
            description="Core problems solved per pattern."
          >
            <DsaProgress rows={dsa} />
          </ChartCard>
          <ChartCard
            title="Mood vs performance"
            description="Confidence by how you felt that session."
          >
            <MoodChart data={mood} />
          </ChartCard>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="sr-only">Coverage and activity</h2>
        <ChartCard
          title="Concept coverage"
          description="Every Spring concept, colored by confidence."
        >
          <CoverageHeatmap concepts={coverage} />
        </ChartCard>

        <ChartCard
          title="Activity"
          description="Daily study over the last 12 weeks."
        >
          <StreakCalendar days={days} />
        </ChartCard>
      </section>
    </div>
  );
}
