"use client";

import { useMutation } from "@tanstack/react-query";
import { withMinDelay } from "@/app/lib/with-min-delay";
import { completeSessionAction } from "../actions/complete-session.action";
import { quizKeys } from "../constants/query-keys";

// Long enough for "Reflecting…" to read as a calm pause rather than a flicker.
const MIN_REFLECTING_MS = 900;

export function useCompleteSession() {
  return useMutation({
    mutationKey: quizKeys.completeSession(),
    mutationFn: async (sessionId: string) => {
      const result = await withMinDelay(
        completeSessionAction(sessionId),
        MIN_REFLECTING_MS,
      );
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });
}
