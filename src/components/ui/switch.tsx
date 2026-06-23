"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

/** On/off toggle for settings (sound, push, theme). Gold when on. */
const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors",
      // Transparent hit-area expander → 44px-tall touch target (CLAUDE.md §1).
      "before:absolute before:inset-x-0 before:-inset-y-2.5 before:content-['']",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Neutral "on" — gold is reserved for the signature element, not toggles.
      "data-[state=checked]:bg-fg data-[state=unchecked]:border-line data-[state=unchecked]:bg-elevated",
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block size-5 rounded-full border border-line-strong bg-canvas shadow-sm ring-0 transition-transform",
        "data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5",
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
