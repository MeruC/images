import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const ROOT = process.cwd();
const STORYBG = path.join(ROOT, 'public', 'storybg');
const OUTPUT_BASE = path.join(STORYBG, 'smallbg');
const IMAGE_EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

// Maps each source folder to the smallbg output folder name it writes to.
// story_bg writes to "story_bgs" (not "story_bg") because smallbg/story_bg
// already contains unrelated images used elsewhere on the site and must not
// be touched by this script.
const SOURCE_FOLDERS = [
  { source: 'story_atcg', output: 'story_atcg' },
  { source: 'story_bg', output: 'story_bgs' },
];

async function* walkFiles(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFiles(full);
    else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

async function optimizeFile(inputPath, sourceDir, outputName) {
  const rel = path.relative(sourceDir, inputPath);
  const outputPath = path.join(OUTPUT_BASE, outputName, rel);

  try {
    const [inStat, outStat] = await Promise.all([fs.stat(inputPath), fs.stat(outputPath)]);
    if (outStat.mtimeMs >= inStat.mtimeMs) {
      console.log(`  ${rel} — skipped (up to date)`);
      return;
    }
  } catch {}

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
  let total = 0, errors = 0;
  for (const { source, output } of SOURCE_FOLDERS) {
    const folder = path.join(STORYBG, source);
    console.log(`\nProcessing: ${path.relative(ROOT, folder)} -> smallbg/${output}`);
    for await (const file of walkFiles(folder)) {
      try {
        await optimizeFile(file, folder, output);
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
