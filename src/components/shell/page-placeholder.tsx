/**
 * Temporary stand-in for routes whose real screens land in later build blocks.
 * Keeps the shell fully navigable and gives each route an honest, calm empty
 * state instead of a 404.
 */
export function PagePlaceholder({
  title,
  description,
  note,
}: {
  title: string;
  description: string;
  note?: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="font-display text-2xl text-fg sm:text-3xl">{title}</h1>
      <p className="max-w-prose text-base text-muted">{description}</p>
      {note && (
        <p className="mt-2 w-fit rounded-md border border-line bg-surface px-3 py-2 font-mono text-xs text-faint">
          {note}
        </p>
      )}
    </section>
  );
}
