import assert from "node:assert/strict";
import test from "node:test";
import { saveAnswerSchema } from "./quiz.schema";

test("accepts canonical PostgreSQL UUIDs regardless of version and variant bits", () => {
  assert.equal(
    saveAnswerSchema.safeParse({
      sessionId: "00000000-0000-0000-0000-000000000001",
      questionId: "10000000-0000-0000-0000-000000000001",
      optionId: "20000000-0000-0000-0000-000000000001",
    }).success,
    true,
  );
});

test("rejects malformed ids", () => {
  assert.equal(
    saveAnswerSchema.safeParse({
      sessionId: "not-a-uuid",
      questionId: "10000000-0000-0000-0000-000000000001",
      optionId: "20000000-0000-0000-0000-000000000001",
    }).success,
    false,
  );
});
