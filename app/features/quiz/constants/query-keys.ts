export const quizKeys = {
  all: ["quiz"] as const,
  startSession: () => [...quizKeys.all, "start-session"] as const,
  saveAnswer: () => [...quizKeys.all, "save-answer"] as const,
  completeSession: () => [...quizKeys.all, "complete-session"] as const,
  result: (id: string) => [...quizKeys.all, "result", id] as const,
};
