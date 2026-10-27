import type { ReactNode } from "react";

interface WindowCardProps {
  children: ReactNode;
  // Rendered across the very top edge of the card, e.g. a progress bar
  topEdge?: ReactNode;
  // Rendered on the same row as the window dots, aligned right
  toolbar?: ReactNode;
  className?: string;
}

export function WindowCard({
  children,
  topEdge,
  toolbar,
  className = "",
}: WindowCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-surface shadow-card ${className}`}
    >
      {topEdge}
      <div className="flex items-center justify-between gap-4 px-5 pt-5 md:px-8 md:pt-7">
        <div aria-hidden="true" className="flex gap-2 md:gap-3">
          <span className="size-3 rounded-full bg-dot-red blur-[0.5px] md:size-3.5" />
          <span className="size-3 rounded-full bg-dot-yellow blur-[0.5px] md:size-3.5" />
          <span className="size-3 rounded-full bg-dot-green blur-[0.5px] md:size-3.5" />
        </div>
        {toolbar}
      </div>
      {children}
    </div>
  );
}
