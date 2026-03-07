import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformAsync } from '@babel/core';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(currentDir, '..');
const srcDir = path.join(webRoot, 'src');
const distDir = path.join(webRoot, 'dist');
const envFilePath = path.join(webRoot, '.env');
const envExamplePath = path.join(webRoot, '.env.example');

const importMap = {
  imports: {
    react: 'https://esm.sh/react@19',
    'react/jsx-runtime': 'https://esm.sh/react@19/jsx-runtime',
    'react-dom/client': 'https://esm.sh/react-dom@19/client',
    'react-router-dom': 'https://esm.sh/react-router-dom@7.9.3?deps=react@19,react-dom@19',
    'firebase/app': 'https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js',
    'firebase/auth': 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js',
    'firebase/storage': 'https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js'
  }
};

function rewriteImports(code) {
  return code.replace(/((?:from\s+['"])|(?:import\s*\(\s*['"]))([^'"]+)\.jsx(['"]\s*\)?)/g, '$1$2.js$3');
}

function parseEnvFile(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        return accumulator;
      }
      const key = line.slice(0, separatorIndex).trim();
      const rawValue = line.slice(separatorIndex + 1).trim();
      accumulator[key] = rawValue.replace(/^['"]|['"]$/g, '');
      return accumulator;
    }, {});
}

async function loadRuntimeConfig() {
  try {
    const content = await fs.readFile(envFilePath, 'utf8');
    return parseEnvFile(content);
  } catch {
    const content = await fs.readFile(envExamplePath, 'utf8');
    return parseEnvFile(content);
  }
}

async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function getAllFiles(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return getAllFiles(absolutePath);
      }
      return [absolutePath];
    })
  );

  return files.flat();
}

function createIndexHtml(runtimeConfig) {
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#102218" />
    <title>VietWander Web</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Pacifico&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700" rel="stylesheet" />
    <link rel="stylesheet" href="./styles.css" />
    <script>window.__VIETWANDER_CONFIG__ = ${JSON.stringify(runtimeConfig, null, 2)};</script>
    <script type="importmap">${JSON.stringify(importMap, null, 2)}</script>
    <script type="module" src="./main.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

async function transpileModule(sourcePath) {
  const relativePath = path.relative(srcDir, sourcePath);
  const sourceCode = await fs.readFile(sourcePath, 'utf8');
  const transformed = await transformAsync(sourceCode, {
    filename: sourcePath,
    sourceType: 'module',
    presets: [['@babel/preset-react', { runtime: 'automatic' }]],
    babelrc: false,
    configFile: false,
    comments: false,
    compact: false
  });

  const outputRelativePath = relativePath.replace(/\.jsx$/, '.js');
  const outputPath = path.join(distDir, outputRelativePath);
  await ensureDirectory(path.dirname(outputPath));
  await fs.writeFile(outputPath, rewriteImports(transformed?.code || sourceCode), 'utf8');
}

export async function buildSite() {
  const runtimeConfig = await loadRuntimeConfig();
  await fs.rm(distDir, { recursive: true, force: true });
  await ensureDirectory(distDir);

  const files = await getAllFiles(srcDir);

  for (const filePath of files) {
    if (filePath.endsWith('.css')) {
      const cssTargetPath = path.join(distDir, path.basename(filePath));
      await fs.copyFile(filePath, cssTargetPath);
      continue;
    }

    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      await transpileModule(filePath);
    }
  }

  await fs.writeFile(path.join(distDir, 'index.html'), createIndexHtml(runtimeConfig), 'utf8');
  console.log('[vietwander-web] build complete');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildSite().catch((error) => {
    console.error('[vietwander-web] build failed', error);
    process.exitCode = 1;
  });
}
