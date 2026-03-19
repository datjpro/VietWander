import { badRequest } from './http-error.js';
import { optionalGeoPoint, parseLimit, requireString } from './validation.js';

const allowedThemes = new Set(['system', 'light', 'dark']);
const allowedLanguages = new Set(['vi', 'en']);
const slugPattern = /^[a-z0-9]+(?:[-._][a-z0-9]+)*$/i;

function ensureObject(value, label = 'body') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw badRequest(`${label} ph?i là object h?p l?.`);
  }

  return value;
}

function assertNoUnknownKeys(input, allowedKeys, label) {
  const unknownKeys = Object.keys(input).filter((key) => !allowedKeys.includes(key));
  if (unknownKeys.length) {
    throw badRequest(`Tru?ng không du?c phép trong ${label}: ${unknownKeys.join(', ')}.`);
  }
}

function optionalStringField(value, fieldName, { maxLength = 500, allowEmpty = false, pattern = null } = {}) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw badRequest(`Tru?ng ${fieldName} ph?i là chu?i.`);
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    if (allowEmpty) {
      return '';
    }
    return null;
  }

  if (trimmedValue.length > maxLength) {
    throw badRequest(`Tru?ng ${fieldName} vu?t quá ${maxLength} ký t?.`);
  }

  if (pattern && !pattern.test(trimmedValue)) {
    throw badRequest(`Tru?ng ${fieldName} có d?nh d?ng không h?p l?.`);
  }

  return trimmedValue;
}

function optionalBooleanField(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'boolean') {
    throw badRequest(`Tru?ng ${fieldName} ph?i là boolean.`);
  }

  return value;
}

function optionalStringArrayField(value, fieldName, { maxItems = 20, itemMaxLength = 80 } = {}) {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw badRequest(`Tru?ng ${fieldName} ph?i là array.`);
  }

  if (value.length > maxItems) {
    throw badRequest(`Tru?ng ${fieldName} vu?t quá ${maxItems} ph?n t?.`);
  }

  return value.map((item, index) => {
    const normalizedItem = optionalStringField(item, `${fieldName}[${index}]`, {
      maxLength: itemMaxLength
    });

    if (normalizedItem == null) {
      throw badRequest(`Tru?ng ${fieldName}[${index}] không du?c d? tr?ng.`);
    }

    return normalizedItem;
  });
}

function optionalEnumField(value, fieldName, allowedValues) {
  if (value === undefined) {
    return undefined;
  }

  if (!allowedValues.has(value)) {
    throw badRequest(`Tru?ng ${fieldName} có giá tr? không h?p l?.`);
  }

  return value;
}

function optionalUrlOrDataUrlField(value, fieldName) {
  const normalizedValue = optionalStringField(value, fieldName, { maxLength: 4000 });
  if (normalizedValue === undefined || normalizedValue === null) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith('data:image/')) {
    return normalizedValue;
  }

  try {
    const parsed = new URL(normalizedValue);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('invalid protocol');
    }
    return normalizedValue;
  } catch {
    throw badRequest(`Tru?ng ${fieldName} ph?i là URL http(s) ho?c data URL h?p l?.`);
  }
}

export function readLimitQuery(value, fallbackValue = 20, maxValue = 100) {
  return parseLimit(value, fallbackValue, maxValue);
}

export function validateUserIdParam(userId) {
  return optionalStringField(userId, 'userId', { maxLength: 128 }) ?? requireString(userId, 'userId');
}

export function validateProvinceIdParam(provinceId) {
  return optionalStringField(provinceId, 'provinceId', { maxLength: 80, pattern: slugPattern }) ?? requireString(provinceId, 'provinceId');
}

export function validateBootstrapDemoPayload(input = {}) {
  const source = input ?? {};
  ensureObject(source, 'body');
  assertNoUnknownKeys(source, ['overwrite'], 'body');

  return {
    overwrite: Boolean(source.overwrite)
  };
}

export function validateUserUpdateInput(input = {}) {
  const source = ensureObject(input, 'body');
  assertNoUnknownKeys(source, ['displayName', 'username', 'bio', 'avatarUrl', 'photoURL', 'homeProvinceId', 'preferences'], 'body');

  const normalized = {};
  const displayName = optionalStringField(source.displayName, 'displayName', { maxLength: 80 });
  const username = optionalStringField(source.username, 'username', { maxLength: 40, pattern: slugPattern });
  const bio = optionalStringField(source.bio, 'bio', { maxLength: 280, allowEmpty: true });
  const avatarUrl = optionalUrlOrDataUrlField(source.avatarUrl ?? source.photoURL, 'avatarUrl');
  const homeProvinceId = optionalStringField(source.homeProvinceId, 'homeProvinceId', { maxLength: 80, pattern: slugPattern });

  if (displayName !== undefined) normalized.displayName = displayName;
  if (username !== undefined) normalized.username = username;
  if (bio !== undefined) normalized.bio = bio ?? '';
  if (avatarUrl !== undefined) {
    normalized.avatarUrl = avatarUrl;
    normalized.photoURL = avatarUrl;
  }
  if (homeProvinceId !== undefined) normalized.homeProvinceId = homeProvinceId;

  if (source.preferences !== undefined) {
    const preferences = ensureObject(source.preferences, 'preferences');
    assertNoUnknownKeys(preferences, ['theme', 'language', 'showLocation', 'autoplayVideo'], 'preferences');

    normalized.preferences = {};
    const theme = optionalEnumField(preferences.theme, 'preferences.theme', allowedThemes);
    const language = optionalEnumField(preferences.language, 'preferences.language', allowedLanguages);
    const showLocation = optionalBooleanField(preferences.showLocation, 'preferences.showLocation');
    const autoplayVideo = optionalBooleanField(preferences.autoplayVideo, 'preferences.autoplayVideo');

    if (theme !== undefined) normalized.preferences.theme = theme;
    if (language !== undefined) normalized.preferences.language = language;
    if (showLocation !== undefined) normalized.preferences.showLocation = showLocation;
    if (autoplayVideo !== undefined) normalized.preferences.autoplayVideo = autoplayVideo;
  }

  return normalized;
}

export function validateCreateCheckinInput(input = {}) {
  const source = ensureObject(input, 'body');
  assertNoUnknownKeys(source, ['provinceId', 'landmarkId', 'landmarkName', 'photoUrl', 'imageUrl', 'caption', 'location'], 'body');

  return {
    provinceId: requireString(source.provinceId, 'provinceId'),
    landmarkId: optionalStringField(source.landmarkId, 'landmarkId', { maxLength: 80, pattern: slugPattern }),
    landmarkName: optionalStringField(source.landmarkName, 'landmarkName', { maxLength: 120 }),
    photoUrl: optionalUrlOrDataUrlField(source.photoUrl ?? source.imageUrl, 'photoUrl') ?? requireString(source.photoUrl ?? source.imageUrl, 'photoUrl'),
    caption: optionalStringField(source.caption, 'caption', { maxLength: 500, allowEmpty: true }) ?? '',
    location: optionalGeoPoint(source.location)
  };
}

export function validateCreatePostInput(input = {}) {
  const source = ensureObject(input, 'body');
  assertNoUnknownKeys(source, ['provinceId', 'landmarkId', 'landmarkName', 'photoUrl', 'imageUrl', 'caption', 'hashtag', 'isPublic'], 'body');

  return {
    provinceId: requireString(source.provinceId, 'provinceId'),
    landmarkId: optionalStringField(source.landmarkId, 'landmarkId', { maxLength: 80, pattern: slugPattern }),
    landmarkName: optionalStringField(source.landmarkName, 'landmarkName', { maxLength: 120 }),
    photoUrl: optionalUrlOrDataUrlField(source.photoUrl ?? source.imageUrl, 'photoUrl') ?? requireString(source.photoUrl ?? source.imageUrl, 'photoUrl'),
    caption: optionalStringField(source.caption, 'caption', { maxLength: 500, allowEmpty: true }) ?? '',
    hashtag: optionalStringField(source.hashtag, 'hashtag', { maxLength: 120 }),
    isPublic: source.isPublic === undefined ? undefined : optionalBooleanField(source.isPublic, 'isPublic')
  };
}

export function validateProvinceUpsertInput(input = {}) {
  const source = ensureObject(input, 'body');
  assertNoUnknownKeys(source, ['name', 'fullName', 'code', 'description', 'imageUrl', 'landmarks', 'popularTags'], 'body');

  const landmarks =
    source.landmarks === undefined
      ? undefined
      : (() => {
          if (!Array.isArray(source.landmarks)) {
            throw badRequest('Tru?ng landmarks ph?i là array.');
          }

          return source.landmarks.map((landmark, index) => {
            const normalizedLandmark = ensureObject(landmark, `landmarks[${index}]`);
            assertNoUnknownKeys(normalizedLandmark, ['id', 'name', 'desc', 'lat', 'lng'], `landmarks[${index}]`);

            const id = optionalStringField(normalizedLandmark.id, `landmarks[${index}].id`, {
              maxLength: 80,
              pattern: slugPattern
            });
            const name = optionalStringField(normalizedLandmark.name, `landmarks[${index}].name`, {
              maxLength: 120
            });
            const desc = optionalStringField(normalizedLandmark.desc, `landmarks[${index}].desc`, {
              maxLength: 500,
              allowEmpty: true
            });

            if (!id || !name) {
              throw badRequest(`landmarks[${index}] c?n có id và name h?p l?.`);
            }

            let lat;
            let lng;

            if (normalizedLandmark.lat !== undefined || normalizedLandmark.lng !== undefined) {
              const point = optionalGeoPoint({
                lat: normalizedLandmark.lat,
                lng: normalizedLandmark.lng
              });
              lat = point?.lat;
              lng = point?.lng;
            }

            return {
              id,
              name,
              desc: desc ?? '',
              ...(lat !== undefined && lng !== undefined ? { lat, lng } : {})
            };
          });
        })();

  return {
    name: optionalStringField(source.name, 'name', { maxLength: 120 }),
    fullName: optionalStringField(source.fullName, 'fullName', { maxLength: 180 }),
    code: optionalStringField(source.code, 'code', { maxLength: 16, pattern: /^[A-Z0-9-]+$/i }),
    description: optionalStringField(source.description, 'description', { maxLength: 1000, allowEmpty: true }) ?? '',
    imageUrl: optionalUrlOrDataUrlField(source.imageUrl, 'imageUrl'),
    landmarks,
    popularTags: optionalStringArrayField(source.popularTags, 'popularTags', {
      maxItems: 20,
      itemMaxLength: 40
    })
  };
}
