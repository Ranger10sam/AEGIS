"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BOTTOM_NAV, isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { MoreMenu } from "./more-menu";

/** Mobile navigation bar. Hidden at lg and up, where the Sidebar takes over. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="flex items-stretch">
        {BOTTOM_NAV.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-16 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-line-strong",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {active && (
                  <span
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-accent"
                    aria-hidden
                  />
                )}
                <Icon className="size-5 shrink-0" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <MoreMenu />
        </li>
      </ul>
    </nav>
  );
}
