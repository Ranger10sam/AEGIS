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
  Segmented,
} from "@/components/ui";
import type { QuickNote } from "@/lib/database.types";
import { NoteCard } from "./note-card";
import { NoteForm } from "./note-form";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "spring", label: "Spring" },
  { value: "dsa", label: "DSA" },
  { value: "idea", label: "Idea" },
  { value: "mistake", label: "Mistake" },
];

export function NotesView({ notes }: { notes: QuickNote[] }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<QuickNote | undefined>(undefined);
  const [filter, setFilter] = React.useState("all");

  const visible =
    filter === "all" ? notes : notes.filter((n) => n.tag === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          ariaLabel="Filter by tag"
          value={filter}
          onValueChange={setFilter}
          options={FILTERS}
        />
        <Button
          onClick={() => {
            setEditing(undefined);
            setOpen(true);
          }}
        >
          <Plus aria-hidden />
          Add note
        </Button>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted">
          {notes.length === 0
            ? "No notes yet. Capture an insight or a mistake."
            : "Nothing with this tag."}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onEdit={(note) => {
                setEditing(note);
                setOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit note" : "Add note"}</DialogTitle>
            <DialogDescription>
              Capture an insight, idea, or mistake.
            </DialogDescription>
          </DialogHeader>
          <NoteForm
            key={editing?.id ?? "new"}
            note={editing}
            onSaved={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
