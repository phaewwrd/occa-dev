import { eq, or } from "drizzle-orm";
import { getDatabase } from "@/app/db";
import { reflectionResults, reflectionSessions } from "@/app/db/schema";

export const submissionRepository = {
  // Matches by session id, or by result id so links shared before the redesign keep working.
  async findResultBySessionOrResultId(id: string) {
    const rows = await getDatabase()
      .select({
        result: reflectionResults,
        completedAt: reflectionSessions.completedAt,
      })
      .from(reflectionResults)
      .innerJoin(
        reflectionSessions,
        eq(reflectionSessions.id, reflectionResults.sessionId),
      )
      .where(
        or(eq(reflectionResults.sessionId, id), eq(reflectionResults.id, id)),
      )
      .limit(1);

    return rows[0];
  },
};
