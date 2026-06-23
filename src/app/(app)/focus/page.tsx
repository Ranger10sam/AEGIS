import { PagePlaceholder } from "@/components/shell/page-placeholder";

export const metadata = { title: "Focus" };

export default function FocusPage() {
  return (
    <PagePlaceholder
      title="Focus timer"
      description="A Pomodoro-style timer with a gentle completion chime. When it ends, it offers to log the session you just finished."
      note="Arriving in build block 9"
    />
  );
}
