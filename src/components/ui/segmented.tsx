"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
  /** Native tooltip — useful when the label is icon-only. */
  title?: string;
  disabled?: boolean;
}

/**
 * Single-select control with proper radiogroup semantics — roving tabindex,
 * arrow-key navigation, and aria-checked — via Radix RadioGroup (unlike a row of
 * aria-pressed toggle buttons, which misrepresents a mutually-exclusive choice).
 *
 * `variant="chips"` for free-flowing options; `"contained"` for a compact pill
 * track. Pass `name` to submit the current value as a hidden input in a form.
 */
export function Segmented({
  value,
  onValueChange,
  options,
  ariaLabel,
  name,
  variant = "chips",
  disabled,
  className,
}: {
  value: string;
  onValueChange?: (value: string) => void;
  options: SegmentedOption[];
  ariaLabel: string;
  name?: string;
  variant?: "chips" | "contained";
  disabled?: boolean;
  className?: string;
}) {
  const root =
    variant === "contained"
      ? "inline-flex items-center gap-1 rounded-lg border border-line bg-surface p-1"
      : "flex flex-wrap gap-2";
  const itemBase =
    "inline-flex min-h-11 items-center justify-center gap-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong disabled:pointer-events-none disabled:opacity-50";
  const itemVariant =
    variant === "contained"
      ? // min-w-0 lets the equal-width segments shrink to fit a narrow track
        // (e.g. the 256px sidebar) instead of overflowing their container.
        "min-w-0 flex-1 rounded-md px-3 text-muted data-[state=checked]:bg-elevated data-[state=checked]:text-fg"
      : "rounded-md border border-line px-3.5 text-muted hover:bg-elevated/60 hover:text-fg data-[state=checked]:border-line-strong data-[state=checked]:bg-elevated data-[state=checked]:text-fg";

  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      name={name}
      aria-label={ariaLabel}
      disabled={disabled}
      orientation="horizontal"
      className={cn(root, className)}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          title={option.title}
          className={cn(itemBase, itemVariant)}
        >
          {option.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
