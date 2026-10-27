"use client";

import { useSyncExternalStore } from "react";

interface LocalTimeProps {
  iso: string;
}

const subscribe = () => () => {};

// Formats in the viewer's timezone; renders a fixed-width blank on the server to avoid a hydration mismatch.
export function LocalTime({ iso }: LocalTimeProps) {
  const formatted = useSyncExternalStore(
    subscribe,
    () =>
      new Date(iso).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }),
    () => null,
  );
  return (
    <time className="inline-block min-w-[4.5rem]" dateTime={iso}>
      {formatted ?? " "}
    </time>
  );
}
