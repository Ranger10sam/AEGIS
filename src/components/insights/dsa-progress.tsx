import type { DsaProgressRow } from "@/lib/insights";
import { EmptyChart } from "./chart-card";

export function DsaProgress({ rows }: { rows: DsaProgressRow[] }) {
  if (rows.length === 0)
    return <EmptyChart message="No DSA patterns seeded yet." />;

  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => {
        const pct = r.total ? (r.solved / r.total) * 100 : 0;
        return (
          <div key={r.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg">{r.title}</span>
              <span className="font-mono tabular-nums text-muted">
                {r.solved}/{r.total}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
              <div
                className="h-full rounded-full bg-fg"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
