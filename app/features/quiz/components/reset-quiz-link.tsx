"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useQuizSession } from "../hooks/use-quiz-session";

interface ResetQuizLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function ResetQuizLink({
  href,
  className,
  children,
}: ResetQuizLinkProps) {
  const { resetQuiz } = useQuizSession();
  return (
    <Link className={className} href={href} onClick={resetQuiz}>
      {children}
    </Link>
  );
}
