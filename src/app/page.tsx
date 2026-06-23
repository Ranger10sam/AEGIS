import { redirect } from "next/navigation";

// The dashboard is the home of the app. Auth (build block 5) will gate this and
// send unauthenticated visitors to /login.
export default function RootPage() {
  redirect("/dashboard");
}
