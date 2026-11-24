// Entry point: copy entry.png into the harness output directory.
// Node 22 stdlib only. Never deletes the output directory.
import { mkdirSync, copyFileSync, existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
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
const dest = join(outDir, 'entry.png');
copyFileSync(src, dest);

// Verify the copy: byte size and sha256 must match the source, otherwise
// the entry the grader sees is not the entry we built.
const srcStat = statSync(src);
const destStat = statSync(dest);
const srcHash = createHash('sha256').update(readFileSync(src)).digest('hex');
const destHash = createHash('sha256').update(readFileSync(dest)).digest('hex');
if (srcStat.size !== destStat.size || srcHash !== destHash) {
  console.error(`copy verification failed: src ${srcStat.size} bytes ${srcHash}, dest ${destStat.size} bytes ${destHash}`);
  process.exit(1);
}
console.log(`entry.png -> ${dest} (${destStat.size} bytes, sha256 ${destHash})`);
