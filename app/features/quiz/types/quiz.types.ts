import type { Dimension } from "../utils/calculate-result";

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
}

export interface QuizResultView {
  id: string;
  title: string;
  message: string;
  reflectionType: "SINGLE" | "COMBINED" | "MULTI" | "BROAD";
  maxScore: number;
  focusCount: number;
}
