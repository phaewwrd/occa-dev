import {
  AppError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/app/lib/errors";
import { questionRepository } from "../repositories/question.repository";
import { reflectionMessageRepository } from "../repositories/reflection-message.repository";
import { reflectionSessionRepository } from "../repositories/reflection-session.repository";
import { submissionRepository } from "../repositories/submission.repository";
import {
  reflectionSnapshotSchema,
  type SaveAnswerInput,
} from "../schemas/quiz.schema";
import type { QuizQuestion, QuizResultView } from "../types/quiz.types";
import { calculateResult } from "../utils/calculate-result";
import { requireReflectionMessage } from "../utils/require-reflection-message";
import { validateAnswers } from "../utils/validate-answers";

async function requireSession(sessionId: string) {
  const session = await reflectionSessionRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError("This reflection could not be found.");
  }
  return session;
}

export const quizService = {
  async startSession() {
    return { sessionId: await reflectionSessionRepository.create() };
  },

  async getReflection(sessionId: string) {
    const session = await requireSession(sessionId);
    const [questions, savedAnswers] = await Promise.all([
      questionRepository.findAllActiveWithOptions(),
      reflectionSessionRepository.findAnswers(sessionId),
    ]);

    return {
      sessionId,
      completed: session.completedAt !== null,
      questions: questions.map(
        (question): QuizQuestion => ({
          id: question.id,
          situation: question.situation,
          dimension: question.dimension,
          order: question.order,
          options: question.options.map(({ id, label, order, icons }) => ({
            id,
            label,
            order,
            icon: icons,
          })),
        }),
      ),
      answers: Object.fromEntries(
        savedAnswers.map((answer) => [answer.questionId, answer.optionId]),
      ),
    };
  },

  async saveAnswer(input: SaveAnswerInput) {
    const session = await requireSession(input.sessionId);
    if (session.completedAt) {
      throw new ConflictError("This reflection is already complete.");
    }

    const questions = await questionRepository.findAllActiveWithOptions();
    const question = questions.find((item) => item.id === input.questionId);
    const option = question?.options.find((item) => item.id === input.optionId);
    if (!question || !option) {
      throw new ValidationError("This answer doesn't match the question.");
    }

    await reflectionSessionRepository.upsertAnswer({
      sessionId: input.sessionId,
      questionId: question.id,
      optionId: option.id,
      score: option.score,
    });
  },

  async completeSession(sessionId: string) {
    const session = await requireSession(sessionId);
    if (session.completedAt) {
      return { sessionId };
    }

    const [questions, savedAnswers] = await Promise.all([
      questionRepository.findAllActiveWithOptions(),
      reflectionSessionRepository.findAnswers(sessionId),
    ]);
    if (questions.length !== 4) {
      throw new ValidationError(
        "The quiz must have exactly four active questions.",
      );
    }

    const activeQuestionIds = new Set(questions.map((question) => question.id));
    const { dimensionScores } = validateAnswers(
      questions,
      savedAnswers.filter((answer) => activeQuestionIds.has(answer.questionId)),
    );
    const calculation = calculateResult(dimensionScores);
    const message = await reflectionMessageRepository.findByKey(
      calculation.key,
    );
    const snapshot = requireReflectionMessage(message);

    await reflectionSessionRepository.complete({
      sessionId,
      calculation,
      snapshot,
    });

    return { sessionId };
  },

  async getResult(id: string): Promise<QuizResultView> {
    const row = await submissionRepository.findResultBySessionOrResultId(id);
    if (!row) {
      throw new NotFoundError("This reflection could not be found.");
    }

    let snapshot: unknown;
    try {
      snapshot = JSON.parse(row.result.reflectionText);
    } catch {
      throw new AppError(
        "INVALID_SNAPSHOT",
        "This reflection could not be displayed.",
        500,
      );
    }
    const reflection = reflectionSnapshotSchema.safeParse(snapshot);
    if (!reflection.success) {
      throw new AppError(
        "INVALID_SNAPSHOT",
        "This reflection could not be displayed.",
        500,
      );
    }

    return {
      id: row.result.id,
      sessionId: row.result.sessionId,
      ...reflection.data,
      reflectionType: row.result.reflectionType,
      maxScore: row.result.maxScore,
      focusCount: row.result.focusCount,
      completedAt: (row.completedAt ?? row.result.createdAt).toISOString(),
    };
  },
};
