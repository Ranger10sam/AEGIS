"use client";

import * as React from "react";

import { saveNote } from "@/app/(app)/notes/actions";
import { Field } from "@/components/forms/field";
import { Button, Input, Segmented, Switch, Textarea } from "@/components/ui";
import type { QuickNote } from "@/lib/database.types";
import type { FormState } from "@/lib/form-state";

const TAG_OPTIONS = [
  { value: "none", label: "None" },
  { value: "spring", label: "Spring" },
  { value: "dsa", label: "DSA" },
  { value: "idea", label: "Idea" },
  { value: "mistake", label: "Mistake" },
];
const initial: FormState = { error: null };

export function NoteForm({
  note,
  onSaved,
}: {
  note?: QuickNote;
  onSaved: () => void;
}) {
  const [state, action, pending] = React.useActionState(saveNote, initial);
  const [tag, setTag] = React.useState<string>(note?.tag ?? "none");

  React.useEffect(() => {
    if (state.ok) onSaved();
  }, [state, onSaved]);

  return (
    <form action={action} className="flex flex-col gap-4">
      {note ? <input type="hidden" name="id" value={note.id} /> : null}

      <Field label="Title" htmlFor="note-title" hint="Optional.">
        <Input
          id="note-title"
          name="title"
          defaultValue={note?.title ?? ""}
          maxLength={120}
        />
      </Field>

      <Field label="Note" htmlFor="note-body">
        <Textarea
          id="note-body"
          name="body"
          defaultValue={note?.body ?? ""}
          required
          aria-invalid={state.field === "body" || undefined}
          aria-describedby={state.field === "body" ? "note-error" : undefined}
        />
      </Field>

      <Field label="Tag">
        <Segmented
          ariaLabel="Tag"
          name="tag"
          value={tag}
          onValueChange={setTag}
          options={TAG_OPTIONS}
        />
      </Field>

      <label className="flex items-center gap-2.5 text-sm text-fg">
        <Switch name="pinned" defaultChecked={note?.pinned ?? false} />
        Pin to top
      </label>

      {state.error ? (
        <p id="note-error" role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : note ? "Save" : "Add note"}
        </Button>
      </div>
    </form>
  );
}
