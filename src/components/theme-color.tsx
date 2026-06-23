"use client";

import { useTheme } from "next-themes";

// Match the --bg-base token in each theme.
const COLOR = { dark: "#0e0f11", light: "#fafaf8" } as const;

/**
 * Keeps the browser-chrome theme-color in sync with the *app* theme (next-themes)
 * rather than the OS, so an off-default user never gets a mismatched address bar.
 * React 19 hoists this <meta> into <head>. Defaults to dark (the dark-first
 * default) until the theme resolves on the client.
 */
export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "light" ? COLOR.light : COLOR.dark;
  return <meta name="theme-color" content={color} />;
}
