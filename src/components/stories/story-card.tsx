"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";

import { rateStory, removeStory } from "@/app/(app)/stories/actions";
import { ConfidenceBar } from "@/components/mastery/confidence-bar";
import { Button, Card, CardContent } from "@/components/ui";
import type { Story } from "@/lib/database.types";

const STAR = [
  ["situation", "Situation"],
  ["task", "Task"],
  ["action", "Action"],
  ["result", "Result"],
] as const;

const RECALL = [
  { label: "Forgot", score: 1 },
  { label: "Rough", score: 2 },
  { label: "Solid", score: 4 },
  { label: "Sharp", score: 5 },
];

export function StoryCard({
  story,
  conceptTitles,
  recallMode,
  onEdit,
}: {
  story: Story;
  conceptTitles: Map<string, string>;
  recallMode: boolean;
  onEdit: (s: Story) => void;
}) {
  const [revealed, setRevealed] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  const showStar = !recallMode || revealed;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
        <p className="text-base font-medium text-fg">{story.question}</p>

        {showStar ? (
          <div className="flex flex-col gap-3">
            {STAR.map(([key, label]) => {
              const value = story[key] as string | null;
              if (!value) return null;
              return (
                <div key={key} className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-faint">
                    {label}
                  </span>
                  <p className="text-sm text-muted">{value}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <Button
            variant="secondary"
            className="w-fit"
            onClick={() => setRevealed(true)}
          >
            Reveal answer
          </Button>
        )}

        {recallMode && revealed ? (
          <div className="flex flex-col gap-2 border-t border-line pt-4">
            <span className="text-sm font-medium text-fg">
              How well did you recall it?
            </span>
            <div className="flex flex-wrap gap-2">
              {RECALL.map((r) => (
                <Button
                  key={r.label}
                  variant="outline"
                  className="flex-1"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await rateStory(story.id, r.score);
                      setRevealed(false);
                    })
                  }
                >
                  {r.label}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {!recallMode ? (
          <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
            <div className="flex min-w-0 flex-col gap-2">
              <ConfidenceBar value={story.confidence} className="w-28" />
              {story.linked_concept_ids?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {story.linked_concept_ids.map((id) => (
                    <span
                      key={id}
                      className="rounded border border-line px-1.5 py-0.5 text-xs text-faint"
                    >
                      {conceptTitles.get(id) ?? id}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit story"
                onClick={() => onEdit(story)}
              >
                <Pencil aria-hidden />
              </Button>
              {confirmDelete ? (
                <Button
                  variant="danger"
                  size="md"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await removeStory(story.id);
                    })
                  }
                >
                  Confirm
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete story"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 aria-hidden />
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
