export const quizKeys = {
  all: ["quiz"] as const,
  questions: () => [...quizKeys.all, "questions"] as const,
  submit: () => [...quizKeys.all, "submit"] as const,
  result: (id: string) => [...quizKeys.all, "result", id] as const,
};
