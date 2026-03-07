import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(rootDir, 'dist');

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const fileName of ['index.html', 'styles.css', 'app.js']) {
  await cp(join(rootDir, fileName), join(distDir, fileName));
}

console.log(`Built web app to ${distDir}`);
