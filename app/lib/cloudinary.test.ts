import assert from "node:assert/strict";
import test from "node:test";
import { cloudinaryUrl } from "./cloudinary";

test("inserts optimisation right after /upload/", () => {
  assert.equal(
    cloudinaryUrl(
      "https://res.cloudinary.com/demo/image/upload/v1712/icons/mail.png",
    ),
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_160/v1712/icons/mail.png",
  );
});

test("respects a custom width", () => {
  assert.equal(
    cloudinaryUrl("https://res.cloudinary.com/demo/image/upload/mail.png", {
      width: 320,
    }),
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_320/mail.png",
  );
});

test("leaves URLs that already have transformations unchanged", () => {
  const url =
    "https://res.cloudinary.com/demo/image/upload/c_fill,w_200/v1712/mail.png";
  assert.equal(cloudinaryUrl(url), url);
});

test("treats folder names with underscores as part of the public id", () => {
  assert.equal(
    cloudinaryUrl(
      "https://res.cloudinary.com/demo/image/upload/my_icons/mail.png",
    ),
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_160/my_icons/mail.png",
  );
});

test("leaves non-Cloudinary and invalid URLs unchanged", () => {
  assert.equal(
    cloudinaryUrl("https://example.com/upload/a.png"),
    "https://example.com/upload/a.png",
  );
  assert.equal(cloudinaryUrl("not a url"), "not a url");
});
