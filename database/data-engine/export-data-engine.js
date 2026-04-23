import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const targetRoot = path.join(__dirname, 'bundle');

function loadManifest() {
  const manifestPath = path.join(__dirname, 'data-files.json');
  const content = fs.readFileSync(manifestPath, 'utf-8');
  return JSON.parse(content);
}

function collectPaths(obj) {
  const paths = new Set();

  function walk(node) {
    if (!node) return;
    if (typeof node === 'string') {
      paths.add(node);
    } else if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (typeof node === 'object') {
      Object.values(node).forEach(walk);
    }
  }

  walk(obj);
  return Array.from(paths);
}

function copyFile(relPath) {
  const src = path.join(projectRoot, relPath);
  const dest = path.join(targetRoot, relPath);

  if (!fs.existsSync(src)) {
    console.warn(`[export-data-engine] Skipping missing file: ${relPath}`);
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`[export-data-engine] Copied: ${relPath}`);
}

function main() {
  console.log('[export-data-engine] Collecting data engine files...');
  const manifest = loadManifest();
  const paths = collectPaths(manifest);
  console.log(`[export-data-engine] Files listed in manifest: ${paths.length}`);

  paths.forEach(copyFile);

  console.log('\n[export-data-engine] Done.');
  console.log(`[export-data-engine] Bundle directory: ${targetRoot}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
