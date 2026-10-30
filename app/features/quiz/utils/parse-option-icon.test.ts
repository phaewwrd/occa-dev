import assert from "node:assert/strict";
import test from "node:test";
import { parseOptionIcon } from "./parse-option-icon";

test("reads a JSX tag with a color", () => {
  assert.deepEqual(parseOptionIcon('<Mail color="#02271f" />'), {
    name: "mail",
    color: "#02271f",
  });
});

test("reads a bare PascalCase or kebab-case name", () => {
  assert.deepEqual(parseOptionIcon("MessageCircle"), {
    name: "message-circle",
    color: null,
  });
  assert.deepEqual(parseOptionIcon("message-circle"), {
    name: "message-circle",
    color: null,
  });
});

test("resolves PascalCase names that contain digits", () => {
  assert.ok(parseOptionIcon("<Grid2x2Check />"));
  assert.ok(parseOptionIcon("<ArrowUp01 />"));
});

test("returns null for empty or unknown icons", () => {
  assert.equal(parseOptionIcon(null), null);
  assert.equal(parseOptionIcon(""), null);
  assert.equal(parseOptionIcon("<NotARealIcon />"), null);
  assert.equal(
    parseOptionIcon("https://res.cloudinary.com/demo/image/upload/mail.png"),
    null,
  );
});
