import { dimensionEnum, type reflectionTypeEnum } from "@/app/db/schema";

export type Dimension = (typeof dimensionEnum.enumValues)[number];
export type DimensionScore = { dimension: Dimension; score: number };
export type ReflectionType = (typeof reflectionTypeEnum.enumValues)[number];

export interface CalculatedResult {
  maxScore: number;
  focusCount: number;
  reflectionType: ReflectionType;
  key: string;
}

const dimensions: readonly Dimension[] = dimensionEnum.enumValues;

export function calculateResult(
  scores: readonly DimensionScore[],
): CalculatedResult {
  if (scores.length !== dimensions.length) {
    throw new Error("Exactly one score is required for each dimension.");
  }

  const scoreByDimension = new Map<Dimension, number>();
  for (const { dimension, score } of scores) {
    if (scoreByDimension.has(dimension)) {
      throw new Error("Exactly one score is required for each dimension.");
    }
    if (!Number.isInteger(score) || score < 0 || score > 3) {
      throw new Error("Dimension scores must be integers from 0 to 3.");
    }
    scoreByDimension.set(dimension, score);
  }

  const maxScore = Math.max(...scoreByDimension.values());
  const topDimensions = dimensions.filter(
    (dimension) => scoreByDimension.get(dimension) === maxScore,
  );
  const focusCount = topDimensions.length;
  const reflectionType: ReflectionType = [
    "SINGLE",
    "COMBINED",
    "MULTI",
    "BROAD",
  ][focusCount - 1] as ReflectionType;
  const key =
    focusCount === dimensions.length
      ? "ALL_DIMENSIONS"
      : [...topDimensions].sort().join("_");

  return { maxScore, focusCount, reflectionType, key };
}
