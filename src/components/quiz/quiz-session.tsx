"use client";

import * as React from "react";

import { recordQuizResult } from "@/app/(app)/quiz/actions";
import { Button, Card, CardContent, Segmented } from "@/components/ui";
import type { QuizQuestion } from "@/lib/database.types";
import { QuizCard } from "./quiz-card";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "spring", label: "Spring" },
  { value: "dsa", label: "DSA" },
  { value: "behavioral", label: "Behavioral" },
];
const ROUND_SIZE = 10;

/** Spaced-repetition-lite: unseen first, then lowest accuracy, then stalest. */
function priority(a: QuizQuestion, b: QuizQuestion): number {
  const ua = a.times_seen === 0;
  const ub = b.times_seen === 0;
  if (ua !== ub) return ua ? -1 : 1;
  const accA = a.times_seen ? a.times_correct / a.times_seen : 0;
  const accB = b.times_seen ? b.times_correct / b.times_seen : 0;
  if (accA !== accB) return accA - accB;
  const la = a.last_seen ?? "";
  const lb = b.last_seen ?? "";
  return la < lb ? -1 : la > lb ? 1 : 0;
}

type Phase = "idle" | "quiz" | "summary";

export function QuizSession({ initial }: { initial: QuizQuestion[] }) {
  const [questions, setQuestions] = React.useState(initial);
  const [category, setCategory] = React.useState("all");
  const [batch, setBatch] = React.useState<QuizQuestion[]>([]);
  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [correct, setCorrect] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("idle");

  const poolCount =
    category === "all"
      ? questions.length
      : questions.filter((q) => q.category === category).length;

  function startRound() {
    const pool =
      category === "all"
        ? questions
        : questions.filter((q) => q.category === category);
    const round = [...pool].sort(priority).slice(0, ROUND_SIZE);
    setBatch(round);
    setIndex(0);
    setRevealed(false);
    setCorrect(0);
    setPhase(round.length ? "quiz" : "idle");
  }

  function onCategory(next: string) {
    setCategory(next);
    setPhase("idle");
  }

  function onRate(isCorrect: boolean) {
    const q = batch[index];
    void recordQuizResult(q.id, isCorrect);
    // Update local stats so the next round's ordering reflects this answer.
    setQuestions((prev) =>
      prev.map((x) =>
        x.id === q.id
          ? {
              ...x,
              times_seen: x.times_seen + 1,
              times_correct: x.times_correct + (isCorrect ? 1 : 0),
            }
          : x,
      ),
    );
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    setCorrect(nextCorrect);
    if (index + 1 >= batch.length) {
      setPhase("summary");
    } else {
      setIndex(index + 1);
      setRevealed(false);
    }
  }

  const current = batch[index];

  return (
    <div className="flex flex-col gap-6">
      <Segmented
        ariaLabel="Quiz category"
        value={category}
        onValueChange={onCategory}
        options={CATEGORIES}
      />

      {phase === "idle" ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-5 sm:p-6">
            {poolCount === 0 ? (
              <p className="text-sm text-muted">
                No questions in this category yet.
              </p>
            ) : (
              <>
                <p className="text-base text-muted">
                  {poolCount} question{poolCount === 1 ? "" : "s"} ready. A round
                  is up to {ROUND_SIZE} — weakest and least-seen first.
                </p>
                <Button onClick={startRound}>Start round</Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : null}

      {phase === "quiz" && current ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>
                Question {index + 1} of {batch.length}
              </span>
              <span className="font-mono tabular-nums">{correct} correct</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-elevated">
              <div
                className="h-full rounded-full bg-fg transition-[width] duration-300"
                style={{ width: `${(index / batch.length) * 100}%` }}
              />
            </div>
          </div>
          <QuizCard
            key={current.id}
            question={current.question}
            answer={current.answer}
            category={current.category}
            difficulty={current.difficulty}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
            onRate={onRate}
          />
        </div>
      ) : null}

      {phase === "summary" ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-5 sm:p-6">
            <div className="flex flex-col gap-1">
              <p className="font-display text-3xl text-fg">
                {correct}/{batch.length}
              </p>
              <p className="text-sm text-muted">
                {correct === batch.length
                  ? "Clean sweep. Those are locked in."
                  : correct >= batch.length / 2
                    ? "Solid round — the misses will resurface sooner."
                    : "Worth another pass. The weak ones come back first."}
              </p>
            </div>
            <Button onClick={startRound}>Another round</Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
