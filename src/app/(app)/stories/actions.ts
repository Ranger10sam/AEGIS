"use server";

import { revalidatePath } from "next/cache";

import type { FormState } from "@/lib/form-state";
import {
  createStory,
  deleteStory,
  reviewStory,
  updateStory,
  type StoryInput,
} from "@/lib/queries/stories";

function text(formData: FormData, name: string): string | null {
  const v = String(formData.get(name) ?? "").trim();
  return v || null;
}

export async function saveStory(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const question = String(formData.get("question") ?? "").trim();
  if (!question) {
    return { error: "A question is required.", field: "question" };
  }
  const confidence = Math.min(
    5,
    Math.max(0, Math.round(Number(formData.get("confidence")) || 0)),
  );
  const input: StoryInput = {
    question,
    situation: text(formData, "situation"),
    task: text(formData, "task"),
    action: text(formData, "action"),
    result: text(formData, "result"),
    linked_concept_ids: formData.getAll("concepts").map(String),
    confidence,
  };

  const id = formData.get("id");
  if (id) {
    await updateStory(String(id), input);
  } else {
    await createStory(input);
  }
  revalidatePath("/stories");
  return { error: null, ok: true };
}

export async function removeStory(id: string): Promise<void> {
  await deleteStory(id);
  revalidatePath("/stories");
}

export async function rateStory(id: string, confidence: number): Promise<void> {
  await reviewStory(id, confidence);
  revalidatePath("/stories");
}
