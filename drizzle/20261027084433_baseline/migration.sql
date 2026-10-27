CREATE TYPE "dimension" AS ENUM('SEEK_CLARITY', 'LOOK_INWARD', 'CONSIDER_OTHERS', 'STEP_BACK');--> statement-breakpoint
CREATE TYPE "reflection_type" AS ENUM('SINGLE', 'COMBINED', 'MULTI', 'BROAD');--> statement-breakpoint
CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"question_id" uuid NOT NULL,
	"icons" text,
	"label" text NOT NULL,
	"score" integer NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"situation" text NOT NULL,
	"dimension" "dimension" NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reflection_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"key" text NOT NULL UNIQUE,
	"type" "reflection_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reflection_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL UNIQUE,
	"max_score" integer NOT NULL,
	"focus_count" integer NOT NULL,
	"reflection_type" "reflection_type" NOT NULL,
	"reflection_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reflection_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_session_id_reflection_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "reflection_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_question_options_id_fkey" FOREIGN KEY ("option_id") REFERENCES "question_options"("id");--> statement-breakpoint
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_questions_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reflection_results" ADD CONSTRAINT "reflection_results_session_id_reflection_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "reflection_sessions"("id") ON DELETE CASCADE;