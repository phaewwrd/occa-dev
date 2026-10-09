
interface LoadingStateProps {
    title?: string;
    description?: string;
}

export function LoadingState({
    title = "Putting your reflections together…",
    description = "A little pause, just for you.",
}: LoadingStateProps) {
    return (
        <main aria-busy="true" className="status-page feedback-page">
            <section aria-live="polite" className="feedback-state">
                <output aria-label="Loading" className="loading-spinner" />
                <h1>{title}</h1>
                <p>{description}</p>
            </section>
        </main>
    );
}
