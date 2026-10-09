"use server";

import type { ActionResult } from "@/app/lib/action-result";
import { toActionError } from "@/app/lib/errors";
import { quizService } from "../services/quiz.service";
import type { QuizQuestion } from "../types/quiz.types";

export async function getQuestionsAction(): Promise<
  ActionResult<QuizQuestion[]>
> {
  try {
    return { ok: true, data: await quizService.getQuestions() };
  } catch (error) {
    return { ok: false, error: toActionError(error) };
  }
}
