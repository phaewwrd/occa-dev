import assert from "node:assert/strict";
import test from "node:test";
import { requireReflectionMessage } from "./require-reflection-message";

test("returns the stored title and message as a snapshot", () => {
  assert.deepEqual(
    requireReflectionMessage({
      title: "A gentle pause",
      message: "Take a moment.",
    }),
    {
      title: "A gentle pause",
      message: "Take a moment.",
    },
  );
});

test("treats a missing reflection message as an error", () => {
  assert.throws(() => requireReflectionMessage(undefined), {
    code: "CONTENT_UNAVAILABLE",
  });
});
