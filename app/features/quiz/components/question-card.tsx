import type { QuizQuestion } from "../types/quiz.types";

interface QuestionCardProps {
  question: QuizQuestion;
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
  mode: "prompt" | "answers";
}

export function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
  mode,
}: QuestionCardProps) {
  return (
    <fieldset
      aria-label={mode === "answers" ? question.situation : undefined}
      className="question-fieldset"
    >
      {mode === "prompt" && (
        <>
          <legend className="question-prompt">{question.situation}</legend>
          <p className="question-subprompt">What would you most likely do?</p>
          <p className="question-helper" aria-live="polite">
            {selectedOptionId
              ? "One response selected"
              : "Choose one response to continue."}
          </p>
        </>
      )}
      <div className="option-list">
        {mode === "answers" &&
          question.options.map((option) => (
            <label
              className={`option-row${selectedOptionId === option.id ? " is-selected" : ""}`}
              key={option.id}
            >
              <input
                checked={selectedOptionId === option.id}
                className="option-control"
                name={question.id}
                onChange={() => onSelect(option.id)}
                type="radio"
                value={option.id}
              />
              <span className="option-label">{option.label}</span>
            </label>
          ))}
      </div>
    </fieldset>
  );
}
