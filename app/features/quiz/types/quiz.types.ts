import type { Dimension, ReflectionType } from "../utils/calculate-result";
import type { OptionIconData } from "../utils/parse-option-icon";

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
  // Lucide icon parsed from the stored JSX string, optional until every option has one
  icon: OptionIconData | null;
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
