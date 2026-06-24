"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormState } from "@/lib/form-state";
import { parseConfigCore, writeUserConfig } from "@/lib/queries/config";

export async function completeOnboarding(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseConfigCore(formData);
  if (!parsed.ok) return { error: parsed.error, field: parsed.field };

  await writeUserConfig({ ...parsed.values, onboarded: true });
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
