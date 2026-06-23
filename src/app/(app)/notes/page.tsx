import { PagePlaceholder } from "@/components/shell/page-placeholder";

export const metadata = { title: "Notes" };

export default function NotesPage() {
  return (
    <PagePlaceholder
      title="Quick notes"
      description="A tagged scratchpad for insights and mistakes. Pin the ones that matter; everything stays anchored to your prep."
      note="Arriving in build block 15"
    />
  );
}
