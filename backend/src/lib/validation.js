import { badRequest } from './http-error.js';

export function parseLimit(value, fallbackValue = 20, maxValue = 100) {
  if (value === undefined) {
    return fallbackValue;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw badRequest('`limit` phải là số nguyên dương.');
  }

  return Math.min(parsedValue, maxValue);
}

export function requireString(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw badRequest(`Trường ${fieldName} là bắt buộc và phải là chuỗi.`);
  }

  return value.trim();
}

export function optionalString(value) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw badRequest('Dữ liệu chuỗi không hợp lệ.');
  }

  return value.trim();
}

export function optionalArray(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw badRequest(`Trường ${fieldName} phải là array.`);
  }

  return value;
}

export function optionalGeoPoint(value) {
  if (value === undefined) {
    return undefined;
  }

  if (!value || typeof value !== 'object') {
    throw badRequest('`location` phải là object gồm `lat` và `lng`.');
  }

  const lat = Number(value.lat);
  const lng = Number(value.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw badRequest('`location.lat` và `location.lng` phải là số hợp lệ.');
  }

  return { lat, lng };
}
