import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import {
  artworkWashUrl,
  WASH_HEIGHT,
  WASH_MAX_BYTES,
  WASH_WIDTH,
} from './artwork-washes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_FILE = path.join(ROOT, 'content', 'site.json');
const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf8'));
const works = Array.isArray(content.works) ? content.works : [];
if (works.length === 0) throw new Error('content/site.json: works needs at least one item');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  for (const [index, work] of works.entries()) {
    if (typeof work.image !== 'string' || !work.image.startsWith('/')) {
      throw new Error(`content/site.json: works[${index}].image must be root-relative`);
    }

    const sourceFile = path.join(ROOT, 'public', work.image);
    const extension = path.posix.extname(work.image);
    const previewUrl = artworkWashUrl(work.image);
    const previewFile = path.join(ROOT, 'public', previewUrl);
    const mime = extension === '.jpg' ? 'jpeg' : extension.slice(1);
    const source = `data:image/${mime};base64,${(await fs.readFile(sourceFile)).toString('base64')}`;

    const encoded = await page.evaluate(
      async ({ source, width, height }) => {
        const image = new Image();
        image.src = source;
        await image.decode();

        // First collapse the complete artwork—not a crop—into a small color
        // field. Stretching is intentional because recognizable geometry is
        // discarded while the palette and its broad distribution survive.
        const sample = document.createElement('canvas');
        sample.width = 12;
        sample.height = 3;
        const sampleContext = sample.getContext('2d');
        sampleContext.imageSmoothingEnabled = true;
        sampleContext.imageSmoothingQuality = 'high';
        sampleContext.drawImage(image, 0, 0, sample.width, sample.height);

        const base = document.createElement('canvas');
        base.width = width;
        base.height = height;
        const baseContext = base.getContext('2d');
        baseContext.imageSmoothingEnabled = true;
        baseContext.imageSmoothingQuality = 'high';
        baseContext.drawImage(sample, 0, 0, width, height);

        // Extend edge pixels before blurring so the exported strip has no
        // transparent/dark fringe and needs no runtime filter or overscan.
        const padding = 12;
        const padded = document.createElement('canvas');
        padded.width = width + padding * 2;
        padded.height = height + padding * 2;
        const paddedContext = padded.getContext('2d');
        paddedContext.drawImage(base, padding, padding);
        paddedContext.drawImage(base, 0, 0, 1, height, 0, padding, padding, height);
        paddedContext.drawImage(base, width - 1, 0, 1, height, padding + width, padding, padding, height);
        paddedContext.drawImage(base, 0, 0, width, 1, padding, 0, width, padding);
        paddedContext.drawImage(base, 0, height - 1, width, 1, padding, padding + height, width, padding);
        paddedContext.drawImage(base, 0, 0, 1, 1, 0, 0, padding, padding);
        paddedContext.drawImage(base, width - 1, 0, 1, 1, padding + width, 0, padding, padding);
        paddedContext.drawImage(base, 0, height - 1, 1, 1, 0, padding + height, padding, padding);
        paddedContext.drawImage(base, width - 1, height - 1, 1, 1, padding + width, padding + height, padding, padding);

        const output = document.createElement('canvas');
        output.width = width;
        output.height = height;
        const outputContext = output.getContext('2d');
        outputContext.filter = 'blur(6px) saturate(1.28)';
        outputContext.drawImage(padded, -padding, -padding);
        return output.toDataURL('image/webp', 0.45);
      },
      { source, width: WASH_WIDTH, height: WASH_HEIGHT }
    );

    await fs.mkdir(path.dirname(previewFile), { recursive: true });
    const bytes = Buffer.from(encoded.slice(encoded.indexOf(',') + 1), 'base64');
    if (bytes.length > WASH_MAX_BYTES) {
      throw new Error(`${previewUrl} is ${bytes.length} bytes; expected at most ${WASH_MAX_BYTES}`);
    }
    await fs.writeFile(previewFile, bytes);
    console.log(`${previewUrl} (${bytes.length} bytes)`);
  }
} finally {
  await browser.close();
}
