"use client";

import { useActionState } from "react";

import { login } from "@/app/login/actions";
import type { LoginState } from "@/app/login/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: LoginState = { error: null };

export function LoginForm({ from }: { from?: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {from ? <input type="hidden" name="from" value={from} /> : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="passphrase" className="text-sm font-medium text-fg">
          Passphrase
        </label>
        <Input
          id="passphrase"
          name="passphrase"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          placeholder="Enter your passphrase"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "passphrase-error" : undefined}
        />
        {state.error ? (
          <p id="passphrase-error" role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Checking…" : "Enter"}
      </Button>
    </form>
  );
}
