import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DangerAlert } from "@/lib/gaps";

export function DangerAlerts({ alerts }: { alerts: DangerAlert[] }) {
  if (alerts.length === 0) return null;

  return (
    <Card className="border-warning/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TriangleAlert className="size-4 text-warning" aria-hidden />
          Gaps forming
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {alerts.map((a) => (
          <Link
            key={a.concept.id}
            href={`/mastery/spring/${a.concept.id}`}
            className="flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong"
          >
            <span className="min-w-0 truncate text-sm text-fg">
              {a.concept.title}
            </span>
            <span className="shrink-0 text-xs text-muted">
              {a.days}d ago{a.weak ? " · still shaky" : ""}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
