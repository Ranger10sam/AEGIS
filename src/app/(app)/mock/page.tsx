import { PagePlaceholder } from "@/components/shell/page-placeholder";

export const metadata = { title: "Mock" };

export default function MockPage() {
  return (
    <PagePlaceholder
      title="Mock interview"
      description="A simulated round pulling Spring and behavioral questions. You self-assess, and it generates a confidence snapshot."
      note="Arriving in build block 13"
    />
  );
}
