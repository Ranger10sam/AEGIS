import { Card } from "@/components/ui/card";

export interface Stat {
  label: string;
  value: string;
  hint?: string;
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <Card key={s.label}>
          {/* Plain div, not CardContent (no CardHeader → pt-0 would collapse). */}
          <div className="flex flex-col gap-1 p-4">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="font-mono text-xl tabular-nums text-fg">{s.value}</p>
            {s.hint ? <p className="text-xs text-faint">{s.hint}</p> : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
