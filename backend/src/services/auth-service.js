import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { getFirebaseAuthAdmin } from '../config/firebase-admin.js';
import { parseCookieHeader } from '../lib/cookies.js';
import { forbidden, unauthorized } from '../lib/http-error.js';

function toBase64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function fromBase64Url(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, 'base64').toString('utf8');
}

function signDemoTokenParts(headerPart, payloadPart) {
  return crypto
    .createHmac('sha256', env.demoAuthSecret)
    .update(`${headerPart}.${payloadPart}`)
    .digest('base64url');
}

function createDemoToken(payload) {
  const headerPart = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadPart = toBase64Url(JSON.stringify(payload));
  const signaturePart = signDemoTokenParts(headerPart, payloadPart);
  return `${headerPart}.${payloadPart}.${signaturePart}`;
}

function verifyDemoToken(token) {
  if (!env.demoAuthSecret) {
    throw forbidden('Demo auth secret chua du?c c?u hình.');
  }

  const [headerPart, payloadPart, signaturePart] = String(token || '').split('.');
  if (!headerPart || !payloadPart || !signaturePart) {
    throw unauthorized('Demo session không h?p l?.');
  }

  const expectedSignature = signDemoTokenParts(headerPart, payloadPart);
  const left = Buffer.from(signaturePart);
  const right = Buffer.from(expectedSignature);

  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) {
    throw unauthorized('Demo session không h?p l?.');
  }

  const payload = JSON.parse(fromBase64Url(payloadPart));

  if (!payload?.exp || payload.exp * 1000 <= Date.now()) {
    throw unauthorized('Demo session dã h?t h?n.');
  }

  return payload;
}

function buildRoles(uid, roles = []) {
  const nextRoles = new Set(roles);
  if (env.adminUids.includes(uid)) {
    nextRoles.add('admin');
  }
  return [...nextRoles];
}

export function buildAuthContext(payload = {}, authType) {
  const uid = payload.uid || payload.sub || '';
  return {
    uid,
    email: payload.email || null,
    roles: buildRoles(uid, payload.roles || []),
    authType
  };
}

export function issueDemoSession(res) {
  if (!env.demoAuthEnabled) {
    throw forbidden('Demo auth dang b? t?t.');
  }

  if (!env.demoAuthSecret) {
    throw forbidden('Demo auth secret chua du?c c?u hình.');
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload = {
    sub: 'demo-traveler',
    uid: 'demo-traveler',
    email: 'demo@vietwander.app',
    roles: ['demo-manager'],
    authType: 'demo',
    iat: nowSeconds,
    exp: Math.floor((Date.now() + env.sessionCookieMaxAgeMs) / 1000)
  };
  const token = createDemoToken(payload);

  res.cookie(env.sessionCookieName, token, {
    httpOnly: true,
    secure: env.sessionCookieSecure,
    sameSite: env.sessionCookieSameSite,
    domain: env.sessionCookieDomain || undefined,
    path: env.sessionCookiePath,
    maxAge: env.sessionCookieMaxAgeMs
  });

  return buildAuthContext(payload, 'demo');
}

export function clearAuthSession(res) {
  res.clearCookie(env.sessionCookieName, {
    httpOnly: true,
    secure: env.sessionCookieSecure,
    sameSite: env.sessionCookieSameSite,
    domain: env.sessionCookieDomain || undefined,
    path: env.sessionCookiePath
  });
}

async function verifyFirebaseBearerToken(idToken) {
  const firebaseAuth = getFirebaseAuthAdmin();

  if (!firebaseAuth) {
    throw unauthorized('Backend chua s?n sàng xác th?c Firebase token.');
  }

  const decodedToken = await firebaseAuth.verifyIdToken(idToken, true);
  return buildAuthContext(decodedToken, 'firebase');
}

function verifyDemoCookieToken(cookieToken) {
  const payload = verifyDemoToken(cookieToken);
  return buildAuthContext(payload, 'demo');
}

export async function resolveRequestAuth(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim();
    if (!token) {
      throw unauthorized('Bearer token không h?p l?.');
    }
    return verifyFirebaseBearerToken(token);
  }

  const cookies = parseCookieHeader(req.headers.cookie);
  const sessionToken = cookies[env.sessionCookieName];
  if (sessionToken) {
    try {
      return verifyDemoCookieToken(sessionToken);
    } catch {
      return null;
    }
  }

  return null;
}
