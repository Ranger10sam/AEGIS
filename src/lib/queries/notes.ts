import "server-only";

import type { NoteTag, QuickNote } from "@/lib/database.types";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export async function getNotes(): Promise<QuickNote[]> {
  const { data, error } = await supabaseAdmin()
    .from("quick_notes")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Failed to load notes: ${error.message}`);
  return (data as QuickNote[] | null) ?? [];
}

export interface NoteInput {
  title: string | null;
  body: string;
  tag: NoteTag | null;
  pinned: boolean;
}

export async function createNote(input: NoteInput): Promise<void> {
  const row = { user_key: getActiveUserKey(), ...input } satisfies Partial<QuickNote>;
  const { error } = await supabaseAdmin().from("quick_notes").insert(row);
  if (error) throw new Error(`Failed to create note: ${error.message}`);
}

export async function updateNote(id: string, input: NoteInput): Promise<void> {
  const patch = {
    ...input,
    updated_at: new Date().toISOString(),
  } satisfies Partial<QuickNote>;
  const { error } = await supabaseAdmin()
    .from("quick_notes")
    .update(patch)
    .eq("user_key", getActiveUserKey())
    .eq("id", id);
  if (error) throw new Error(`Failed to update note: ${error.message}`);
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("quick_notes")
    .delete()
    .eq("user_key", getActiveUserKey())
    .eq("id", id);
  if (error) throw new Error(`Failed to delete note: ${error.message}`);
}

export async function setPinned(id: string, pinned: boolean): Promise<void> {
  const patch = {
    pinned,
    updated_at: new Date().toISOString(),
  } satisfies Partial<QuickNote>;
  const { error } = await supabaseAdmin()
    .from("quick_notes")
    .update(patch)
    .eq("user_key", getActiveUserKey())
    .eq("id", id);
  if (error) throw new Error(`Failed to pin note: ${error.message}`);
}
