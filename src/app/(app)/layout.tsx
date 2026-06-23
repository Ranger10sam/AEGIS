import { subWeeks } from "date-fns";

import { BottomNav } from "@/components/shell/bottom-nav";
import { PhaseBar } from "@/components/shell/phase-bar";
import { Sidebar } from "@/components/shell/sidebar";
import { derivePhase } from "@/lib/phase";

// INTERIM: the real start_date / duration / goal come from user_config once the
// data layer lands (build block 4+). Until then we derive the phase from a
// fixed offset that puts us in Phase 2, so every area of the shell is visible.
function interimPhase() {
  const start = subWeeks(new Date(), 5);
  return derivePhase(start.toISOString(), 16, 45);
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const phase = interimPhase();

  return (
    <div className="min-h-dvh">
      {/* Keyboard bypass for the long nav (WCAG 2.4.1). First focusable element. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-md focus:border focus:border-line-strong focus:bg-elevated focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-fg focus:shadow-lg"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <PhaseBar phase={phase} />
        <main
          id="main"
          tabIndex={-1}
          // Bottom padding clears the mobile BottomNav (h-16) plus the home-
          // indicator safe area; removed at lg where the sidebar takes over.
          className="flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 focus-visible:outline-none sm:px-6 lg:px-8 lg:pb-12"
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
