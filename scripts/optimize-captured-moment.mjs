import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'public', 'captured_moment');
const OUTPUT = path.join(SOURCE, 'small');
const IMAGE_EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

async function main() {
  await fs.mkdir(OUTPUT, { recursive: true });

  const entries = await fs.readdir(SOURCE, { withFileTypes: true });
  const files = entries
    .filter(e => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
    .map(e => path.join(SOURCE, e.name));

  let total = 0, errors = 0;
  for (const inputPath of files) {
    const name = path.basename(inputPath, path.extname(inputPath)) + '.webp';
    const outputPath = path.join(OUTPUT, name);
    try {
      const meta = await sharp(inputPath).metadata();
      const maxW = 400;
      const w = Math.min(meta.width ?? maxW, maxW);
      await sharp(inputPath)
        .resize({ width: w })
        .webp({ quality: 75 })
        .toFile(outputPath);

      const [inStat, outStat] = await Promise.all([fs.stat(inputPath), fs.stat(outputPath)]);
      const saved = (((inStat.size - outStat.size) / inStat.size) * 100).toFixed(1);
      console.log(`  ${path.basename(inputPath)} → ${name} — ${(inStat.size/1024).toFixed(0)}KB → ${(outStat.size/1024).toFixed(0)}KB (${saved}% smaller)`);
      total++;
    } catch (err) {
      console.error(`  ERROR ${path.basename(inputPath)}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone. ${total} optimized, ${errors} errors.`);
}

main();
