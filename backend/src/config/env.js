import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const currentDir = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(currentDir, '../../.env') });
dotenv.config();

function parseNumber(value, fallbackValue) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

function parseBoolean(value, fallbackValue) {
  if (value === undefined) {
    return fallbackValue;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function readFirebaseConfigProjectId() {
  if (!process.env.FIREBASE_CONFIG) {
    return '';
  }

  try {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    return firebaseConfig.projectId || '';
  } catch {
    return '';
  }
}

function resolveFirebaseProjectId() {
  return (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    readFirebaseConfigProjectId() ||
    ''
  );
}

export function isManagedFirebaseRuntime() {
  return Boolean(
    process.env.FUNCTION_TARGET ||
      process.env.K_SERVICE ||
      process.env.FIREBASE_CONFIG ||
      process.env.GCLOUD_PROJECT ||
      process.env.GOOGLE_CLOUD_PROJECT
  );
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseNumber(process.env.PORT, 4000),
  firebaseProjectId: resolveFirebaseProjectId(),
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
  useMemoryDatabase: parseBoolean(process.env.USE_MEMORY_DB, false),
};

export function hasFirebaseAdminConfig() {
  if (!env.firebaseProjectId) {
    return false;
  }

  return Boolean(
    (env.firebaseClientEmail && env.firebasePrivateKey) ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      isManagedFirebaseRuntime()
  );
}
