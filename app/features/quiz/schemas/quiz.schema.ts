import { z } from "zod";

export const uuidSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

export const saveAnswerSchema = z.object({
  sessionId: uuidSchema,
  questionId: uuidSchema,
  optionId: uuidSchema,
});

export const reflectionSnapshotSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
});

export type SaveAnswerInput = z.infer<typeof saveAnswerSchema>;
export type ReflectionSnapshot = z.infer<typeof reflectionSnapshotSchema>;
