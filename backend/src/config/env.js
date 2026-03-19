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

function parseCsv(value, fallbackValue = []) {
  if (!value) {
    return fallbackValue;
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
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

function resolveDemoAuthSecret() {
  if (process.env.DEMO_AUTH_SECRET) {
    return process.env.DEMO_AUTH_SECRET;
  }

  return process.env.NODE_ENV === 'production' ? '' : 'vietwander-demo-secret-dev-only';
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
  trustProxy: parseBoolean(process.env.TRUST_PROXY, false),
  allowedOrigins: parseCsv(process.env.ALLOWED_ORIGINS, []),
  adminUids: parseCsv(process.env.ADMIN_UIDS, []),
  demoAuthEnabled: parseBoolean(process.env.DEMO_AUTH_ENABLED, true),
  demoAuthSecret: resolveDemoAuthSecret(),
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? 'vietwander_session',
  sessionCookieDomain: process.env.SESSION_COOKIE_DOMAIN ?? '',
  sessionCookiePath: process.env.SESSION_COOKIE_PATH ?? '/',
  sessionCookieSecure: parseBoolean(process.env.SESSION_COOKIE_SECURE, (process.env.NODE_ENV ?? 'development') === 'production'),
  sessionCookieSameSite: process.env.SESSION_COOKIE_SAME_SITE ?? 'lax',
  sessionCookieMaxAgeMs: parseNumber(process.env.SESSION_COOKIE_MAX_AGE_MS, 1000 * 60 * 60 * 6),
  authRateLimitWindowMs: parseNumber(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 60_000),
  authRateLimitMax: parseNumber(process.env.AUTH_RATE_LIMIT_MAX, 20),
  writeRateLimitWindowMs: parseNumber(process.env.WRITE_RATE_LIMIT_WINDOW_MS, 60_000),
  writeRateLimitMax: parseNumber(process.env.WRITE_RATE_LIMIT_MAX, 120)
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
