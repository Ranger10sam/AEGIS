import { StoriesView } from "@/components/stories/stories-view";
import { getSpringConcepts } from "@/lib/queries/concepts";
import { getStories } from "@/lib/queries/stories";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stories" };

export default async function StoriesPage() {
  const [stories, concepts] = await Promise.all([
    getStories(),
    getSpringConcepts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">Story bank</h1>
        <p className="max-w-prose text-base text-muted">
          Rehearsed STAR stories grounded in your TaskFlow work. Flip on recall
          mode to practise telling them from the question alone.
        </p>
      </header>
      <StoriesView
        stories={stories}
        concepts={concepts.map((c) => ({ id: c.id, title: c.title }))}
      />
    </div>
  );
}
