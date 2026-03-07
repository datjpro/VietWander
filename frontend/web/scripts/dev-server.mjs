import { createServer } from 'node:http';
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = fileURLToPath(new URL('..', import.meta.url));
const args = new Set(process.argv.slice(2));
const rootDir = args.has('--dist') ? join(currentDir, 'dist') : currentDir;
const port = Number(process.env.PORT || (args.has('--dist') ? 4173 : 5173));

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (request, response) => {
  const requestPath = request.url === '/' ? '/index.html' : request.url || '/index.html';
  const safePath = normalize(requestPath).replace(/^([.][.][/\\])+/, '');
  let filePath = join(rootDir, safePath);

  if (!existsSync(filePath) || (existsSync(filePath) && statSync(filePath).isDirectory())) {
    filePath = join(rootDir, 'index.html');
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'text/plain; charset=utf-8',
    });
    response.end(file);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`VietWander web server running at http://localhost:${port}`);
  console.log(`Serving from ${rootDir}`);
});
