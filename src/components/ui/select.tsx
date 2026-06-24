import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Styled native <select>. Native (not Radix) keeps it dependency-light and gets
 * a correctly-themed dropdown via `color-scheme` on the document. The chevron is
 * a decorative overlay; the select fills the row.
 */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "h-11 w-full appearance-none rounded-md border border-line bg-elevated pl-3 pr-9 text-base text-fg transition-colors sm:text-sm",
        "focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/40",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint"
      aria-hidden
    />
  </div>
));
Select.displayName = "Select";

export { Select };
