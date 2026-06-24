import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { isSafeInternalPath } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.from) ? params.from[0] : params.from;
  const from = isSafeInternalPath(raw) ? raw : undefined;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="font-display text-3xl text-fg">Aegis</span>
          <p className="text-sm text-muted">
            Your interview-prep companion. Enter your passphrase to continue.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <LoginForm from={from} />
        </div>
      </div>
    </main>
  );
}
