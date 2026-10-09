"use client";


interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
    return (
        <main className="status-page feedback-page">
            <section className="feedback-state" role="alert">
                <span aria-hidden="true" className="error-icon">
                    ↻
                </span>
                <h1>Something went wrong. Let’s try again.</h1>
                <p>We couldn’t put your reflections together this time.</p>
                <button className="button button-primary" onClick={reset} type="button">
                    Try again
                </button>
            </section>
        </main>
    );
}
