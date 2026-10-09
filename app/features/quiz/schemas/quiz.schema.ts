import { z } from "zod";

export const uuidSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

export const answerSchema = z.object({
  questionId: uuidSchema,
  optionId: uuidSchema,
});

export const submitQuizSchema = z.object({
  answers: z.array(answerSchema).length(4),
});

export const reflectionSnapshotSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
});

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type ReflectionSnapshot = z.infer<typeof reflectionSnapshotSchema>;
