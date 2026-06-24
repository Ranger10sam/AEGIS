import { NextResponse } from "next/server";

import { verifyCronRequest } from "@/lib/auth";
import { isEmailConfigured, sendEmail } from "@/lib/brevo";
import { renderEmail } from "@/lib/email";
import { suggestTodaysFocus } from "@/lib/gaps";
import { weeklyStats } from "@/lib/insights";
import { derivePhase } from "@/lib/phase";
import { getSpringConcepts } from "@/lib/queries/concepts";
import { getUserConfig } from "@/lib/queries/config";
import { getAllSessions } from "@/lib/queries/sessions";
import { getStreak } from "@/lib/queries/streak";

export const dynamic = "force-dynamic";

/** Weekly digest (Vercel cron, ~09:00 IST Sunday). */
export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getUserConfig();
  if (!config) return NextResponse.json({ skipped: "no config" });
  if (!config.email || !isEmailConfigured()) {
    return NextResponse.json({ skipped: "email not configured" });
  }

  const phase = derivePhase(
    config.start_date,
    config.duration_weeks,
    config.daily_minutes_goal,
  );
  const [sessions, streak, concepts] = await Promise.all([
    getAllSessions(),
    getStreak(),
    getSpringConcepts(),
  ]);

  const thisWeek = weeklyStats(sessions, 1)[0];
  const minutes = thisWeek?.minutes ?? 0;
  const weakest = suggestTodaysFocus(concepts, phase.current);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const lines = [
    `This week you studied ${minutes} minutes.`,
    streak
      ? `Current streak: ${streak.current_streak} days (longest ${streak.longest_streak}).`
      : "",
    weakest ? `Weakest link to revisit: ${weakest.title}.` : "",
  ].filter(Boolean) as string[];

  await sendEmail({
    to: config.email,
    subject: `Your week ${phase.weekNumber} digest`,
    html: renderEmail({
      heading: `Week ${phase.weekNumber} — ${phase.label}`,
      intro: `Hi ${config.display_name}, here's how the week looked.`,
      lines,
      ctaText: "Write this week's review",
      ctaHref: `${appUrl}/weekly`,
    }),
  });

  return NextResponse.json({ sent: true });
}
