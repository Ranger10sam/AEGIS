"use client";

import * as React from "react";

import { ConfidenceBar } from "@/components/mastery/confidence-bar";
import { Button, Card, CardContent, Segmented } from "@/components/ui";
import type { QuizQuestion } from "@/lib/database.types";

const LENGTHS = [
  { value: "5", label: "5" },
  { value: "8", label: "8" },
  { value: "12", label: "12" },
];

const RATINGS = [
  { label: "Blanked", score: 0 },
  { label: "Shaky", score: 2 },
  { label: "Solid", score: 3 },
  { label: "Strong", score: 5 },
];

interface Answered {
  id: string;
  question: string;
  category: string;
  score: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** An interview-shaped mix: mostly Spring, a couple behavioral, one DSA. */
function buildMock(questions: QuizQuestion[], size: number): QuizQuestion[] {
  const byCat = (c: string) => shuffle(questions.filter((q) => q.category === c));
  const behavioral = byCat("behavioral");
  const dsa = byCat("dsa");
  const spring = byCat("spring");

  const nBehavioral = Math.min(2, behavioral.length, Math.max(1, Math.round(size * 0.2)));
  const nDsa = Math.min(1, dsa.length);
  const nSpring = Math.max(0, size - nBehavioral - nDsa);

  const set = [
    ...spring.slice(0, nSpring),
    ...behavioral.slice(0, nBehavioral),
    ...dsa.slice(0, nDsa),
  ];
  return shuffle(set);
}

type Phase = "idle" | "mock" | "snapshot";

export function MockSession({ questions }: { questions: QuizQuestion[] }) {
  const [size, setSize] = React.useState(8);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [set, setSet] = React.useState<QuizQuestion[]>([]);
  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [answers, setAnswers] = React.useState<Answered[]>([]);

  function start() {
    const built = buildMock(questions, size);
    setSet(built);
    setIndex(0);
    setRevealed(false);
    setAnswers([]);
    setPhase(built.length ? "mock" : "idle");
  }

  function rate(score: number) {
    const q = set[index];
    setAnswers((prev) => [
      ...prev,
      { id: q.id, question: q.question, category: q.category, score },
    ]);
    if (index + 1 >= set.length) {
      setPhase("snapshot");
    } else {
      setIndex(index + 1);
      setRevealed(false);
    }
  }

  const current = set[index];

  if (phase === "idle") {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-5 p-5 sm:p-6">
          <p className="max-w-prose text-base text-muted">
            A simulated round — mostly Spring with a behavioral question or two.
            Answer in your head (or out loud), reveal the model answer, then rate
            how you did. You&apos;ll get a confidence snapshot at the end.
          </p>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-fg">Length</span>
            <Segmented
              ariaLabel="Mock length"
              value={String(size)}
              onValueChange={(v) => setSize(Number(v))}
              options={LENGTHS}
            />
          </div>
          <Button onClick={start}>Start mock</Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === "mock" && current) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-muted">
            Question {index + 1} of {set.length}
          </span>
          <div className="h-1 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-fg transition-[width] duration-300"
              style={{ width: `${(index / set.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
            <span className="text-xs font-medium uppercase tracking-wide text-faint">
              {current.category}
            </span>
            <p className="text-lg leading-relaxed text-fg">
              {current.question}
            </p>

            {revealed ? (
              <>
                <div className="border-t border-line pt-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                    {current.answer}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-fg">
                    How did you do?
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {RATINGS.map((r) => (
                      <Button
                        key={r.label}
                        variant="outline"
                        className="flex-1"
                        onClick={() => rate(r.score)}
                      >
                        {r.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setRevealed(true)}
              >
                Reveal model answer
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Snapshot
  const overall =
    answers.length > 0
      ? answers.reduce((s, a) => s + a.score, 0) / answers.length
      : 0;
  const cats = new Map<string, { sum: number; n: number }>();
  for (const a of answers) {
    const c = cats.get(a.category) ?? { sum: 0, n: 0 };
    c.sum += a.score;
    c.n += 1;
    cats.set(a.category, c);
  }
  const weakest = [...answers]
    .filter((a) => a.score <= 2)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted">Confidence snapshot</span>
            <p className="font-display text-3xl text-fg">
              {overall.toFixed(1)}
              <span className="ml-1 text-lg text-muted">/ 5</span>
            </p>
            <ConfidenceBar value={Math.round(overall)} />
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-4">
            {[...cats.entries()].map(([cat, { sum, n }]) => (
              <div key={cat} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-muted">{cat}</span>
                  <span className="font-mono tabular-nums text-fg">
                    {(sum / n).toFixed(1)} / 5
                  </span>
                </div>
                <ConfidenceBar value={Math.round(sum / n)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
          <span className="text-sm font-medium text-fg">
            {weakest.length ? "Worth revisiting" : "No weak spots this round"}
          </span>
          {weakest.length ? (
            <ul className="flex flex-col gap-2">
              {weakest.map((w) => (
                <li key={w.id} className="text-sm text-muted">
                  <span className="mr-2 text-xs uppercase tracking-wide text-faint">
                    {w.category}
                  </span>
                  {w.question}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              Strong round. Run another to keep it sharp.
            </p>
          )}
        </CardContent>
      </Card>

      <Button onClick={start} className="w-fit">
        Run another
      </Button>
    </div>
  );
}
