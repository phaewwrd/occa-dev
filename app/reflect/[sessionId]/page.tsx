import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { LoadingState } from "@/app/features/quiz/components/loading-state";
import { ReflectionFlow } from "@/app/features/quiz/components/reflection-flow";
import { StatusCard } from "@/app/features/quiz/components/status-card";
import { uuidSchema } from "@/app/features/quiz/schemas/quiz.schema";
import { quizService } from "@/app/features/quiz/services/quiz.service";
import { NotFoundError } from "@/app/lib/errors";

interface ReflectPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function ReflectPage({ params }: ReflectPageProps) {
  return (
    <Suspense fallback={<LoadingState title="Getting your questions ready…" />}>
      <ReflectContent params={params} />
    </Suspense>
  );
}

async function ReflectContent({ params }: ReflectPageProps) {
  const { sessionId } = await params;
  if (!uuidSchema.safeParse(sessionId).success) {
    notFound();
  }

  let reflection: Awaited<ReturnType<typeof quizService.getReflection>>;
  try {
    reflection = await quizService.getReflection(sessionId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  if (reflection.completed) {
    redirect(`/result/${sessionId}`);
  }

  if (reflection.questions.length === 0) {
    return (
      <StatusCard
        eyebrow="A small pause"
        message="Come back soon to try again."
        title="This reflection is being prepared."
      />
    );
  }

  return (
    <ReflectionFlow
      initialAnswers={reflection.answers}
      key={sessionId}
      questions={reflection.questions}
      sessionId={sessionId}
    />
  );
}
