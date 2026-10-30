"use client";

import { DynamicIcon } from "lucide-react/dynamic";
import { useState } from "react";
import type { OptionIconData } from "../utils/parse-option-icon";

interface OptionIconProps {
  icon: OptionIconData | null;
}

export function OptionIcon({ icon }: OptionIconProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span
      aria-hidden="true"
      className="relative block size-16 shrink-0 md:size-20"
    >
      <span
        className={`absolute inset-2 rounded-full bg-primary/15 transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      {icon && (
        <DynamicIcon
          className={`absolute inset-0 size-full p-2 transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${icon.color ? "" : "text-ink"}`}
          color={icon.color ?? undefined}
          name={icon.name}
          ref={(node) => {
            if (node) {
              setLoaded(true);
            }
          }}
          strokeWidth={1.5}
        />
      )}
    </span>
  );
}
