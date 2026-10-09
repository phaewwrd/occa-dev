import { AppError } from "@/app/lib/errors";
import {
  type ReflectionSnapshot,
  reflectionSnapshotSchema,
} from "../schemas/quiz.schema";

interface ReflectionMessageContent {
  title: string;
  message: string;
}

export function requireReflectionMessage(
  message: ReflectionMessageContent | undefined,
): ReflectionSnapshot {
  if (!message) {
    throw new AppError(
      "CONTENT_UNAVAILABLE",
      "The reflection for this result is unavailable.",
      500,
    );
  }

  const snapshot = reflectionSnapshotSchema.safeParse(message);
  if (!snapshot.success) {
    throw new AppError(
      "CONTENT_UNAVAILABLE",
      "The reflection for this result is unavailable.",
      500,
    );
  }
  return snapshot.data;
}
