"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { isActivePath, MORE_NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

/** The mobile "More" sheet: overflow destinations + the theme control. */
export function MoreMenu() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const moreActive = MORE_NAV.some((item) => isActivePath(pathname, item.href));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          "flex min-h-16 w-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-line-strong",
          moreActive ? "text-fg" : "text-muted hover:text-fg",
        )}
      >
        <MoreHorizontal className="size-5 shrink-0" aria-hidden />
        More
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>More</DialogTitle>
          <DialogDescription>
            Jump to another area, or switch the theme.
          </DialogDescription>
        </DialogHeader>
        <ul className="grid grid-cols-2 gap-2">
          {MORE_NAV.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong",
                    active
                      ? "border-line-strong bg-elevated text-fg"
                      : "border-line text-muted hover:bg-elevated hover:text-fg",
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-line pt-4">
          <ThemeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}
