"use client";

import { motion } from "motion/react";
import type { KeyboardEvent, Ref } from "react";
import type { QuizOption } from "../types/quiz.types";
import { OptionIcon } from "./option-icon";

interface OptionCardProps {
  option: QuizOption;
  selected: boolean;
  locked: boolean;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef: Ref<HTMLButtonElement>;
}

const SWEEP_SECONDS = 0.35;

export function OptionCard({
  option,
  selected,
  locked,
  onSelect,
  onKeyDown,
  buttonRef,
}: OptionCardProps) {
  return (
    <motion.button
      animate={
        selected ? { y: [0, -8, 0], rotate: [0, -2.5, 0] } : { y: 0, rotate: 0 }
      }
      aria-disabled={locked || undefined}
      aria-pressed={selected}
      className="group flex min-h-11 flex-col items-center gap-3 rounded-2xl px-1 py-2 text-center md:gap-5"
      onClick={onSelect}
      onKeyDown={onKeyDown}
      ref={buttonRef}
      transition={{ duration: 0.55, ease: "easeOut" }}
      type="button"
    >
      <span className="transition-[translate] duration-200 group-hover:-translate-y-0.5">
        <OptionIcon icon={option.icon} />
      </span>
      <span className="relative inline-block px-2 py-1 text-[0.92rem] leading-snug text-ink md:text-lg">
        <motion.span
          animate={{ scaleX: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
          aria-hidden="true"
          className="absolute inset-0 origin-left bg-select"
          initial={false}
          transition={{ duration: SWEEP_SECONDS, ease: "easeOut" }}
        />
        {selected && <SelectionHandles />}
        <span className="relative">{option.label}</span>
      </span>
    </motion.button>
  );
}

// Text-selection carets at the highlight's top-left and bottom-right, as in a text editor.
function SelectionHandles() {
  const appear = { duration: 0.2, delay: SWEEP_SECONDS * 0.6 };
  return (
    <span aria-hidden="true">
      <motion.span
        animate={{ opacity: 1, scaleY: 1 }}
        className="absolute top-0 left-0 h-full w-[2px] origin-top bg-handle"
        initial={{ opacity: 0, scaleY: 0 }}
        transition={appear}
      />
      <motion.span
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-0 left-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-handle"
        initial={{ opacity: 0, scale: 0 }}
        transition={{ ...appear, type: "spring", stiffness: 500, damping: 20 }}
      />
      <motion.span
        animate={{ opacity: 1, scaleY: 1 }}
        className="absolute top-0 right-0 h-full w-[2px] origin-bottom bg-handle"
        initial={{ opacity: 0, scaleY: 0 }}
        transition={{ ...appear, delay: SWEEP_SECONDS }}
      />
      <motion.span
        animate={{ opacity: 1, scale: 1 }}
        className="absolute right-0 bottom-0 size-3.5 translate-x-1/2 translate-y-1/2 rounded-full bg-handle"
        initial={{ opacity: 0, scale: 0 }}
        transition={{
          ...appear,
          delay: SWEEP_SECONDS,
          type: "spring",
          stiffness: 500,
          damping: 20,
        }}
      />
    </span>
  );
}
