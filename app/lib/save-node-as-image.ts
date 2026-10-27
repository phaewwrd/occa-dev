import { toPng } from "html-to-image";

async function waitForImages(node: HTMLElement) {
  await Promise.all(
    Array.from(node.querySelectorAll("img")).map((image) =>
      image.complete
        ? image.decode().catch(() => undefined)
        : new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
    ),
  );
}

export async function renderNodeToPng(node: HTMLElement, fileName: string) {
  await document.fonts.ready;
  await waitForImages(node);

  const options = {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",
  };
  // Safari can drop images and fonts on the first pass, so render once to warm its cache.
  await toPng(node, options);
  const dataUrl = await toPng(node, options);
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], fileName, { type: "image/png" });
}

export async function shareOrDownload(file: File) {
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "My mindfull reflection" });
      return "shared" as const;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled" as const;
      }
      // NotAllowedError and friends: fall through to a plain download.
    }
  }

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded" as const;
}
