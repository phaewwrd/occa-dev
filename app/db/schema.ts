import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const dimensionEnum = pgEnum("dimension", [
  "SEEK_CLARITY",
  "LOOK_INWARD",
  "CONSIDER_OTHERS",
  "STEP_BACK",
]);

export const reflectionTypeEnum = pgEnum("reflection_type", [
  "SINGLE",
  "COMBINED",
  "MULTI",
  "BROAD",
]);

// Questions
export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),

  situation: text("situation").notNull(),

  dimension: dimensionEnum("dimension").notNull(),

  order: integer("order").notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Options for each question
export const questionOptions = pgTable("question_options", {
  id: uuid("id").defaultRandom().primaryKey(),

  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, {
      onDelete: "cascade",
    }),

  label: text("label").notNull(),

  score: integer("score").notNull(),

  order: integer("order").notNull(),
});

// User session
export const reflectionSessions = pgTable("reflection_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),

  startedAt: timestamp("started_at").defaultNow().notNull(),

  completedAt: timestamp("completed_at"),
});

// User answers
export const answers = pgTable("answers", {
  id: uuid("id").defaultRandom().primaryKey(),

  sessionId: uuid("session_id")
    .notNull()
    .references(() => reflectionSessions.id, {
      onDelete: "cascade",
    }),

  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, {
      onDelete: "cascade",
    }),

  optionId: uuid("option_id")
    .notNull()
    .references(() => questionOptions.id),

  score: integer("score").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Final reflection
export const reflectionResults = pgTable("reflection_results", {
  id: uuid("id").defaultRandom().primaryKey(),

  sessionId: uuid("session_id")
    .notNull()
    .unique()
    .references(() => reflectionSessions.id, {
      onDelete: "cascade",
    }),

  maxScore: integer("max_score").notNull(),

  focusCount: integer("focus_count").notNull(),

  reflectionType: reflectionTypeEnum("reflection_type").notNull(),

  reflectionText: text("reflection_text").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reflectionMessages = pgTable("reflection_messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Unique key used by application logic
  key: text("key").notNull().unique(),

  // SINGLE, COMBINED, MULTI, BROAD
  type: reflectionTypeEnum("type").notNull(),

  title: text("title").notNull(),

  message: text("message").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
