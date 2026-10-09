import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/app/db";
import {
  answers,
  reflectionResults,
  reflectionSessions,
} from "@/app/db/schema";
import type { ReflectionSnapshot } from "../schemas/quiz.schema";
import type { CalculatedResult } from "../utils/calculate-result";

interface CreateSubmissionInput {
  answers: { questionId: string; optionId: string; score: number }[];
  calculation: CalculatedResult;
  snapshot: ReflectionSnapshot;
}

export const submissionRepository = {
  async create(input: CreateSubmissionInput) {
    const sessionId = randomUUID();
    const resultId = randomUUID();
    const completedAt = new Date();
    const db = getDatabase();

    await db.batch([
      db.insert(reflectionSessions).values({ id: sessionId, completedAt }),
      db
        .insert(answers)
        .values(input.answers.map((answer) => ({ ...answer, sessionId }))),
      db.insert(reflectionResults).values({
        id: resultId,
        sessionId,
        maxScore: input.calculation.maxScore,
        focusCount: input.calculation.focusCount,
        reflectionType: input.calculation.reflectionType,
        reflectionText: JSON.stringify(input.snapshot),
      }),
    ]);

    return resultId;
  },

  async findResultById(id: string) {
    const rows = await getDatabase()
      .select()
      .from(reflectionResults)
      .where(eq(reflectionResults.id, id))
      .limit(1);

    return rows[0];
  },
};
