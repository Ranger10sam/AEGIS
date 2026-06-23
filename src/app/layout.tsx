import type { Metadata, Viewport } from "next";

import { ThemeColorMeta } from "@/components/theme-color";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fontDisplay, fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Aegis",
    template: "%s · Aegis",
  },
  description:
    "A daily operating system for deliberate interview preparation — Java, Spring Boot, and DSA.",
  applicationName: "Aegis",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // theme-color is set dynamically from the resolved app theme (ThemeColorMeta)
  // so it tracks next-themes rather than the OS color scheme.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // next-themes sets the theme class (dark/light) before paint; suppress the
      // resulting html-attribute hydration diff. Dark-first (defaultTheme below).
      className={cn(
        fontSans.variable,
        fontDisplay.variable,
        fontMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-canvas font-sans text-fg antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeColorMeta />
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
