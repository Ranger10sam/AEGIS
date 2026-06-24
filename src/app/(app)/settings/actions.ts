"use server";

import { revalidatePath } from "next/cache";

import type { FormState } from "@/lib/form-state";
import {
  parseConfigCore,
  readSwitch,
  readTheme,
  writeUserConfig,
} from "@/lib/queries/config";

export async function saveSettings(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseConfigCore(formData);
  if (!parsed.ok) return { error: parsed.error, field: parsed.field };

  const theme = readTheme(formData);
  await writeUserConfig({
    ...parsed.values,
    sound_enabled: readSwitch(formData, "sound_enabled"),
    push_enabled: readSwitch(formData, "push_enabled"),
    ...(theme ? { theme } : {}),
  });

  revalidatePath("/", "layout");
  return { error: null, ok: true };
}
