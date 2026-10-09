export const MIN_LOADING_MS = 2000;

export async function withMinDelay<T>(
  promise: Promise<T>,
  ms: number = MIN_LOADING_MS,
): Promise<T> {
  const [value] = await Promise.all([
    promise,
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ]);
  return value;
}
