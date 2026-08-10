import path from 'node:path';

export const WASH_WIDTH = 96;
export const WASH_HEIGHT = 24;
export const WASH_MAX_BYTES = 4096;

export function artworkWashUrl(imageUrl) {
  const extension = path.posix.extname(imageUrl);
  const stem = path.posix.basename(imageUrl, extension);
  return path.posix.join(path.posix.dirname(imageUrl), 'previews', `${stem}-wash.webp`);
}
