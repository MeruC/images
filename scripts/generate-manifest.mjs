import { readdirSync, statSync, writeFileSync } from "fs";
import { join, extname, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "public", "storybg");

const IMAGE_EXTS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

const VERSION_PREFIX_RE = /^(\d+_\d+|s\d+)_/;

function scanItemFolder(folderPath) {
  const files = readdirSync(folderPath, { withFileTypes: true })
    .filter((f) => f.isFile() && IMAGE_EXTS.has(extname(f.name).toLowerCase()))
    .map((f) => f.name)
    .sort();

  const groups = {};
  for (const name of files) {
    const m = name.match(VERSION_PREFIX_RE);
    const key = m ? m[1] : "others";
    (groups[key] ??= []).push(name);
  }

  // Put "others" first, then versions sorted numerically/lexically
  const ordered = {};
  if (groups.others) ordered.others = groups.others;
  for (const key of Object.keys(groups).filter((k) => k !== "others").sort()) {
    ordered[key] = groups[key];
  }
  return ordered;
}

function scanFolder(folderPath) {
  const result = {};
  const entries = readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "smallbg") continue;

    const subPath = join(folderPath, entry.name);
    const files = readdirSync(subPath, { withFileTypes: true })
      .filter((f) => {
        if (!f.isFile()) return false;
        if (!IMAGE_EXTS.has(extname(f.name).toLowerCase())) return false;
        return true;
      })
      .map((f) => f.name)
      .sort();

    if (files.length > 0) {
      result[entry.name] = files;
    }
  }

  return result;
}

const manifest = {
  story_atcg: scanFolder(join(root, "story_atcg")),
  story_bg: scanFolder(join(root, "story_bg")),
  story_item: (() => {
    const p = join(root, "item");
    try { readdirSync(p); } catch { return {}; }
    return scanItemFolder(p);
  })(),
};

const outPath = join(root, "manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2), "utf-8");
console.log(`Written to ${relative(process.cwd(), outPath)}`);
