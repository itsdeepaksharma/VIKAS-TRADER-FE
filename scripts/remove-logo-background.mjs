import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, 'logo-source.png');
const outPath = path.join(__dirname, '..', 'public', 'logo.png');
const out2xPath = path.join(__dirname, '..', 'public', 'logo@2x.png');

function isBackground(r, g, b, a) {
  if (a < 10) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // White / cream / pale app-page backdrops
  if (luminance > 200 && saturation < 0.28) return true;
  if (luminance > 175 && saturation < 0.12) return true;

  // Flat black studio backdrop
  if (luminance < 35 && saturation < 0.18) return true;

  return false;
}

function floodBackground(pixels, width, height) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  function pushIfBg(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = (y * width + x) * 4;
    const pi = y * width + x;
    if (visited[pi]) return;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];
    const a = pixels[idx + 3];
    if (!isBackground(r, g, b, a)) return;
    visited[pi] = 1;
    queue.push(pi);
  }

  for (let x = 0; x < width; x++) {
    pushIfBg(x, 0);
    pushIfBg(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfBg(0, y);
    pushIfBg(width - 1, y);
  }

  while (queue.length) {
    const pi = queue.pop();
    const y = Math.floor(pi / width);
    const x = pi % width;
    pixels[pi * 4 + 3] = 0;
    pushIfBg(x - 1, y);
    pushIfBg(x + 1, y);
    pushIfBg(x, y - 1);
    pushIfBg(x, y + 1);
  }

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    if (max < 52 && saturation < 0.22) {
      pixels[i + 3] = 0;
    }
  }
}

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = new Uint8Array(data);
floodBackground(pixels, info.width, info.height);

const trimmed = sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
}).trim({ threshold: 12 });

const master = await trimmed
  .clone()
  .png({ compressionLevel: 6, quality: 100 })
  .toBuffer();

const meta = await sharp(master).metadata();
const masterWidth = meta.width ?? 512;

// Retina master — full trimmed resolution from source (never upscale beyond source).
await sharp(master).png({ compressionLevel: 6 }).toFile(out2xPath);

// Standard — high-quality downscale for 1x displays.
const standardWidth = Math.max(320, Math.round(masterWidth / 2));
await sharp(master)
  .resize(standardWidth, null, { kernel: sharp.kernel.lanczos3, withoutEnlargement: true })
  .png({ compressionLevel: 6 })
  .toFile(outPath);

console.log(`Logo 1x saved (${standardWidth}px wide): ${outPath}`);
console.log(`Logo 2x saved (${masterWidth}px wide): ${out2xPath}`);
