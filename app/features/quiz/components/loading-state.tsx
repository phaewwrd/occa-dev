import Image from "next/image";

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
      <header className="quiz-header">
        <a aria-label="Occa home" className="wordmark" href="/">
          <Image
            alt="Mindful"
            height={82}
            priority
            src="/logo.png"
            width={419}
          />
        </a>
        <span className="header-note">Self-reflection</span>
      </header>
      <section aria-live="polite" className="feedback-state">
        <output aria-label="Loading" className="loading-spinner" />
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  );
}
