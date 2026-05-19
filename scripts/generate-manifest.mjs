import { readdirSync, statSync, writeFileSync } from "fs";
import { join, extname, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "public", "storybg");

const IMAGE_EXTS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

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
};

const outPath = join(root, "manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2), "utf-8");
console.log(`Written to ${relative(process.cwd(), outPath)}`);
