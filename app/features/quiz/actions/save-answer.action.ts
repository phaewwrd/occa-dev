"use server";

import type { ActionResult } from "@/app/lib/action-result";
import { toActionError } from "@/app/lib/errors";
import { saveAnswerSchema } from "../schemas/quiz.schema";
import { quizService } from "../services/quiz.service";

export async function saveAnswerAction(
  input: unknown,
): Promise<ActionResult<null>> {
  const parsed = saveAnswerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: { code: "VALIDATION", message: "This answer couldn't be read." },
    };
  }

  try {
    await quizService.saveAnswer(parsed.data);
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, error: toActionError(error) };
  }
}
