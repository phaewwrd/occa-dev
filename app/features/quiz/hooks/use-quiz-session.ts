"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useSyncExternalStore } from "react";
import { quizKeys } from "../constants/query-keys";

interface QuizSessionState {
  step: number;
  answers: Record<string, string>;
}

const initialState: QuizSessionState = { step: 0, answers: {} };

// Module-level so every mounted route shares it (cacheComponents keeps hidden routes alive).
let state: QuizSessionState = initialState;
const listeners = new Set<() => void>();

function setState(next: QuizSessionState) {
  state = next;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return initialState;
}

export function useQuizSession() {
  const queryClient = useQueryClient();
  const session = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setStep = useCallback((step: number) => {
    setState({ ...state, step });
  }, []);

  const selectAnswer = useCallback((questionId: string, optionId: string) => {
    setState({
      ...state,
      answers: { ...state.answers, [questionId]: optionId },
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setState(initialState);
    queryClient.removeQueries({ queryKey: [...quizKeys.all, "result"] });
    const mutationCache = queryClient.getMutationCache();
    for (const mutation of mutationCache.findAll({
      mutationKey: quizKeys.submit(),
    })) {
      mutationCache.remove(mutation);
    }
  }, [queryClient]);

  return { ...session, setStep, selectAnswer, resetQuiz };
}
