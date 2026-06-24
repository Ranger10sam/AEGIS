import { NotesView } from "@/components/notes/notes-view";
import { getNotes } from "@/lib/queries/notes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notes" };

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-fg sm:text-3xl">Quick notes</h1>
        <p className="max-w-prose text-base text-muted">
          A tagged scratchpad for insights and mistakes. Pin the ones worth
          keeping in view.
        </p>
      </header>
      <NotesView notes={notes} />
    </div>
  );
}
