"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps next-themes so it can sit in the (server) root layout. next-themes
 * injects a blocking inline script that sets the theme class before paint, so
 * there is no flash of the wrong theme. Dark-first with system support.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
