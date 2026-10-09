import assert from "node:assert/strict";
import test from "node:test";
import { submitQuizSchema } from "./quiz.schema";

test("accepts canonical PostgreSQL UUIDs regardless of version and variant bits", () => {
  assert.equal(
    submitQuizSchema.safeParse({
      answers: [1, 2, 3, 4].map((number) => ({
        questionId: `10000000-0000-0000-0000-${String(number).padStart(12, "0")}`,
        optionId: `20000000-0000-0000-0000-${String(number).padStart(12, "0")}`,
      })),
    }).success,
    true,
  );
});
