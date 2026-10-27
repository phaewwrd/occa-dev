import type { Dimension, ReflectionType } from "../utils/calculate-result";

export interface QuizQuestion {
  id: string;
  situation: string;
  dimension: Dimension;
  order: number;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  label: string;
  order: number;
  // Cloudinary image URL, optional until every option has artwork
  icon: string | null;
}

export interface QuizResultView {
  id: string;
  sessionId: string;
  title: string;
  message: string;
  reflectionType: ReflectionType;
  maxScore: number;
  focusCount: number;
  completedAt: string;
}
