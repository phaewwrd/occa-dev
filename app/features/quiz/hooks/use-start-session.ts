"use client";

import { useMutation } from "@tanstack/react-query";
import { startSessionAction } from "../actions/start-session.action";
import { quizKeys } from "../constants/query-keys";

export function useStartSession() {
  return useMutation({
    mutationKey: quizKeys.startSession(),
    mutationFn: async () => {
      const result = await startSessionAction();
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });
}
