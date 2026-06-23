import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Text input. 44px tall for comfortable mobile tap targets; uses the elevated
 * surface so it reads as inset against a card.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-line bg-elevated px-3 py-2 text-base text-fg transition-colors sm:text-sm",
        "placeholder:text-faint",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg",
        "focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/40",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
