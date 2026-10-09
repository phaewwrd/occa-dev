import assert from "node:assert/strict";
import test from "node:test";
import { calculateResult, type DimensionScore } from "./calculate-result";

const makeScores = (
  scores: readonly [number, number, number, number],
): DimensionScore[] => [
  { dimension: "SEEK_CLARITY", score: scores[0] },
  { dimension: "LOOK_INWARD", score: scores[1] },
  { dimension: "CONSIDER_OTHERS", score: scores[2] },
  { dimension: "STEP_BACK", score: scores[3] },
];

test("returns a single leading dimension", () => {
  assert.deepEqual(calculateResult(makeScores([3, 1, 2, 0])), {
    maxScore: 3,
    focusCount: 1,
    reflectionType: "SINGLE",
    key: "SEEK_CLARITY",
  });
});

test("includes both dimensions in a two-way tie with an alphabetical key", () => {
  assert.deepEqual(calculateResult(makeScores([3, 1, 3, 0])), {
    maxScore: 3,
    focusCount: 2,
    reflectionType: "COMBINED",
    key: "CONSIDER_OTHERS_SEEK_CLARITY",
  });
});

test("includes all three dimensions in a three-way tie", () => {
  assert.deepEqual(calculateResult(makeScores([3, 3, 1, 3])), {
    maxScore: 3,
    focusCount: 3,
    reflectionType: "MULTI",
    key: "LOOK_INWARD_SEEK_CLARITY_STEP_BACK",
  });
});

test("uses the special key when all four dimensions tie", () => {
  assert.deepEqual(calculateResult(makeScores([2, 2, 2, 2])), {
    maxScore: 2,
    focusCount: 4,
    reflectionType: "BROAD",
    key: "ALL_DIMENSIONS",
  });
});

test("treats four zero scores as a valid broad result", () => {
  assert.equal(calculateResult(makeScores([0, 0, 0, 0])).key, "ALL_DIMENSIONS");
});

test("rejects missing, extra, or duplicate dimension scores", () => {
  assert.throws(() => calculateResult(makeScores([1, 2, 3, 4]).slice(0, 3)));
  assert.throws(() =>
    calculateResult([
      ...makeScores([1, 2, 3, 0]).slice(0, 3),
      { dimension: "SEEK_CLARITY", score: 0 },
    ]),
  );
});
