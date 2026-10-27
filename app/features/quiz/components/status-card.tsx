import type { ReactNode } from "react";

interface StatusCardProps {
  eyebrow: string;
  title: string;
  message: string;
  action?: ReactNode;
  role?: "alert";
}

export function StatusCard({
  eyebrow,
  title,
  message,
  action,
  role,
}: StatusCardProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <section
        className="w-full max-w-md rounded-3xl bg-surface px-6 py-10 text-center shadow-card md:px-10"
        role={role}
      >
        <p className="text-xs font-semibold tracking-[0.14em] text-primary-ink uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl leading-tight font-light md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 leading-relaxed text-muted">{message}</p>
        {action && <div className="mt-8">{action}</div>}
      </section>
    </main>
  );
}
