import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, 'logo-source.png');
const outPath = path.join(__dirname, '..', 'public', 'logo.png');

function isBackground(r, g, b, a) {
  if (a < 10) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Cream / off-white studio backdrop
  if (luminance > 200 && saturation < 0.25) return true;
  if (luminance > 185 && saturation < 0.1) return true;

  // Flat black fill (viewer / export artifact) — not metallic gold/silver
  if (luminance < 28 && saturation < 0.15) return true;

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
}

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const pixels = new Uint8Array(data);
floodBackground(pixels, info.width, info.height);

await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 10 })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

console.log(`Transparent logo saved: ${outPath}`);
