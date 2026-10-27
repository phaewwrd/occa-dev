const UPLOAD_SEGMENT = "/upload/";

// Cloudinary transformation parameters, used to tell "c_fill,w_200" apart from a folder name.
const TRANSFORMATION_PART =
  /^(a|ac|af|ar|b|bo|c|co|cs|d|dl|dn|dpr|du|e|eo|f|fl|fn|fps|g|h|ki|l|o|p|pg|q|r|so|sp|t|u|vc|vs|w|x|y|z)_[^/]+$/;

interface CloudinaryOptions {
  width?: number;
}

function isTransformation(segment: string) {
  return segment.split(",").every((part) => TRANSFORMATION_PART.test(part));
}

export function cloudinaryUrl(
  url: string,
  { width = 160 }: CloudinaryOptions = {},
) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if (parsed.hostname !== "res.cloudinary.com") {
    return url;
  }

  const uploadIndex = parsed.pathname.indexOf(UPLOAD_SEGMENT);
  if (uploadIndex === -1) {
    return url;
  }

  const prefix = parsed.pathname.slice(0, uploadIndex + UPLOAD_SEGMENT.length);
  const rest = parsed.pathname.slice(prefix.length);
  if (isTransformation(rest.split("/")[0] ?? "")) {
    return url;
  }

  parsed.pathname = `${prefix}f_auto,q_auto,w_${width}/${rest}`;
  return parsed.toString();
}
