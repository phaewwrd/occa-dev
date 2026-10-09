import { ValidationError } from "@/app/lib/errors";
import type { Dimension } from "./calculate-result";

export interface AnswerableQuestion {
  id: string;
  dimension: Dimension;
  options: readonly { id: string; score: number }[];
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export function validateAnswers(
  questions: readonly AnswerableQuestion[],
  answers: readonly QuizAnswer[],
) {
  if (questions.length !== 4 || answers.length !== 4) {
    throw new ValidationError("All four questions must be answered.");
  }

  const questionsById = new Map(
    questions.map((question) => [question.id, question]),
  );
  const answeredQuestionIds = new Set<string>();
  const dimensionScores = [];
  const persistedAnswers = [];

  for (const answer of answers) {
    if (answeredQuestionIds.has(answer.questionId)) {
      throw new ValidationError("Each question must be answered exactly once.");
    }
    answeredQuestionIds.add(answer.questionId);

    const question = questionsById.get(answer.questionId);
    if (!question) {
      throw new ValidationError("An answer refers to an unknown question.");
    }
    const option = question.options.find((item) => item.id === answer.optionId);
    if (!option) {
      throw new ValidationError(
        "An answer option does not belong to its question.",
      );
    }

    dimensionScores.push({
      dimension: question.dimension,
      score: option.score,
    });
    persistedAnswers.push({
      questionId: question.id,
      optionId: option.id,
      score: option.score,
    });
  }

  if (answeredQuestionIds.size !== questionsById.size) {
    throw new ValidationError("All four questions must be answered.");
  }

  return { dimensionScores, persistedAnswers };
}
