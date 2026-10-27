"use client";

import { type KeyboardEvent, useEffect, useRef } from "react";
import type { QuizQuestion } from "../types/quiz.types";
import { OptionCard } from "./option-card";

interface QuestionPanelProps {
  question: QuizQuestion;
  selectedOptionId: string | undefined;
  locked: boolean;
  focusOnMount: boolean;
  onSelect: (optionId: string) => void;
}

const ARROW_STEPS: Partial<Record<string, number>> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

export function QuestionPanel({
  question,
  selectedOptionId,
  locked,
  focusOnMount,
  onSelect,
}: QuestionPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (focusOnMount) {
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [focusOnMount]);

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = ARROW_STEPS[event.key];
    if (!step) {
      return;
    }
    event.preventDefault();
    const count = question.options.length;
    optionRefs.current[(index + step + count) % count]?.focus();
  }

  return (
    <div>
      <h1
        className="mx-auto max-w-3xl text-center text-[1.6rem] leading-[1.35] font-light text-ink outline-none sm:text-3xl md:text-[2.6rem] lg:text-5xl lg:leading-[1.4]"
        ref={headingRef}
        tabIndex={-1}
      >
        {question.situation}
      </h1>
      <fieldset className="mt-10 border-0 p-0 md:mt-16 lg:mt-20">
        <legend className="sr-only">Choose the response closest to you</legend>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-x-6">
          {question.options.map((option, index) => (
            <OptionCard
              buttonRef={(node) => {
                optionRefs.current[index] = node;
              }}
              key={option.id}
              locked={locked}
              onKeyDown={(event) => moveFocus(event, index)}
              onSelect={() => onSelect(option.id)}
              option={option}
              selected={selectedOptionId === option.id}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
