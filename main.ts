// Entry point: copy entry.png into the harness output directory.
// Node 22 stdlib only. Never deletes the output directory.
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'entry.png');

if (!existsSync(src)) {
  console.error('entry.png not found next to main.ts');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, 'entry.png'));
console.log('entry.png ->', join(outDir, 'entry.png'));
