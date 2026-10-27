"use client";

import { useMutation } from "@tanstack/react-query";
import { saveAnswerAction } from "../actions/save-answer.action";
import { quizKeys } from "../constants/query-keys";
import type { SaveAnswerInput } from "../schemas/quiz.schema";

export function useSaveAnswer() {
  return useMutation({
    mutationKey: quizKeys.saveAnswer(),
    mutationFn: async (input: SaveAnswerInput) => {
      const result = await saveAnswerAction(input);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
    },
  });
}
