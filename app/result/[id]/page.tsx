import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LoadingState } from "@/app/features/quiz/components/loading-state";
import { ResultView } from "@/app/features/quiz/components/result-view";
import { quizService } from "@/app/features/quiz/services/quiz.service";
import { NotFoundError } from "@/app/lib/errors";

interface ResultPageProps {
    params: Promise<{ id: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
    return (
        <Suspense fallback={<LoadingState />}>
            <ResultContent params={params} />
        </Suspense>
    );
}

async function ResultContent({ params }: ResultPageProps) {
    const { id } = await params;
    if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            id,
        )
    ) {
        notFound();
    }

    try {
        const result = await quizService.getResult(id);
        return <ResultView result={result} />;
    } catch (error) {
        if (error instanceof NotFoundError) {
            notFound();
        }
        throw error;
    }
}
