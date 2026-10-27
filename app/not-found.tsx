import Link from "next/link";
import { StatusCard } from "@/app/features/quiz/components/status-card";

export default function NotFound() {
  return (
    <StatusCard
      action={
        <Link
          className="inline-flex min-h-12 items-center rounded-full border-2 border-primary px-7 font-medium text-primary-ink transition-colors hover:bg-primary/10"
          href="/"
        >
          Back to the start
        </Link>
      }
      eyebrow="Not found"
      message="The link may be incomplete, or this reflection is no longer available."
      title="This reflection isn't here."
    />
  );
}
