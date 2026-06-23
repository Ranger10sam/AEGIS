"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActivePath, NAV_SECTIONS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

/** Desktop navigation rail. Hidden below lg, where BottomNav takes over. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface lg:flex">
      <div className="flex h-14 items-center px-5">
        <Link
          href="/dashboard"
          className="rounded-sm font-display text-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong"
        >
          Aegis
        </Link>
      </div>

      <nav
        aria-label="Primary"
        className="flex-1 overflow-y-auto px-3 py-2"
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.heading} className="mb-4 last:mb-0">
            <p className="px-2 pb-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
              {section.heading}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex min-h-10 items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong",
                        active
                          ? "bg-elevated text-fg"
                          : "text-muted hover:bg-elevated/60 hover:text-fg",
                      )}
                    >
                      {active && (
                        <span
                          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                          aria-hidden
                        />
                      )}
                      <Icon className="size-5 shrink-0" aria-hidden />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <ThemeToggle />
      </div>
    </aside>
  );
}
