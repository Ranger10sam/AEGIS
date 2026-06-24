import { LogOut } from "lucide-react";

import { logout } from "@/app/login/actions";
import { cn } from "@/lib/utils";

/**
 * Submits the logout server action (clears the cookie, redirects to /login).
 * A plain form action keeps it usable inside client components without a hook.
 */
export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={logout} className={className}>
      <button
        type="submit"
        className={cn(
          "flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-line text-sm font-medium text-muted transition-colors",
          "hover:bg-elevated hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong",
        )}
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        Sign out
      </button>
    </form>
  );
}
