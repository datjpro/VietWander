import http from 'node:http';
import { promises as fs, watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from './build.mjs';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(currentDir, '..');
const distDir = path.join(webRoot, 'dist');
const srcDir = path.join(webRoot, 'src');
const shouldWatch = !process.argv.includes('--dist');
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

async function serveFile(response, requestedPath) {
  try {
    const absolutePath = path.join(distDir, requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\//, ''));
    const normalizedPath = path.normalize(absolutePath);
    const finalPath = normalizedPath.startsWith(distDir) ? normalizedPath : path.join(distDir, 'index.html');
    const filePath = await fs
      .stat(finalPath)
      .then((stats) => (stats.isDirectory() ? path.join(finalPath, 'index.html') : finalPath))
      .catch(() => path.join(distDir, 'index.html'));

    const extension = path.extname(filePath).toLowerCase();
    const content = await fs.readFile(filePath);

    response.writeHead(200, {
      'Content-Type': contentTypes[extension] || 'application/octet-stream'
    });
    response.end(content);
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(`Server error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

let rebuildTimer = null;

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    buildSite().catch((error) => console.error('[vietwander-web] rebuild failed', error));
  }, 120);
}

await buildSite();

if (shouldWatch) {
  watch(srcDir, { recursive: true }, scheduleRebuild);
}

const server = http.createServer((request, response) => {
  serveFile(response, request.url || '/');
});

server.listen(port, () => {
  console.log(`[vietwander-web] serving http://localhost:${port}`);
  console.log(`[vietwander-web] mode: ${shouldWatch ? 'watch' : 'dist'}`);
});
