import { badRequest } from './http-error.js';

export function parseLimit(value, fallbackValue = 20, maxValue = 100) {
  if (value === undefined) {
    return fallbackValue;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw badRequest('`limit` ph?i là s? nguyên duong.');
  }

  return Math.min(parsedValue, maxValue);
}

export function requireString(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw badRequest(`Tru?ng ${fieldName} là b?t bu?c và ph?i là chu?i.`);
  }

  return value.trim();
}

export function optionalString(value) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw badRequest('D? li?u chu?i không h?p l?.');
  }

  return value.trim();
}

export function optionalArray(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw badRequest(`Tru?ng ${fieldName} ph?i là array.`);
  }

  return value;
}

export function optionalGeoPoint(value) {
  if (value === undefined) {
    return undefined;
  }

  if (!value || typeof value !== 'object') {
    throw badRequest('`location` ph?i là object g?m `lat` và `lng`.');
  }

  const lat = Number(value.lat);
  const lng = Number(value.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw badRequest('`location.lat` và `location.lng` ph?i là s? h?p l?.');
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw badRequest('`location` vu?t ngoài ph?m vi t?a d? h?p l?.');
  }

  return { lat, lng };
}
