"use server";

import type { ActionResult } from "@/app/lib/action-result";
import { toActionError } from "@/app/lib/errors";
import { quizService } from "../services/quiz.service";

export async function startSessionAction(): Promise<
  ActionResult<{ sessionId: string }>
> {
  try {
    return { ok: true, data: await quizService.startSession() };
  } catch (error) {
    return { ok: false, error: toActionError(error) };
  }
}
