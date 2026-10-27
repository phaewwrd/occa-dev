import Image from "next/image";
import { type MascotVariant, mascotAssets } from "@/app/lib/assets";

interface MascotProps {
  variant: MascotVariant;
  className?: string;
  priority?: boolean;
}

// Renders the mascot art for a variant, or a labelled dashed box if none is configured.
export function MascotPlaceholder({
  variant,
  className = "",
  priority = false,
}: MascotProps) {
  const asset = mascotAssets[variant];
  if (!asset) {
    return (
      <div
        aria-hidden="true"
        className={`grid aspect-[5/4] place-items-center rounded-3xl border-2 border-dashed border-primary/40 text-xs font-medium tracking-wide text-primary-ink/70 ${className}`}
      >
        Mascot
      </div>
    );
  }

  return (
    <Image
      alt=""
      aria-hidden="true"
      className={`pointer-events-none h-auto select-none ${className}`}
      height={asset.height}
      priority={priority}
      src={asset.src}
      width={asset.width}
    />
  );
}
