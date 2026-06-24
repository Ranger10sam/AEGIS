import Link from "next/link";

import { Card } from "@/components/ui/card";
import { NAV, type NavItem } from "@/lib/nav";

export const metadata = { title: "How it works" };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl text-fg">{title}</h2>
      {children}
    </section>
  );
}

const DAILY_FLOW = [
  "Open the dashboard and read the mission brief.",
  "Start a focus session with the timer.",
  "Study the suggested concept or your own pick — and tie it back to TaskFlow.",
  "Log the session honestly: depth and confidence as they really are.",
  "Optional: one quiz round, or rehearse a story.",
];

const PHASES = [
  {
    n: 1,
    label: "Habit Lock",
    body: "The only goal is showing up. Short sessions. Build the daily reflex.",
  },
  {
    n: 2,
    label: "Depth Build",
    body: "Go deeper. Tie every concept to TaskFlow. Patterns over problems.",
  },
  {
    n: 3,
    label: "Peak Mode",
    body: "Full intensity. Mocks, quizzes, weak-link drilling. Interview-ready.",
  },
];

const FEATURES: { item: NavItem; body: string }[] = [
  { item: NAV.dashboard, body: "Your command center — the Today ring, streak, and what to focus on." },
  { item: NAV.log, body: "Record what you studied, with honest depth and confidence." },
  { item: NAV.focus, body: "A timer for deliberate, single-task study; offers to log when it ends." },
  { item: NAV.mastery, body: "Every concept and pattern by confidence, anchored to TaskFlow." },
  { item: NAV.quiz, body: "Concept-tied flashcards; the ones you miss come back sooner." },
  { item: NAV.mock, body: "A simulated interview round with a confidence snapshot." },
  { item: NAV.stories, body: "STAR stories from your own work, rehearsed until natural." },
  { item: NAV.notes, body: "A tagged scratchpad for insights and mistakes." },
  { item: NAV.insights, body: "Trends, velocity, coverage, and your activity calendar." },
  { item: NAV.weekly, body: "A short weekly reflection that feeds your digest." },
];

export default function TutorialPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">
          How it works
        </h1>
        <p className="text-base text-muted">
          Aegis is a daily operating system for deliberate prep. Become genuinely
          good at Java, Spring Boot, and DSA — the offer follows from that, not
          the other way around.
        </p>
      </header>

      <Section title="The daily flow">
        <ol className="flex flex-col gap-2">
          {DAILY_FLOW.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-muted">
              <span className="font-mono text-faint">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="The three phases">
        <p className="text-sm text-muted">
          Phase is derived from your start date and duration — intensity ramps up
          as you go. You don&apos;t set it; you grow into it.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {PHASES.map((p) => (
            <Card key={p.n}>
              <div className="flex flex-col gap-1.5 p-4">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  Phase {p.n}
                </span>
                <span className="font-medium text-fg">{p.label}</span>
                <p className="text-sm text-muted">{p.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Each area, briefly">
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map(({ item, body }) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong"
              >
                <Card className="h-full transition-colors hover:border-line-strong">
                  <div className="flex h-full gap-3 p-4">
                    <Icon className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-fg">
                        {item.label}
                      </span>
                      <p className="text-sm text-muted">{body}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title="The method">
        <div className="flex flex-col gap-2 text-sm text-muted">
          <p>
            <span className="text-fg">Concept-first beats grinding.</span> Learn
            a DSA pattern deeply, then solve four to six problems that need only
            that pattern — recognition is the skill interviews test.
          </p>
          <p>
            <span className="text-fg">Confidence is tracked</span> because honest
            self-assessment is what surfaces your real gaps, not a problem count.
          </p>
          <p>
            <span className="text-fg">Everything ties to TaskFlow</span> so you
            speak from genuine understanding of your own code, not rote memory.
          </p>
        </div>
      </Section>

      <Section title="Honesty matters">
        <Card>
          <div className="p-5 sm:p-6">
            <p className="text-sm text-muted">
              This only works if your ratings are truthful. Mark a concept low
              when it&apos;s low — that&apos;s exactly how the weak links rise to
              the top and get your attention. Nobody&apos;s watching the numbers
              but you.
            </p>
          </div>
        </Card>
      </Section>
    </div>
  );
}
