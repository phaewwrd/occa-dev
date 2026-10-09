import { asc, eq } from "drizzle-orm";
import { getDatabase } from "@/app/db";
import { questionOptions, questions } from "@/app/db/schema";

export const questionRepository = {
  async findAllActiveWithOptions() {
    const db = getDatabase();
    const questionRows = await db
      .select()
      .from(questions)
      .where(eq(questions.isActive, true))
      .orderBy(asc(questions.order));

    const optionRows = await db
      .select()
      .from(questionOptions)
      .orderBy(asc(questionOptions.order));

    return questionRows.map((question) => ({
      ...question,
      options: optionRows
        .filter((option) => option.questionId === question.id)
        .filter((option) => option.questionId === question.id),
    }));
  },
};
