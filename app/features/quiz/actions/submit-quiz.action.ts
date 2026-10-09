"use server";

import type { ActionResult } from "@/app/lib/action-result";
import { toActionError } from "@/app/lib/errors";
import { submitQuizSchema } from "../schemas/quiz.schema";
import { quizService } from "../services/quiz.service";

export async function submitQuizAction(
  input: unknown,
): Promise<ActionResult<{ resultId: string }>> {
  const parsed = submitQuizSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: "Answer all four questions before continuing.",
      },
    };
  }

  try {
    return { ok: true, data: await quizService.submit(parsed.data) };
  } catch (error) {
    return { ok: false, error: toActionError(error) };
  }
}
