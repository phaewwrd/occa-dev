"use client";

import { motion } from "motion/react";
import { ChevronRightIcon } from "./icons";

interface CircleButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "md" | "lg";
  className?: string;
}

export function CircleButton({
  label,
  onClick,
  disabled = false,
  loading = false,
  size = "lg",
  className = "",
}: CircleButtonProps) {
  const inactive = disabled || loading;
  return (
    <motion.button
      aria-busy={loading || undefined}
      aria-label={label}
      className={`grid shrink-0 place-items-center rounded-full border-2 border-primary bg-surface/70 text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
        size === "lg" ? "size-14 md:size-16" : "size-12 md:size-14"
      } ${loading ? "disabled:opacity-100" : ""} ${className}`}
      disabled={inactive}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      type="button"
      whileHover={inactive ? undefined : { scale: 1.06 }}
      whileTap={inactive ? undefined : { scale: 0.94 }}
    >
      {loading ? (
        <span className="size-6 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
      ) : (
        <ChevronRightIcon className="size-7 md:size-8" />
      )}
    </motion.button>
  );
}
