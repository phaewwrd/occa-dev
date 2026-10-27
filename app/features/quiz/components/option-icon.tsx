"use client";

import Image from "next/image";
import { useState } from "react";
import { cloudinaryUrl } from "@/app/lib/cloudinary";

interface OptionIconProps {
  src: string | null;
}

export function OptionIcon({ src }: OptionIconProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error",
  );

  return (
    <span
      aria-hidden="true"
      className="relative block size-16 shrink-0 md:size-20"
    >
      <span
        className={`absolute inset-2 rounded-full bg-primary/15 transition-opacity duration-300 ${
          status === "loaded" ? "opacity-0" : "opacity-100"
        }`}
      />
      {src && status !== "error" && (
        <Image
          alt=""
          className={`object-contain transition-opacity duration-300 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
          fill
          onError={() => setStatus("error")}
          onLoad={() => setStatus("loaded")}
          sizes="80px"
          src={cloudinaryUrl(src)}
          unoptimized
        />
      )}
    </span>
  );
}
