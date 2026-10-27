"use server";

import type { ActionResult } from "@/app/lib/action-result";
import { toActionError } from "@/app/lib/errors";
import { uuidSchema } from "../schemas/quiz.schema";
import { quizService } from "../services/quiz.service";

export async function completeSessionAction(
  sessionId: unknown,
): Promise<ActionResult<{ sessionId: string }>> {
  const parsed = uuidSchema.safeParse(sessionId);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: "This reflection couldn't be found.",
      },
    };
  }

  try {
    return { ok: true, data: await quizService.completeSession(parsed.data) };
  } catch (error) {
    return { ok: false, error: toActionError(error) };
  }
}
