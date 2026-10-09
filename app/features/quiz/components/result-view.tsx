import Image from "next/image";
import type { QuizResultView } from "../types/quiz.types";
import { ResetQuizLink } from "./reset-quiz-link";

interface ResultViewProps {
    result: QuizResultView;
}

export function ResultView({ result }: ResultViewProps) {
    return (
        <main className="result-page">
            <section className="result-layout">
                <aside
                    className="mascot-panel result-mascot"
                    aria-label="A moment to understand yourself"
                >
                    <p>You noticed something about yourself.</p>
                    <Image
                        alt=""
                        className="mascot-image"
                        height={263}
                        priority
                        src="/Mooca_result.png"
                        width={318}
                    />
                </aside>
                <article aria-labelledby="result-title" className="result-content">
                    <p className="eyebrow">YOUR REFLECTION</p>
                    <h1 id="result-title">{result.title}</h1>
                    <p className="result-message">{result.message}</p>
                    <div className="result-note-panel">
                        <strong>Noticing is a small first step.</strong>
                        <span>
                            This is one possible reflection, not a label or diagnosis.
                        </span>
                    </div>
                    <ResetQuizLink className="button button-primary" href="/">
                        Done
                    </ResetQuizLink>
                </article>
            </section>
        </main>
    );
}
