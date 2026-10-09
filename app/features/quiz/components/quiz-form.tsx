"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuestions } from "../hooks/use-questions";
import { useQuizSession } from "../hooks/use-quiz-session";
import { useSubmitQuiz } from "../hooks/use-submit-quiz";
import { LoadingState } from "./loading-state";
import { ProgressBar } from "./progress-bar";
import { QuestionCard } from "./question-card";

export function QuizForm() {
  const router = useRouter();
  const questionsQuery = useQuestions();
  const submitQuiz = useSubmitQuiz();
  const { step, answers, setStep, selectAnswer, resetQuiz } = useQuizSession();
  const [validationMessage, setValidationMessage] = useState("");
  const { reset: resetSubmit } = submitQuiz;

  // A fresh mount (or re-activation) of the quiz must never inherit an old run.
  useEffect(() => {
    resetQuiz();
    resetSubmit();
  }, [resetQuiz, resetSubmit]);

  // Stay mounted and keep loading through the redirect to avoid a blank frame.
  if (submitQuiz.isPending || submitQuiz.isSuccess) {
    return <LoadingState />;
  }

  if (questionsQuery.isPending) {
    return (
      <LoadingState
        title="Getting your questions ready…"
        description="A little pause, just for you."
      />
    );
  }

  if (questionsQuery.isError) {
    return (
      <main className="quiz-page">
        <section className="status-panel" role="alert">
          <p className="eyebrow">A SMALL PAUSE</p>
          <h1>Questions aren’t available right now.</h1>
          <p>Please try again in a moment.</p>
          <button
            className="button button-outline"
            onClick={() => questionsQuery.refetch()}
            type="button"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  const questions = questionsQuery.data;
  if (!questions || questions.length !== 4) {
    return (
      <main className="quiz-page">
        <section aria-live="polite" className="status-panel">
          <p className="eyebrow">A SMALL PAUSE</p>
          <h1>This reflection is being prepared.</h1>
          <p>Come back soon to try again.</p>
        </section>
      </main>
    );
  }

  const question = questions[step];
  if (!question) {
    return null;
  }

  function continueQuiz() {
    if (submitQuiz.isPending || submitQuiz.isSuccess) {
      return;
    }
    if (!answers[question.id]) {
      setValidationMessage("Choose the response that feels closest to you.");
      return;
    }
    setValidationMessage("");
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }
    submitQuiz.mutate(
      {
        answers: questions.map((item) => ({
          questionId: item.id,
          optionId: answers[item.id],
        })),
      },
      { onSuccess: ({ resultId }) => router.push(`/result/${resultId}`) },
    );
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <a aria-label="Occa home" className="wordmark" href="/">
          <Image
            alt="Mindful"
            height={82}
            priority
            src="/logo.png"
            width={419}
          />
        </a>
        <span className="header-note">Self-reflection</span>
      </header>
      <section aria-label="Reflection questions" className="quiz-panel">
        <div className="quiz-progress-row" aria-live="polite">
          <span className="step-count">
            {String(step + 1).padStart(2, "0")} /{" "}
            {String(questions.length).padStart(2, "0")}
          </span>
          <span className="header-note">Take your time</span>
        </div>
        <ProgressBar
          current={step + 1}
          filled={step + (answers[question.id] ? 1 : 0)}
          total={questions.length}
        />
        <div className="quiz-content">
          <div className="quiz-question-column">
            <QuestionCard
              question={question}
              selectedOptionId={answers[question.id]}
              mode="prompt"
              onSelect={(optionId) => {
                selectAnswer(question.id, optionId);
                setValidationMessage("");
              }}
            />
            <p
              aria-live="polite"
              className="form-message"
              role={
                validationMessage || submitQuiz.isError ? "alert" : undefined
              }
            >
              {validationMessage ||
                (submitQuiz.isError ? submitQuiz.error.message : " ")}
            </p>
          </div>
          <div className="quiz-answer-column">
            <QuestionCard
              question={question}
              selectedOptionId={answers[question.id]}
              mode="answers"
              onSelect={(optionId) => {
                selectAnswer(question.id, optionId);
                setValidationMessage("");
              }}
            />
            <div className="quiz-actions">
              <button
                className="button button-primary"
                disabled={
                  !answers[question.id] ||
                  submitQuiz.isPending ||
                  submitQuiz.isSuccess
                }
                onClick={continueQuiz}
                type="button"
              >
                {submitQuiz.isPending
                  ? "Putting your reflection together…"
                  : step === questions.length - 1
                    ? "See your reflection"
                    : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <footer className="quiz-footer">
        <span>A little space to get to know you.</span>
        <span>Self-reflection, not a diagnosis</span>
      </footer>
    </main>
  );
}
