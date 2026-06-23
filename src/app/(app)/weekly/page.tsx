import { PagePlaceholder } from "@/components/shell/page-placeholder";

export const metadata = { title: "Weekly review" };

export default function WeeklyPage() {
  return (
    <PagePlaceholder
      title="Weekly review"
      description="A short guided reflection — your weakest and strongest areas, and next week's focus. It feeds the weekly digest email."
      note="Arriving in build block 18"
    />
  );
}
