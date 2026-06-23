import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

/**
 * Type system (CLAUDE.md §1). Loaded via next/font, self-hosted and preloaded.
 * `display: "optional"` means the browser uses the (preloaded) web font when it
 * is ready and otherwise keeps the metric-matched fallback — so there is no
 * flash-of-unstyled-text and no layout shift on load.
 *
 *  - Fraunces        → display: section heads + hero numbers (used with restraint)
 *  - Inter           → body + all UI text
 *  - JetBrains Mono  → code, LeetCode numbers, timers
 *
 * Each exposes a CSS variable consumed by the Tailwind theme in globals.css.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "optional",
  axes: ["opsz"],
});

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "optional",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "optional",
});
