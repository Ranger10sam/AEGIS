"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type Tone = "accent" | "neutral";

const toneStyles: Record<Tone, { range: string; thumb: string }> = {
  // Gold — reserved for "your level" rating sliders (depth / confidence).
  accent: {
    range: "bg-accent",
    thumb: "border-accent focus-visible:ring-accent/50",
  },
  // Neutral — for plain value sliders (duration, daily goal) so gold stays rare.
  neutral: {
    range: "bg-fg",
    thumb: "border-line-strong focus-visible:ring-line-strong/50",
  },
};

/**
 * Range slider. Supports single or multiple thumbs (one rendered per value).
 * `tone="accent"` (default) is the gold rating look; `tone="neutral"` is the
 * quiet look for ordinary value sliders.
 */
const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { tone?: Tone }
>(({ className, value, defaultValue, tone = "accent", ...props }, ref) => {
  const thumbCount =
    (Array.isArray(value) && value.length) ||
    (Array.isArray(defaultValue) && defaultValue.length) ||
    1;
  const styles = toneStyles[tone];

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-elevated">
        <SliderPrimitive.Range className={cn("absolute h-full", styles.range)} />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            "relative block size-5 rounded-full border-2 bg-canvas shadow-sm transition-colors before:absolute before:-inset-3 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none",
            styles.thumb,
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
