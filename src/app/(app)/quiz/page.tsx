import { QuizSession } from "@/components/quiz/quiz-session";
import { getQuizQuestions } from "@/lib/queries/quiz";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quiz" };

export default async function QuizPage() {
  const questions = await getQuizQuestions();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">Quiz</h1>
        <p className="max-w-prose text-base text-muted">
          Recall, reveal, and rate yourself honestly. The questions you miss
          come back sooner.
        </p>
      </header>
      <QuizSession initial={questions} />
    </div>
  );
}
