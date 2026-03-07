import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(rootDir, 'dist');

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const fileName of ['index.html', 'app.js', 'firebase.js', 'styles.css']) {
  await cp(join(rootDir, fileName), join(distDir, fileName));
}

console.log(`Built React web app to ${distDir}`);
