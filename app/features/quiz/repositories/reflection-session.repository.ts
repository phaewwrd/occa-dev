import { randomUUID } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { getDatabase } from "@/app/db";
import {
  answers,
  reflectionResults,
  reflectionSessions,
} from "@/app/db/schema";
import type { ReflectionSnapshot } from "../schemas/quiz.schema";
import type { CalculatedResult } from "../utils/calculate-result";

interface UpsertAnswerInput {
  sessionId: string;
  questionId: string;
  optionId: string;
  score: number;
}

interface CompleteSessionInput {
  sessionId: string;
  calculation: CalculatedResult;
  snapshot: ReflectionSnapshot;
}

export const reflectionSessionRepository = {
  async create() {
    const id = randomUUID();
    await getDatabase().insert(reflectionSessions).values({ id });
    return id;
  },

  async findById(id: string) {
    const rows = await getDatabase()
      .select()
      .from(reflectionSessions)
      .where(eq(reflectionSessions.id, id))
      .limit(1);

    return rows[0];
  },

  async findAnswers(sessionId: string) {
    return getDatabase()
      .select({ questionId: answers.questionId, optionId: answers.optionId })
      .from(answers)
      .where(eq(answers.sessionId, sessionId));
  },

  async upsertAnswer(input: UpsertAnswerInput) {
    await getDatabase()
      .insert(answers)
      .values(input)
      .onConflictDoUpdate({
        target: [answers.sessionId, answers.questionId],
        set: { optionId: input.optionId, score: input.score },
      });
  },

  async complete(input: CompleteSessionInput) {
    const db = getDatabase();
    await db.batch([
      db
        .insert(reflectionResults)
        .values({
          id: randomUUID(),
          sessionId: input.sessionId,
          maxScore: input.calculation.maxScore,
          focusCount: input.calculation.focusCount,
          reflectionType: input.calculation.reflectionType,
          reflectionText: JSON.stringify(input.snapshot),
        })
        .onConflictDoNothing({ target: reflectionResults.sessionId }),
      db
        .update(reflectionSessions)
        .set({ completedAt: new Date() })
        .where(
          and(
            eq(reflectionSessions.id, input.sessionId),
            isNull(reflectionSessions.completedAt),
          ),
        ),
    ]);
  },
};
