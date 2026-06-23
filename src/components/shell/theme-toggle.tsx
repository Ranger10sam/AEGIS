"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

/** Segmented light / system / dark control. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Theme is unknown during SSR; wait for mount before showing the active state
  // to avoid a hydration mismatch (the html class is handled by next-themes).
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex items-center gap-1 rounded-lg border border-line bg-surface p-1"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        // Pre-mount, highlight the dark default (matches the dark-first <html>)
        // rather than nothing, then the real choice once next-themes resolves.
        const current = mounted ? theme : "dark";
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={active}
            className={cn(
              "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong",
              active ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
