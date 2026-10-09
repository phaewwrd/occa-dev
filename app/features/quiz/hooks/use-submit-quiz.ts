"use client";

import { useMutation } from "@tanstack/react-query";
import { submitQuizAction } from "../actions/submit-quiz.action";
import { quizKeys } from "../constants/query-keys";
import type { SubmitQuizInput } from "../schemas/quiz.schema";

export function useSubmitQuiz() {
  return useMutation({
    mutationKey: quizKeys.submit(),
    mutationFn: async (input: SubmitQuizInput) => {
      const result = await submitQuizAction(input);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });
}
