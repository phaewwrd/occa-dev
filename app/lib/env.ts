import { z } from "zod";

const databaseUrlSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.url().optional(),
);

const envSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
});
