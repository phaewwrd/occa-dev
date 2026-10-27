"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { HomeIcon, ShareIcon, StartOverIcon } from "@/app/components/icons";
import { LocalTime } from "@/app/components/local-time";
import { MascotPlaceholder } from "@/app/components/mascot-placeholder";
import { TypingText } from "@/app/components/typing-text";
import { useSaveResultImage } from "../hooks/use-save-result-image";
import type { QuizResultView } from "../types/quiz.types";
import { MessageNotification } from "./message-notification";
import { ReminderPopup } from "./reminder-popup";

interface ResultCardProps {
  result: QuizResultView;
}

// Entrance timeline, in seconds
const TITLE_START = 0.6;
const CHAR_SECONDS = 0.028;
const LINE_STAGGER = 0.45;

const toolbarButton =
  "grid size-12 place-items-center rounded-full text-primary transition-colors hover:bg-surface";

function toFileDate(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function ResultCard({ result }: ResultCardProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const lines = result.message.split(/(?<=[.!?])\s+/);
  const messageStart = TITLE_START + result.title.length * CHAR_SECONDS + 0.2;
  const entranceEnd = messageStart + lines.length * LINE_STAGGER + 0.6;
  const { save, status } = useSaveResultImage(
    captureRef,
    `mindfull-reflection-${toFileDate(result.completedAt)}.png`,
    entranceEnd * 1000,
  );

  return (
    <main className="flex flex-1 flex-col items-center px-4 pt-6 pb-12 md:justify-center md:pt-8 md:pb-16">
      <div className="relative w-full max-w-[34rem] lg:max-w-[42rem]">
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          aria-labelledby="result-title"
          className="relative rounded-[1.75rem] bg-surface shadow-card"
          initial={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="overflow-hidden rounded-t-[1.75rem] bg-surface"
            ref={captureRef}
          >
            <div className="border-b border-ink/10 bg-surface-soft py-3 text-center">
              <p className="text-xl font-bold text-primary">Today</p>
              <p className="text-sm font-bold text-primary-ink tabular-nums">
                <LocalTime iso={result.completedAt} />
              </p>
            </div>

            <div className="px-5 pt-6 pb-2 md:px-8">
              <p className="border-b border-ink/15 pb-4 text-lg font-light md:text-xl">
                You noticed something about yourself.
              </p>
              <h1
                className="mt-8 text-center text-2xl leading-snug text-primary md:text-[1.85rem] xl:mt-14"
                id="result-title"
              >
                <TypingText
                  charSeconds={CHAR_SECONDS}
                  delay={TITLE_START}
                  text={result.title}
                />
              </h1>
              <p className="mt-6 rounded-3xl bg-surface-soft px-5 py-5 text-center font-hand text-[1.35rem] leading-relaxed md:mr-[18%] md:text-2xl">
                {lines.map((line, index) => (
                  <motion.span
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    // Sentences are stable for a given message, so index keys are fine here.
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    key={index}
                    transition={{
                      duration: 0.5,
                      delay: messageStart + index * LINE_STAGGER,
                    }}
                  >
                    {line}{" "}
                  </motion.span>
                ))}
              </p>
              <MascotPlaceholder
                className="-mt-4 ml-auto w-36 md:-mt-16 md:w-48 lg:-mt-8 lg:mr-4"
                variant="result"
              />
            </div>
          </div>

          <MessageNotification
            className="mx-3 mb-3 xl:absolute xl:bottom-[11%] xl:-left-[30%] xl:m-0 xl:w-[21rem]"
            delay={1.8}
          />

          <AnimatePresence>
            {(status === "saved" || status === "error") && (
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-[4.5rem] left-4 z-10 rounded-full bg-ink px-3 py-1 text-sm text-white"
                exit={{ opacity: 0, y: 4 }}
                initial={{ opacity: 0, y: 4 }}
              >
                {status === "saved" ? "Saved" : "Couldn't save the image"}
              </motion.p>
            )}
          </AnimatePresence>
          <p aria-live="polite" className="sr-only">
            {status === "saving"
              ? "Saving image"
              : status === "saved"
                ? "Saved"
                : ""}
          </p>

          <nav
            aria-label="Result actions"
            className="flex items-center justify-between rounded-b-[1.75rem] border-t border-ink/10 bg-surface-soft px-3 py-2 md:px-5"
          >
            <button
              aria-label="Save reflection as image"
              className={`${toolbarButton} disabled:opacity-50`}
              disabled={status === "saving"}
              onClick={save}
              type="button"
            >
              <ShareIcon className="size-7" />
            </button>
            <Link aria-label="Home" className={toolbarButton} href="/">
              <HomeIcon className="size-7" />
            </Link>
            <Link aria-label="Start over" className={toolbarButton} href="/">
              <StartOverIcon className="size-7" />
            </Link>
          </nav>
        </motion.article>

        <ReminderPopup delay={1} />
      </div>
    </main>
  );
}
