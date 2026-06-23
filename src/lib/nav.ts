import {
  CalendarCheck,
  Compass,
  Layers,
  LayoutDashboard,
  type LucideIcon,
  MessageSquareQuote,
  Mic,
  NotebookPen,
  Settings,
  StickyNote,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Single source of truth for every destination (routes match CLAUDE.md §6). */
export const NAV = {
  dashboard: { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  log: { href: "/log", label: "Log session", icon: NotebookPen },
  focus: { href: "/focus", label: "Focus", icon: Timer },
  mastery: { href: "/mastery", label: "Mastery", icon: Target },
  quiz: { href: "/quiz", label: "Quiz", icon: Layers },
  mock: { href: "/mock", label: "Mock", icon: Mic },
  stories: { href: "/stories", label: "Stories", icon: MessageSquareQuote },
  notes: { href: "/notes", label: "Notes", icon: StickyNote },
  insights: { href: "/insights", label: "Insights", icon: TrendingUp },
  weekly: { href: "/weekly", label: "Weekly review", icon: CalendarCheck },
  tutorial: { href: "/tutorial", label: "How it works", icon: Compass },
  settings: { href: "/settings", label: "Settings", icon: Settings },
} satisfies Record<string, NavItem>;

export interface NavSection {
  heading: string;
  items: NavItem[];
}

/** Grouped for the desktop sidebar. */
export const NAV_SECTIONS: NavSection[] = [
  { heading: "Daily", items: [NAV.dashboard, NAV.log, NAV.focus] },
  {
    heading: "Study",
    items: [NAV.mastery, NAV.quiz, NAV.mock, NAV.stories, NAV.notes],
  },
  { heading: "Review", items: [NAV.insights, NAV.weekly] },
  { heading: "Help", items: [NAV.tutorial, NAV.settings] },
];

/** Mobile bottom bar: four primary destinations; the rest live behind "More". */
export const BOTTOM_NAV: NavItem[] = [
  NAV.dashboard,
  NAV.focus,
  NAV.log,
  NAV.mastery,
];

export const MORE_NAV: NavItem[] = [
  NAV.quiz,
  NAV.mock,
  NAV.stories,
  NAV.notes,
  NAV.insights,
  NAV.weekly,
  NAV.tutorial,
  NAV.settings,
];

/** A destination is active for its own route and any nested child route. */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
