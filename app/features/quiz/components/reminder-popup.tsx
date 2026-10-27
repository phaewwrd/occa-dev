"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface ReminderPopupProps {
  delay: number;
}

export function ReminderPopup({ delay }: ReminderPopupProps) {
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          animate={{
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 380, damping: 22, delay },
          }}
          aria-label="Reminder"
          className="fixed inset-x-4 top-3 z-50 mx-auto max-w-sm xl:absolute xl:inset-x-auto xl:top-[5%] xl:-right-[34%] xl:mx-0 xl:w-[18rem] xl:max-w-none"
          exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, scale: 0.85 }}
        >
          <div className="overflow-hidden rounded-2xl bg-surface/95 shadow-pop ring-1 ring-black/5 backdrop-blur">
            <div className="px-5 pt-4 pb-5 text-center">
              <p className="text-sm text-ink">Reminder</p>
              <p className="mt-2 text-[1.45rem] font-bold tracking-wide whitespace-nowrap text-primary xl:mt-4">
                YOUR REFLECTION
              </p>
            </div>
            <button
              className="block min-h-11 w-full border-t-2 border-ink/25 bg-select/70 text-sm text-[#2c5bc0] transition-colors hover:bg-select"
              onClick={() => setOpen(false)}
              type="button"
            >
              Okay
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
