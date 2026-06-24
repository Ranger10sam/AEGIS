"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Switch,
} from "@/components/ui";
import type { Story } from "@/lib/database.types";
import { StoryCard } from "./story-card";
import { StoryForm, type ConceptOption } from "./story-form";

export function StoriesView({
  stories,
  concepts,
}: {
  stories: Story[];
  concepts: ConceptOption[];
}) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Story | undefined>(undefined);
  const [recall, setRecall] = React.useState(false);

  const conceptTitles = React.useMemo(
    () => new Map(concepts.map((c) => [c.id, c.title])),
    [concepts],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2.5 text-sm text-muted">
          <Switch checked={recall} onCheckedChange={setRecall} />
          Recall mode
        </label>
        <Button
          onClick={() => {
            setEditing(undefined);
            setOpen(true);
          }}
        >
          <Plus aria-hidden />
          Add story
        </Button>
      </div>

      {stories.length === 0 ? (
        <p className="text-sm text-muted">
          No stories yet. Add your first STAR story from real TaskFlow work.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {stories.map((s) => (
            <StoryCard
              key={s.id}
              story={s}
              conceptTitles={conceptTitles}
              recallMode={recall}
              onEdit={(story) => {
                setEditing(story);
                setOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit story" : "Add story"}</DialogTitle>
            <DialogDescription>
              STAR format, grounded in your own work.
            </DialogDescription>
          </DialogHeader>
          <StoryForm
            key={editing?.id ?? "new"}
            concepts={concepts}
            story={editing}
            onSaved={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
