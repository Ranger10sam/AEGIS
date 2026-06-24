import "server-only";

import type { Story } from "@/lib/database.types";
import { todayISO } from "@/lib/date";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveUserKey } from "@/lib/user";

export async function getStories(): Promise<Story[]> {
  const { data, error } = await supabaseAdmin()
    .from("stories")
    .select("*")
    .eq("user_key", getActiveUserKey())
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load stories: ${error.message}`);
  return (data as Story[] | null) ?? [];
}

export interface StoryInput {
  question: string;
  situation: string | null;
  task: string | null;
  action: string | null;
  result: string | null;
  linked_concept_ids: string[];
  confidence: number;
}

export async function createStory(input: StoryInput): Promise<void> {
  const row = {
    user_key: getActiveUserKey(),
    project: "taskflow",
    ...input,
  } satisfies Partial<Story>;
  const { error } = await supabaseAdmin().from("stories").insert(row);
  if (error) throw new Error(`Failed to create story: ${error.message}`);
}

export async function updateStory(id: string, input: StoryInput): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("stories")
    .update(input)
    .eq("user_key", getActiveUserKey())
    .eq("id", id);
  if (error) throw new Error(`Failed to update story: ${error.message}`);
}

export async function deleteStory(id: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("stories")
    .delete()
    .eq("user_key", getActiveUserKey())
    .eq("id", id);
  if (error) throw new Error(`Failed to delete story: ${error.message}`);
}

export async function reviewStory(id: string, confidence: number): Promise<void> {
  const patch = {
    confidence,
    last_reviewed: todayISO(),
  } satisfies Partial<Story>;
  const { error } = await supabaseAdmin()
    .from("stories")
    .update(patch)
    .eq("user_key", getActiveUserKey())
    .eq("id", id);
  if (error) throw new Error(`Failed to review story: ${error.message}`);
}
