import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const ROOT = process.cwd();
const STORYBG = path.join(ROOT, 'public', 'storybg');
const OUTPUT_BASE = path.join(STORYBG, 'smallbg');
const IMAGE_EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

const SOURCE_FOLDERS = ['story_atcg', 'story_bg'];

async function* walkFiles(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFiles(full);
    else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

async function optimizeFile(inputPath) {
  const rel = path.relative(STORYBG, inputPath);
  const outputPath = path.join(OUTPUT_BASE, rel);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const meta = await sharp(inputPath).metadata();
  const scale = 800 / 1920; // fixed ratio matching full-size storybg width
  const targetW = Math.max(1, Math.round((meta.width ?? 1920) * scale));
  const targetH = Math.max(1, Math.round((meta.height ?? 1080) * scale));
  await sharp(inputPath)
    .resize({ width: targetW, height: targetH, fit: 'fill' })
    .webp({ quality: 75 })
    .toFile(outputPath);

  const [inStat, outStat] = await Promise.all([fs.stat(inputPath), fs.stat(outputPath)]);
  const saved = (((inStat.size - outStat.size) / inStat.size) * 100).toFixed(1);
  console.log(`  ${rel} — ${(inStat.size / 1024).toFixed(0)}KB → ${(outStat.size / 1024).toFixed(0)}KB (${saved}% smaller)`);
}

async function main() {
  const folders = SOURCE_FOLDERS.map(f => path.join(STORYBG, f));

  let total = 0, errors = 0;
  for (const folder of folders) {
    console.log(`\nProcessing: ${path.relative(ROOT, folder)}`);
    for await (const file of walkFiles(folder)) {
      try {
        await optimizeFile(file);
        total++;
      } catch (err) {
        console.error(`  ERROR ${path.relative(STORYBG, file)}: ${err.message}`);
        errors++;
      }
    }
  }

  console.log(`\nDone. ${total} optimized, ${errors} errors.`);
}

main();
