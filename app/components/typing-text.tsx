"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  delay?: number;
  charSeconds?: number;
}

export function TypingText({
  text,
  delay = 0,
  charSeconds = 0.028,
}: TypingTextProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Set from an effect (not during render) so server and client markup match on hydration.
    if (reduceMotion) {
      setCount(text.length);
      return;
    }
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((current) => {
          if (current >= text.length) {
            clearInterval(interval);
            return current;
          }
          return current + 1;
        });
      }, charSeconds * 1000);
    }, delay * 1000);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, delay, charSeconds, reduceMotion]);

  return (
    <>
      <span className="sr-only">{text}</span>
      {/* The untyped remainder stays in the layout, invisible, so the heading never reflows */}
      <span aria-hidden="true">
        {text.slice(0, count)}
        <span className="invisible">{text.slice(count)}</span>
      </span>
    </>
  );
}
