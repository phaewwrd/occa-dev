// Every image in /public that the UI renders. Swap or rename files here only.
export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

export type MascotVariant = "intro" | "question" | "result";

// A variant set to null falls back to <MascotPlaceholder />.
export const mascotAssets: Record<MascotVariant, ImageAsset | null> = {
  intro: { src: "/Mooca_result.png", width: 279, height: 217 },
  question: { src: "/Mooca.png", width: 318, height: 263 },
  result: { src: "/Mooca.png", width: 318, height: 263 },
};
