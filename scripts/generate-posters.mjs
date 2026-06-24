import { readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postersDir = join(__dirname, "..", "public", "posters");
const outPath = join(__dirname, "..", "posters.ts");

const LANGS = ["CN", "EN", "JP", "KR", "TW"];

function parseVersionFiles(files) {
  const result = {};

  for (const lang of LANGS) {
    const re = new RegExp(`^${lang}(\\d*)\\.(jpg|jpeg|png|gif|mp4)$`, "i");
    const matching = files.filter((f) => re.test(f));

    const images = matching
      .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
      .sort();
    const gif = matching.find((f) => /\.gif$/i.test(f));
    const mp4 = matching.find((f) => /\.mp4$/i.test(f));

    if (images.length === 1) result[lang] = JSON.stringify(images[0]);
    else if (images.length > 1) result[lang] = JSON.stringify(images);
    if (gif) result[`${lang}_gif`] = JSON.stringify(gif);
    if (mp4) result[`${lang}_mp4`] = JSON.stringify(mp4);
  }

  return result;
}

function formatEntry(version, files) {
  const filesFields = Object.entries(files)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
  const filesObj = filesFields ? `{ ${filesFields} }` : "{}";
  return `  { version: ${JSON.stringify(version)}, files: ${filesObj}, starring: [] }`;
}

const versionDirs = readdirSync(postersDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort((a, b) => {
    const toNum = (s) => s.split(".").map(Number);
    const [aMaj, aMin] = toNum(a);
    const [bMaj, bMin] = toNum(b);
    return aMaj !== bMaj ? aMaj - bMaj : aMin - bMin;
  });

const lines = [];

lines.push(`export interface PosterFiles {`);
for (const lang of LANGS) {
  lines.push(`  ${lang}?: string | string[];`);
  lines.push(`  ${lang}_gif?: string;`);
  lines.push(`  ${lang}_mp4?: string;`);
}
lines.push(`}`);
lines.push(``);
lines.push(`export interface PosterEntry {`);
lines.push(`  version: string;`);
lines.push(`  files: PosterFiles;`);
lines.push(`  starring: string[];`);
lines.push(`}`);
lines.push(``);
lines.push(`export const posters: PosterEntry[] = [`);

let prevMajor = null;

for (const ver of versionDirs) {
  const major = ver.split(".")[0];
  if (prevMajor !== null && major !== prevMajor) lines.push(``);
  prevMajor = major;

  const allFiles = readdirSync(join(postersDir, ver), { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .sort();

  lines.push(`  //${ver}`);

  if (allFiles.length === 0) {
    lines.push(`  // (no files yet)`);
  } else {
    const parsed = parseVersionFiles(allFiles);
    lines.push(formatEntry(ver, parsed) + ",");
  }
}

lines.push(`];`);
lines.push(``);

const output = lines.join("\n");
writeFileSync(outPath, output, "utf-8");
console.log(`Written to posters.ts`);
