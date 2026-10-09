interface ProgressBarProps {
  current: number;
  filled: number;
  total: number;
}

export function ProgressBar({ current, filled, total }: ProgressBarProps) {
  const segments = Array.from(
    { length: total },
    (_, index) => `progress-segment-${index + 1}`,
  );
  return (
    <div
      aria-label={`Question ${current} of ${total}`}
      aria-valuemax={total}
      aria-valuemin={0}
      aria-valuenow={filled}
      aria-valuetext={`Question ${current} of ${total}, ${filled} answered`}
      className="progress-track"
      role="progressbar"
    >
      {segments.map((segment, index) => (
        <span
          className={`progress-segment${index < filled ? " is-filled" : ""}`}
          key={segment}
        />
      ))}
    </div>
  );
}
