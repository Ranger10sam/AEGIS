import { PagePlaceholder } from "@/components/shell/page-placeholder";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <PagePlaceholder
      title="The War Room"
      description="Your daily command center: the Today ring, current streak, key stats, a short mission brief, and what to focus on next."
      note="Arriving in build block 10"
    />
  );
}
