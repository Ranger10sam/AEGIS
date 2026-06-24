"use client";

import { useReducedMotion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MoodPoint } from "@/lib/insights";
import { EmptyChart, TOOLTIP_STYLE } from "./chart-card";

const AXIS = { fill: "var(--text-tertiary)", fontSize: 12 } as const;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function MoodChart({ data }: { data: MoodPoint[] }) {
  const reduce = useReducedMotion();
  if (data.length === 0) return <EmptyChart />;

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="mood"
            tickFormatter={(value) => capitalize(String(value))}
            tick={AXIS}
            tickLine={false}
            axisLine={false}
          />
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
            labelFormatter={(label) => capitalize(String(label))}
            formatter={(value) => [`${value} / 5`, "Avg confidence"]}
          />
          <Bar
            dataKey="avgConfidence"
            fill="var(--text-secondary)"
            radius={[4, 4, 0, 0]}
            maxBarSize={64}
            isAnimationActive={!reduce}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
