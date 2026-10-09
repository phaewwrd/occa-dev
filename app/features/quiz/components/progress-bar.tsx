interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const segments = Array.from(
    { length: total },
    (_, index) => `progress-segment-${index + 1}`,
  );
  return (
    <div
      aria-label={`Question ${current} of ${total}`}
      aria-valuemax={total}
      aria-valuemin={1}
      aria-valuenow={current}
      className="progress-track"
      role="progressbar"
    >
      {segments.map((segment, index) => (
        <span
          className={`progress-segment${index < current ? " is-filled" : ""}`}
          key={segment}
        />
      ))}
    </div>
  );
}
