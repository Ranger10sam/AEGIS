"use server";

import { revalidatePath } from "next/cache";

import type { NoteTag } from "@/lib/database.types";
import type { FormState } from "@/lib/form-state";
import {
  createNote,
  deleteNote,
  setPinned,
  updateNote,
  type NoteInput,
} from "@/lib/queries/notes";

const TAGS: NoteTag[] = ["spring", "dsa", "idea", "mistake"];

export async function saveNote(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Write something first.", field: "body" };

  const tagRaw = String(formData.get("tag") ?? "");
  const input: NoteInput = {
    title: String(formData.get("title") ?? "").trim() || null,
    body,
    tag: TAGS.includes(tagRaw as NoteTag) ? (tagRaw as NoteTag) : null,
    pinned: formData.get("pinned") === "on",
  };

  const id = formData.get("id");
  if (id) {
    await updateNote(String(id), input);
  } else {
    await createNote(input);
  }
  revalidatePath("/notes");
  return { error: null, ok: true };
}

export async function removeNote(id: string): Promise<void> {
  await deleteNote(id);
  revalidatePath("/notes");
}

export async function togglePin(id: string, pinned: boolean): Promise<void> {
  await setPinned(id, pinned);
  revalidatePath("/notes");
}
