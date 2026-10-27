interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = "Putting your reflection together…",
  description = "A little pause, just for you.",
}: LoadingStateProps) {
  return (
    <main
      aria-busy="true"
      className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center"
    >
      <output
        aria-label="Loading"
        className="size-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
      />
      <h1 aria-live="polite" className="mt-8 text-2xl font-light md:text-3xl">
        {title}
      </h1>
      <p className="mt-2 font-hand text-xl text-muted">{description}</p>
    </main>
  );
}
