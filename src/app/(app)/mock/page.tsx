import { MockSession } from "@/components/mock/mock-session";
import { getQuizQuestions } from "@/lib/queries/quiz";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mock" };

export default async function MockPage() {
  const questions = await getQuizQuestions();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">
          Mock interview
        </h1>
        <p className="max-w-prose text-base text-muted">
          A simulated round to rehearse under pressure. Answer, reveal, self-
          assess — then read your confidence snapshot.
        </p>
      </header>
      <MockSession questions={questions} />
    </div>
  );
}
