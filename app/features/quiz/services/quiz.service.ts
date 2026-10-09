import { AppError, NotFoundError, ValidationError } from "@/app/lib/errors";
import { questionRepository } from "../repositories/question.repository";
import { reflectionMessageRepository } from "../repositories/reflection-message.repository";
import { submissionRepository } from "../repositories/submission.repository";
import {
  reflectionSnapshotSchema,
  type SubmitQuizInput,
} from "../schemas/quiz.schema";
import { calculateResult } from "../utils/calculate-result";
import { requireReflectionMessage } from "../utils/require-reflection-message";
import { validateAnswers } from "../utils/validate-answers";

export const quizService = {
  async getQuestions() {
    const questions = await questionRepository.findAllActiveWithOptions();
    return questions.map((question) => ({
      id: question.id,
      situation: question.situation,
      dimension: question.dimension,
      order: question.order,
      options: question.options.map(({ id, label, order }) => ({
        id,
        label,
        order,
      })),
    }));
  },

  async submit(input: SubmitQuizInput) {
    const questions = await questionRepository.findAllActiveWithOptions();
    if (questions.length !== 4) {
      throw new ValidationError(
        "The quiz must have exactly four active questions.",
      );
    }

    const { dimensionScores, persistedAnswers } = validateAnswers(
      questions,
      input.answers,
    );
    const calculation = calculateResult(dimensionScores);
    const message = await reflectionMessageRepository.findByKey(
      calculation.key,
    );
    if (!message) {
      throw new AppError(
        "CONTENT_UNAVAILABLE",
        "The reflection for this result is unavailable.",
        500,
      );
    }

    const snapshot = requireReflectionMessage(message);
    const resultId = await submissionRepository.create({
      answers: persistedAnswers,
      calculation,
      snapshot,
    });

    return { resultId };
  },

  async getResult(id: string) {
    const result = await submissionRepository.findResultById(id);
    if (!result) {
      throw new NotFoundError("This reflection could not be found.");
    }

    let snapshot: unknown;
    try {
      snapshot = JSON.parse(result.reflectionText);
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
      id: result.id,
      ...reflection.data,
      reflectionType: result.reflectionType,
      maxScore: result.maxScore,
      focusCount: result.focusCount,
    };
  },
};
