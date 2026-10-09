"use client";

import { useQuery } from "@tanstack/react-query";
import { withMinDelay } from "@/app/lib/with-min-delay";
import { getQuestionsAction } from "../actions/get-questions.action";
import { quizKeys } from "../constants/query-keys";

export function useQuestions() {
  return useQuery({
    queryKey: quizKeys.questions(),
    queryFn: async () => {
      const result = await withMinDelay(getQuestionsAction());
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
