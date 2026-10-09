import assert from "node:assert/strict";
import test from "node:test";
import { validateAnswers } from "./validate-answers";

const questions = [
  { id: "q1", dimension: "SEEK_CLARITY", options: [{ id: "o1", score: 1 }] },
  { id: "q2", dimension: "LOOK_INWARD", options: [{ id: "o2", score: 2 }] },
  { id: "q3", dimension: "CONSIDER_OTHERS", options: [{ id: "o3", score: 3 }] },
  { id: "q4", dimension: "STEP_BACK", options: [{ id: "o4", score: 0 }] },
] as const;

const answers = [
  { questionId: "q1", optionId: "o1" },
  { questionId: "q2", optionId: "o2" },
  { questionId: "q3", optionId: "o3" },
  { questionId: "q4", optionId: "o4" },
];

test("uses scores from the selected database options", () => {
  assert.deepEqual(validateAnswers(questions, answers).dimensionScores, [
    { dimension: "SEEK_CLARITY", score: 1 },
    { dimension: "LOOK_INWARD", score: 2 },
    { dimension: "CONSIDER_OTHERS", score: 3 },
    { dimension: "STEP_BACK", score: 0 },
  ]);
});

test("rejects a missing answer", () => {
  assert.throws(() => validateAnswers(questions, answers.slice(0, 3)));
});

test("rejects duplicate answers and unknown question ids", () => {
  assert.throws(() =>
    validateAnswers(questions, [
      answers[0],
      answers[0],
      answers[2],
      answers[3],
    ]),
  );
  assert.throws(() =>
    validateAnswers(questions, [
      ...answers.slice(0, 3),
      { questionId: "q5", optionId: "o4" },
    ]),
  );
});

test("rejects an option belonging to another question", () => {
  assert.throws(() =>
    validateAnswers(questions, [
      { ...answers[0], optionId: "o2" },
      ...answers.slice(1),
    ]),
  );
});
