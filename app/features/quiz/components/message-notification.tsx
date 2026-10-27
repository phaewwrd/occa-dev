"use client";

import { motion } from "motion/react";

interface MessageNotificationProps {
  delay: number;
  className?: string;
}

export function MessageNotification({
  delay,
  className = "",
}: MessageNotificationProps) {
  return (
    <motion.aside
      animate={{ opacity: 1, x: 0, y: 0 }}
      aria-label="Message"
      className={`overflow-hidden rounded-xl bg-surface shadow-pop ring-1 ring-black/5 ${className}`}
      initial={{ opacity: 0, x: -32, y: 12 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay }}
    >
      <div className="flex items-center gap-2 bg-surface-soft px-3 py-2">
        <span
          aria-hidden="true"
          className="grid size-5 place-items-center rounded-[5px] bg-gradient-to-b from-[#6be26a] to-[#25c43a]"
        >
          <svg
            aria-hidden="true"
            className="size-3.5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3.5c-5 0-9 3.3-9 7.5 0 2.3 1.2 4.3 3.1 5.7L5.5 20l3.9-2c.8.2 1.7.3 2.6.3 5 0 9-3.4 9-7.5S17 3.5 12 3.5Z" />
          </svg>
        </span>
        <span className="text-xs tracking-wide text-muted uppercase">
          Messages
        </span>
        <span className="ml-auto text-xs text-muted">now</span>
      </div>
      <p className="px-4 py-3 text-sm leading-relaxed text-ink">
        Noticing is a small first step. This is one possible reflection, not a
        label or diagnosis.
      </p>
    </motion.aside>
  );
}
