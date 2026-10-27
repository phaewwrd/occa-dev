"use client";

import { StatusCard } from "@/app/features/quiz/components/status-card";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <StatusCard
      action={
        <button
          className="min-h-12 rounded-full border-2 border-primary px-7 font-medium text-primary-ink transition-colors hover:bg-primary/10"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      }
      eyebrow="A small pause"
      message="We couldn't put your reflection together this time."
      role="alert"
      title="Something went wrong."
    />
  );
}
