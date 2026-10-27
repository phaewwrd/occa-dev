"use client";

import { motion } from "motion/react";

interface ProgressBarProps {
  value: number;
  total: number;
}

export function ProgressBar({ value, total }: ProgressBarProps) {
  return (
    <div
      aria-label="Reflection progress"
      aria-valuemax={total}
      aria-valuemin={0}
      aria-valuenow={value}
      className="absolute inset-x-0 top-0 h-1 bg-ink/[0.06]"
      role="progressbar"
    >
      <motion.div
        animate={{ scaleX: total > 0 ? value / total : 0 }}
        className="h-full origin-left rounded-r-full bg-primary"
        initial={false}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
