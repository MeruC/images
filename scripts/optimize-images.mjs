import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const ROOT = process.cwd();
const STORYBG = process.env.STORYBG_DIR || path.join(ROOT, 'public', 'storybg');
const OUTPUT_BASE = path.join(STORYBG, 'smallbg');
const MANIFEST = path.join(STORYBG, '.optimize_manifest.json'); // dot-file: never uploaded
const IMAGE_EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png']);
const CONCURRENCY = 4;
const FORCE = process.argv.includes('--force'); // ignore the manifest and rebuild every thumbnail

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

async function loadManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

async function saveManifest(manifest) {
  const tmp = MANIFEST + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(manifest));
  await fs.rename(tmp, MANIFEST);
}

// A thumbnail is rebuilt only when its source image changed (size or mtime differs from what the manifest recorded for the last build).
// A thumbnail with no manifest entry yet (first run) counts as current when it exists and is not older than its source, and is then recorded.
async function optimizeFile(job, manifest) {
  const { inputPath, outputPath, key } = job;
  const inStat = await fs.stat(inputPath);
  const entry = manifest[key];
  let outStat = null;
  try { outStat = await fs.stat(outputPath); } catch {}

  if (!FORCE && outStat) {
    if (entry) {
      if (entry.size === inStat.size && entry.mtimeMs === inStat.mtimeMs) return 'skipped';
    } else if (outStat.mtimeMs >= inStat.mtimeMs) {
      manifest[key] = { size: inStat.size, mtimeMs: inStat.mtimeMs };
      return 'skipped';
    }
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const meta = await sharp(inputPath).metadata();
  const scale = 800 / 1920; // fixed ratio matching full-size storybg width
  const targetW = Math.max(1, Math.round((meta.width ?? 1920) * scale));
  const targetH = Math.max(1, Math.round((meta.height ?? 1080) * scale));
  await sharp(inputPath)
    .resize({ width: targetW, height: targetH, fit: 'fill' })
    .webp({ quality: 75 })
    .toFile(outputPath);

  manifest[key] = { size: inStat.size, mtimeMs: inStat.mtimeMs };
  const newStat = await fs.stat(outputPath);
  const saved = (((inStat.size - newStat.size) / inStat.size) * 100).toFixed(1);
  console.log(`  ${key} — ${(inStat.size / 1024).toFixed(0)}KB → ${(newStat.size / 1024).toFixed(0)}KB (${saved}% smaller)`);
  return 'optimized';
}

async function main() {
  const jobs = [];
  for (const { source, output } of SOURCE_FOLDERS) {
    const folder = path.join(STORYBG, source);
    for await (const file of walkFiles(folder)) {
      const rel = path.relative(folder, file);
      jobs.push({ inputPath: file, outputPath: path.join(OUTPUT_BASE, output, rel), key: path.join(output, rel).split(path.sep).join('/') });
    }
  }

  const manifest = await loadManifest();
  const counts = { optimized: 0, skipped: 0, errors: 0 };
  console.log(`Optimize: ${jobs.length} source images${FORCE ? ' (--force: rebuilding all)' : ''}`);

  let next = 0, done = 0;
  const report = () => console.log(`  [${done}/${jobs.length}] ${counts.optimized} optimized, ${counts.skipped} up to date, ${counts.errors} errors`);
  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      try {
        counts[await optimizeFile(job, manifest)]++;
      } catch (err) {
        console.error(`  ERROR ${job.key}: ${err.message}`);
        counts.errors++;
      }
      done++;
      if (done % 250 === 0) { report(); await saveManifest(manifest); }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  await saveManifest(manifest);
  report();
  console.log(`Done. ${counts.optimized} optimized, ${counts.skipped} up to date, ${counts.errors} errors.`);
  if (counts.errors) process.exit(1);
}

main();
