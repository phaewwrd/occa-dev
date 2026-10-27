import { redirect } from "next/navigation";

// The old single-page quiz now starts from the intro, which creates a session first.
export default function QuizPage() {
  redirect("/");
}
