"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface SelectionFrameProps {
  children: ReactNode;
  className?: string;
}

const EDGE_DURATION = 0.28;

// Each edge grows from where the previous one ended, so the border reads as drawn clockwise.
const edges = [
  { className: "top-0 left-0 h-[2px] w-full dash-x origin-left", axis: "x" },
  { className: "top-0 right-0 h-full w-[2px] dash-y origin-top", axis: "y" },
  {
    className: "right-0 bottom-0 h-[2px] w-full dash-x origin-right",
    axis: "x",
  },
  {
    className: "bottom-0 left-0 h-full w-[2px] dash-y origin-bottom",
    axis: "y",
  },
] as const;

// [left %, top %] for the four corners and four edge midpoints, clockwise from top-left.
const handles = [
  [0, 0],
  [50, 0],
  [100, 0],
  [100, 50],
  [100, 100],
  [50, 100],
  [0, 100],
  [0, 50],
] as const;

const handlesStart = edges.length * EDGE_DURATION;

export function SelectionFrame({
  children,
  className = "",
}: SelectionFrameProps) {
  return (
    <div className={`relative p-3 md:p-4 ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {edges.map((edge, index) => (
          <motion.span
            animate={{
              opacity: 1,
              [edge.axis === "x" ? "scaleX" : "scaleY"]: 1,
            }}
            className={`absolute ${edge.className}`}
            initial={{
              opacity: 0,
              [edge.axis === "x" ? "scaleX" : "scaleY"]: 0,
            }}
            key={edge.className}
            transition={{
              duration: EDGE_DURATION,
              delay: index * EDGE_DURATION,
              ease: "linear",
            }}
          />
        ))}

        <motion.span
          animate={{ opacity: 1, scaleY: 1 }}
          className="absolute bottom-full left-1/2 h-9 w-[2px] origin-bottom -translate-x-1/2 bg-rotate md:h-11"
          initial={{ opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.25, delay: handlesStart }}
        />
        <motion.span
          animate={{ opacity: 1, scaleY: 1 }}
          className="absolute top-full left-1/2 h-9 w-[2px] origin-top -translate-x-1/2 bg-anchor md:h-11"
          initial={{ opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.25, delay: handlesStart }}
        />

        <Handle
          className="bottom-[calc(100%+2.25rem)] left-1/2 rounded-full bg-rotate md:bottom-[calc(100%+2.75rem)]"
          delay={handlesStart + 0.2}
          translate="-translate-x-1/2 translate-y-1/2"
        />
        <Handle
          className="top-[calc(100%+2.25rem)] left-1/2 rounded-[3px] bg-anchor md:top-[calc(100%+2.75rem)]"
          delay={handlesStart + 0.2}
          translate="-translate-x-1/2 -translate-y-1/2"
        />
        {handles.map(([left, top], index) => (
          <Handle
            className="rounded-full bg-handle-blue"
            delay={handlesStart + index * 0.05}
            key={`${left}-${top}`}
            style={{ left: `${left}%`, top: `${top}%` }}
            translate="-translate-x-1/2 -translate-y-1/2"
          />
        ))}
      </div>
      {children}
    </div>
  );
}

interface HandleProps {
  className: string;
  delay: number;
  translate: string;
  style?: { left: string; top: string };
}

function Handle({ className, delay, translate, style }: HandleProps) {
  return (
    <motion.span
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute size-3.5 shadow-[0_1px_3px_rgb(0_0_0/0.25)] ring-2 ring-white md:size-4 ${translate} ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      style={style}
      transition={{ type: "spring", stiffness: 500, damping: 18, delay }}
    />
  );
}
