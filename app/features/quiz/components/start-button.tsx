"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CircleButton } from "@/app/components/circle-button";
import { useStartSession } from "../hooks/use-start-session";

interface StartButtonProps {
  className?: string;
}

export function StartButton({ className = "" }: StartButtonProps) {
  const router = useRouter();
  const startSession = useStartSession();
  const { reset } = startSession;

  // The intro stays mounted in the background (cacheComponents), so clear the previous run on return.
  useEffect(() => {
    reset();
  }, [reset]);

  const busy = startSession.isPending || startSession.isSuccess;

  return (
    <div
      className={`flex flex-col items-center gap-3 md:items-end ${className}`}
    >
      <p
        aria-live="polite"
        className="min-h-5 text-sm text-muted"
        role={startSession.isError ? "alert" : undefined}
      >
        {startSession.isError
          ? "We couldn't start just now. Please try again."
          : busy
            ? "Getting ready…"
            : ""}
      </p>
      <CircleButton
        label="Start your reflection"
        loading={busy}
        onClick={() =>
          startSession.mutate(undefined, {
            onSuccess: ({ sessionId }) => router.push(`/reflect/${sessionId}`),
          })
        }
      />
    </div>
  );
}
