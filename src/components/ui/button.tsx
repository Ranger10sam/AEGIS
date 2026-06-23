import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: layout, type, focus ring, disabled. 44px-tall default for touch.
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Strong neutral: the everyday primary action.
        primary:
          "bg-fg text-canvas hover:bg-fg/90 focus-visible:ring-line-strong",
        // Signature gold — used with restraint for the single key action.
        accent:
          "bg-accent text-accent-contrast hover:bg-accent/90 focus-visible:ring-accent",
        // Quiet filled.
        secondary:
          "border border-line bg-elevated text-fg hover:border-line-strong hover:bg-elevated/70 focus-visible:ring-line-strong",
        outline:
          "border border-line bg-transparent text-fg hover:bg-elevated focus-visible:ring-line-strong",
        ghost:
          "bg-transparent text-muted hover:bg-elevated hover:text-fg focus-visible:ring-line-strong",
        danger:
          "bg-danger text-canvas hover:bg-danger/90 focus-visible:ring-danger",
        link: "text-accent underline-offset-4 hover:underline focus-visible:ring-accent",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-sm", // dense / desktop secondary
        md: "h-11 px-4", // default — 44px touch target
        lg: "h-12 rounded-md px-6 text-base",
        icon: "size-11", // 44px square
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. a Next.js <Link>) instead of <button>. */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        // Default to type="button" so buttons never accidentally submit forms.
        type={asChild ? undefined : (type ?? "button")}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
