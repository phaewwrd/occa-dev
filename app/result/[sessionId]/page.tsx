import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LoadingState } from "@/app/features/quiz/components/loading-state";
import { ResultCard } from "@/app/features/quiz/components/result-card";
import { uuidSchema } from "@/app/features/quiz/schemas/quiz.schema";
import { quizService } from "@/app/features/quiz/services/quiz.service";
import { NotFoundError } from "@/app/lib/errors";

interface ResultPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResultContent params={params} />
    </Suspense>
  );
}

async function ResultContent({ params }: ResultPageProps) {
  const { sessionId } = await params;
  if (!uuidSchema.safeParse(sessionId).success) {
    notFound();
  }

  try {
    const result = await quizService.getResult(sessionId);
    return <ResultCard result={result} />;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}
