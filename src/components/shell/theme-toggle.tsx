"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { Segmented } from "@/components/ui/segmented";

/** Segmented light / system / dark control (proper radiogroup semantics). */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Theme is unknown during SSR; show the dark default until mounted to avoid a
  // hydration mismatch and a no-selection flash (the html class is next-themes').
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const value = (mounted && theme) || "dark";

  return (
    <Segmented
      ariaLabel="Theme"
      variant="contained"
      className="w-full"
      value={value}
      onValueChange={setTheme}
      options={[
        {
          value: "light",
          title: "Light",
          label: (
            <>
              <Sun className="size-4 shrink-0" aria-hidden />
              <span className="sr-only">Light</span>
            </>
          ),
        },
        {
          value: "system",
          title: "System",
          label: (
            <>
              <Monitor className="size-4 shrink-0" aria-hidden />
              <span className="sr-only">System</span>
            </>
          ),
        },
        {
          value: "dark",
          title: "Dark",
          label: (
            <>
              <Moon className="size-4 shrink-0" aria-hidden />
              <span className="sr-only">Dark</span>
            </>
          ),
        },
      ]}
    />
  );
}
