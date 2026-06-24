"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AUTH_COOKIE,
  authCookieOptions,
  isSafeInternalPath,
  sessionToken,
  verifyPassphrase,
} from "@/lib/auth";
import type { LoginState } from "./types";

function safeRedirect(target: string | null): string {
  return isSafeInternalPath(target) ? target : "/dashboard";
}

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const passphrase = String(formData.get("passphrase") ?? "");
  const fromField = formData.get("from");
  const destination = safeRedirect(fromField ? String(fromField) : null);

  if (!verifyPassphrase(passphrase)) {
    return { error: "That passphrase isn't right. Try again." };
  }

  const store = await cookies();
  store.set(AUTH_COOKIE, await sessionToken(), authCookieOptions);

  // redirect() throws to navigate — must be outside the try/return above.
  redirect(destination);
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  redirect("/login");
}
