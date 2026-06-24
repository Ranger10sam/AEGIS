import { Button, Card, CardContent } from "@/components/ui";

const DIFF_TONE: Record<string, string> = {
  easy: "text-success",
  medium: "text-warning",
  hard: "text-danger",
};

export function QuizCard({
  question,
  answer,
  category,
  difficulty,
  revealed,
  onReveal,
  onRate,
}: {
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  revealed: boolean;
  onReveal: () => void;
  onRate: (correct: boolean) => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded border border-line px-1.5 py-0.5 font-medium uppercase tracking-wide text-faint">
            {category}
          </span>
          <span className={`capitalize ${DIFF_TONE[difficulty] ?? "text-muted"}`}>
            {difficulty}
          </span>
        </div>

        <p className="text-lg leading-relaxed text-fg">{question}</p>

        {revealed ? (
          <>
            <div className="border-t border-line pt-4">
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                {answer}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onRate(false)}
              >
                Missed it
              </Button>
              <Button className="flex-1" onClick={() => onRate(true)}>
                Got it
              </Button>
            </div>
          </>
        ) : (
          <Button variant="secondary" className="w-full" onClick={onReveal}>
            Reveal answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
