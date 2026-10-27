"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CircleButton } from "@/app/components/circle-button";
import { MascotPlaceholder } from "@/app/components/mascot-placeholder";
import { WindowCard } from "@/app/components/window-card";
import { cloudinaryUrl } from "@/app/lib/cloudinary";
import { useCompleteSession } from "../hooks/use-complete-session";
import { useSaveAnswer } from "../hooks/use-save-answer";
import type { QuizQuestion } from "../types/quiz.types";
import { ProgressBar } from "./progress-bar";
import { QuestionPanel } from "./question-panel";

interface ReflectionFlowProps {
  sessionId: string;
  questions: QuizQuestion[];
  initialAnswers: Record<string, string>;
}

// Time for the highlight sweep and bob to finish before moving on.
const ADVANCE_DELAY_MS = 650;

export function ReflectionFlow({
  sessionId,
  questions,
  initialAnswers,
}: ReflectionFlowProps) {
  const router = useRouter();
  const saveAnswer = useSaveAnswer();
  const completeSession = useCompleteSession();
  const total = questions.length;

  const [step, setStep] = useState(() => {
    const firstUnanswered = questions.findIndex((q) => !initialAnswers[q.id]);
    return firstUnanswered === -1 ? total : firstUnanswered;
  });
  const [answers, setAnswers] = useState(initialAnswers);
  const [locked, setLocked] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const lockedRef = useRef(false);
  const skipDelayRef = useRef<(() => void) | null>(null);
  const hasAdvancedRef = useRef(false);

  const question = questions[step];
  const selectedOptionId = question ? answers[question.id] : undefined;
  const completing = step >= total;

  const { mutate: complete } = completeSession;
  const runCompletion = useCallback(() => {
    complete(sessionId, {
      onSuccess: () => router.replace(`/result/${sessionId}`),
    });
  }, [complete, router, sessionId]);

  useEffect(() => {
    if (completing) {
      runCompletion();
    }
  }, [completing, runCompletion]);

  // Warm the browser cache so the next question's icons appear with it.
  useEffect(() => {
    for (const option of questions[step + 1]?.options ?? []) {
      if (option.icon) {
        new window.Image().src = cloudinaryUrl(option.icon);
      }
    }
  }, [questions, step]);

  function setLock(value: boolean) {
    lockedRef.current = value;
    setLocked(value);
  }

  async function select(optionId: string) {
    if (lockedRef.current || !question) {
      return;
    }
    setLock(true);
    setSaveFailed(false);
    setAnswers((previous) => ({ ...previous, [question.id]: optionId }));

    const delay = new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, ADVANCE_DELAY_MS);
      skipDelayRef.current = () => {
        clearTimeout(timer);
        resolve();
      };
    });

    try {
      // The animation runs regardless; we only advance once the answer is safely stored.
      await Promise.all([
        saveAnswer.mutateAsync({
          sessionId,
          questionId: question.id,
          optionId,
        }),
        delay,
      ]);
    } catch {
      setSaveFailed(true);
      setLock(false);
      return;
    } finally {
      skipDelayRef.current = null;
    }

    hasAdvancedRef.current = true;
    setStep((current) => current + 1);
    setLock(false);
  }

  function next() {
    if (skipDelayRef.current) {
      skipDelayRef.current();
    } else if (selectedOptionId) {
      select(selectedOptionId);
    }
  }

  const answeredCount = completing ? total : step + (selectedOptionId ? 1 : 0);

  return (
    <main className="flex flex-1 flex-col items-center px-4 pt-6 pb-16 md:justify-center md:px-8 md:pt-8 md:pb-20">
      <div className="relative w-full max-w-[1030px]">
        <WindowCard
          toolbar={
            <span className="text-sm text-muted tabular-nums md:text-base">
              {Math.min(step + 1, total)} of {total}
            </span>
          }
          topEdge={<ProgressBar total={total} value={answeredCount} />}
        >
          <p aria-live="polite" className="sr-only">
            {completing
              ? "Reflecting on your answers"
              : `Question ${step + 1} of ${total}`}
          </p>
          <div className="flex min-h-[30rem] flex-col px-4 pt-8 pb-28 sm:px-6 md:min-h-[34rem] md:px-12 md:pt-12 md:pb-32 lg:min-h-[37rem]">
            <AnimatePresence initial={false} mode="wait">
              {question ? (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -48 }}
                  initial={{ opacity: 0, x: 48 }}
                  key={question.id}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <QuestionPanel
                    focusOnMount={hasAdvancedRef.current}
                    locked={locked}
                    onSelect={select}
                    question={question}
                    selectedOptionId={selectedOptionId}
                  />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="m-auto text-center"
                  initial={{ opacity: 0 }}
                  key="reflecting"
                  transition={{ duration: 0.4 }}
                >
                  {completeSession.isError ? (
                    <div role="alert">
                      <p className="text-2xl font-light md:text-4xl">
                        Something got in the way.
                      </p>
                      <p className="mt-3 text-muted">
                        {completeSession.error.message}
                      </p>
                      <button
                        className="mt-6 min-h-11 rounded-full border-2 border-primary px-6 font-medium text-primary-ink"
                        onClick={runCompletion}
                        type="button"
                      >
                        Try again
                      </button>
                    </div>
                  ) : (
                    <p className="animate-pulse text-3xl font-light md:text-5xl">
                      Reflecting…
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <p
              className="mt-6 min-h-6 text-center text-sm text-muted"
              role={saveFailed ? "alert" : undefined}
            >
              {saveFailed && (
                <>
                  We couldn't save that just now.{" "}
                  <button
                    className="min-h-11 font-medium text-primary-ink underline underline-offset-4"
                    onClick={next}
                    type="button"
                  >
                    Try again
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="absolute right-5 bottom-6 md:right-8 md:bottom-8">
            <CircleButton
              disabled={!selectedOptionId}
              label={
                step === total - 1 ? "See your reflection" : "Next question"
              }
              onClick={next}
              size="md"
            />
          </div>
        </WindowCard>
        <MascotPlaceholder
          className="absolute -bottom-10 -left-2 w-28 sm:w-36 md:-bottom-14 md:-left-8 md:w-48 lg:-bottom-[11%] lg:-left-[11%] lg:w-[17rem]"
          variant="question"
        />
      </div>
    </main>
  );
}
