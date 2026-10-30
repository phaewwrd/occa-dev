import type { IconName } from "lucide-react/dynamic";
// Not `iconNames` from "lucide-react/dynamic": that module is client-only and this runs on the server.
import dynamicIconImports from "lucide-react/dynamicIconImports";

export interface OptionIconData {
  name: IconName;
  color: string | null;
}

// "ArrowUp01" and "arrow-up-0-1" both normalise to "arrowup01".
const normalise = (name: string) => name.replace(/-/g, "").toLowerCase();

const iconsByNormalisedName = new Map(
  (Object.keys(dynamicIconImports) as IconName[]).map((name) => [
    normalise(name),
    name,
  ]),
);

// Reads a stored icon such as `<Mail color="#02271f" />`, `Mail` or `mail`.
export function parseOptionIcon(
  value: string | null | undefined,
): OptionIconData | null {
  const match = value?.trim().match(/^<?\s*([A-Za-z][\w-]*)([^>]*?)\/?>?$/);
  if (!match) {
    return null;
  }

  const name = iconsByNormalisedName.get(normalise(match[1]));
  if (!name) {
    return null;
  }

  const color = match[2].match(/\bcolor\s*=\s*["']([^"']+)["']/)?.[1] ?? null;
  return { name, color };
}
