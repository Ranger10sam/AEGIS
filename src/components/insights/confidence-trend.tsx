"use client";

import { useReducedMotion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WeekPoint } from "@/lib/insights";
import { EmptyChart, TOOLTIP_STYLE } from "./chart-card";

const AXIS = { fill: "var(--text-tertiary)", fontSize: 12 } as const;

export function ConfidenceTrend({ data }: { data: WeekPoint[] }) {
  const reduce = useReducedMotion();
  if (!data.some((d) => d.avgConfidence != null)) return <EmptyChart />;

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="week" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={AXIS}
            tickLine={false}
            axisLine={false}
            width={20}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: "var(--text-secondary)" }}
            formatter={(value) => [`${value} / 5`, "Confidence"]}
          />
          <Line
            type="monotone"
            dataKey="avgConfidence"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--accent)", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            connectNulls
            isAnimationActive={!reduce}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
