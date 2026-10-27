"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { renderNodeToPng, shareOrDownload } from "@/app/lib/save-node-as-image";

type SaveStatus = "idle" | "saving" | "saved" | "error";

// Renders the image in the background once the entrance animation settles, so tapping
// Share can open the native share sheet while the browser still counts it as a user gesture.
export function useSaveResultImage(
  nodeRef: RefObject<HTMLElement | null>,
  fileName: string,
  prepareAfterMs: number,
) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const fileRef = useRef<Promise<File> | null>(null);

  const prepare = useCallback(() => {
    const node = nodeRef.current;
    if (!node) {
      return Promise.reject(new Error("Nothing to capture yet."));
    }
    fileRef.current ??= renderNodeToPng(node, fileName).catch((error) => {
      fileRef.current = null;
      throw error;
    });
    return fileRef.current;
  }, [nodeRef, fileName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      prepare().catch(() => undefined);
    }, prepareAfterMs);
    return () => clearTimeout(timer);
  }, [prepare, prepareAfterMs]);

  useEffect(() => {
    if (status !== "saved" && status !== "error") {
      return;
    }
    const timer = setTimeout(() => setStatus("idle"), 2200);
    return () => clearTimeout(timer);
  }, [status]);

  const save = useCallback(async () => {
    setStatus("saving");
    try {
      const outcome = await shareOrDownload(await prepare());
      setStatus(outcome === "cancelled" ? "idle" : "saved");
    } catch {
      setStatus("error");
    }
  }, [prepare]);

  return { save, status };
}
