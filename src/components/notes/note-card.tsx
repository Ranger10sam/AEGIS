"use client";

import * as React from "react";
import { Pencil, Pin, PinOff, Trash2 } from "lucide-react";

import { removeNote, togglePin } from "@/app/(app)/notes/actions";
import { Button, Card } from "@/components/ui";
import type { QuickNote } from "@/lib/database.types";

const TAG_LABEL: Record<string, string> = {
  spring: "Spring",
  dsa: "DSA",
  idea: "Idea",
  mistake: "Mistake",
};

export function NoteCard({
  note,
  onEdit,
}: {
  note: QuickNote;
  onEdit: (n: QuickNote) => void;
}) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  return (
    <Card>
      {/* Plain div, not CardContent (no CardHeader → pt-0 would collapse). */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          {note.title ? (
            <p className="min-w-0 font-medium text-fg">{note.title}</p>
          ) : (
            <span className="sr-only">Note</span>
          )}
          <div className="-mr-1 flex shrink-0 items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label={note.pinned ? "Unpin note" : "Pin note"}
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await togglePin(note.id, !note.pinned);
                })
              }
            >
              {note.pinned ? (
                <Pin className="text-accent" aria-hidden />
              ) : (
                <PinOff aria-hidden />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit note"
              onClick={() => onEdit(note)}
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
                    await removeNote(note.id);
                  })
                }
              >
                Confirm
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete note"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 aria-hidden />
              </Button>
            )}
          </div>
        </div>
        <p className="whitespace-pre-line text-sm text-muted">{note.body}</p>
        {note.tag ? (
          <span className="w-fit rounded border border-line px-1.5 py-0.5 text-xs text-faint">
            {TAG_LABEL[note.tag]}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
