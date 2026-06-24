"use client";

import { useReducedMotion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WeekPoint } from "@/lib/insights";
import { EmptyChart, TOOLTIP_STYLE } from "./chart-card";

const AXIS = { fill: "var(--text-tertiary)", fontSize: 12 } as const;

export function VelocityChart({
  data,
  goal,
}: {
  data: WeekPoint[];
  goal: number;
}) {
  const reduce = useReducedMotion();
  if (!data.some((d) => d.minutes > 0)) return <EmptyChart />;

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="week"
            tick={AXIS}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={36} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: "var(--text-secondary)" }}
            cursor={{ fill: "var(--bg-elevated)", opacity: 0.4 }}
            formatter={(value) => [`${value} min`, "Studied"]}
          />
          {goal > 0 ? (
            <ReferenceLine
              y={goal}
              stroke="var(--accent)"
              strokeDasharray="4 4"
              label={{
                value: "weekly goal",
                position: "insideTopRight",
                fill: "var(--text-tertiary)",
                fontSize: 10,
              }}
            />
          ) : null}
          <Bar
            dataKey="minutes"
            fill="var(--text-secondary)"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
            isAnimationActive={!reduce}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
