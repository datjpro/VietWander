import { Timestamp } from 'firebase-admin/firestore';

export function toIsoDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
}

export function serializeValue(value) {
  if (value === null || value === undefined) {
    return value ?? null;
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (value instanceof Date || value instanceof Timestamp || typeof value.toDate === 'function') {
    return toIsoDate(value);
  }

  if (typeof value === 'object') {
    if ('latitude' in value && 'longitude' in value) {
      return {
        lat: value.latitude,
        lng: value.longitude,
      };
    }

    return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, serializeValue(nestedValue)]));
  }

  return value;
}

export function withDocumentId(id, data) {
  return serializeValue({ id, ...data });
}
