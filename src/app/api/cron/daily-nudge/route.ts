import { NextResponse } from "next/server";

import { verifyCronRequest } from "@/lib/auth";
import { isEmailConfigured, sendEmail } from "@/lib/brevo";
import { renderEmail } from "@/lib/email";
import { derivePhase } from "@/lib/phase";
import { isPushConfigured, sendPushToAll } from "@/lib/push";
import { getUserConfig } from "@/lib/queries/config";
import { getTodayMinutes } from "@/lib/queries/sessions";
import { getStreak } from "@/lib/queries/streak";

export const dynamic = "force-dynamic";

/**
 * Daily nudge (Vercel cron, ~07:30 IST). Also the anti-pause backstop: reading
 * the DB every day keeps the free Supabase project awake. Sends a push and/or
 * email only when today's goal isn't met yet.
 */
export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getUserConfig(); // touches the DB (anti-pause)
  if (!config) return NextResponse.json({ skipped: "no config" });

  const phase = derivePhase(
    config.start_date,
    config.duration_weeks,
    config.daily_minutes_goal,
  );
  const todayMinutes = await getTodayMinutes(config.timezone);
  if (todayMinutes >= phase.dailyGoalMinutes) {
    return NextResponse.json({ skipped: "goal met" });
  }

  const streak = await getStreak();
  const remaining = phase.dailyGoalMinutes - todayMinutes;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const streakLine =
    streak && streak.current_streak > 0
      ? `Keep your ${streak.current_streak}-day streak — ${remaining} min to go.`
      : `${remaining} minutes is all it takes to start a streak.`;

  const sent: string[] = [];

  if (isPushConfigured()) {
    await sendPushToAll({
      title: "A few minutes today?",
      body: streakLine,
      url: "/dashboard",
    });
    sent.push("push");
  }

  if (config.email && isEmailConfigured()) {
    await sendEmail({
      to: config.email,
      subject: "A few minutes today?",
      html: renderEmail({
        heading: `Phase ${phase.current}: ${phase.label}`,
        intro: `Hi ${config.display_name}, you haven't logged today yet.`,
        lines: [streakLine],
        ctaText: "Open Aegis",
        ctaHref: `${appUrl}/dashboard`,
      }),
    });
    sent.push("email");
  }

  return NextResponse.json({ sent });
}
