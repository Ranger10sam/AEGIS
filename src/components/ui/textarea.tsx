import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[88px] w-full rounded-md border border-line bg-elevated px-3 py-2 text-base text-fg transition-colors sm:text-sm",
      "placeholder:text-faint",
      "focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong/40",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/40",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
