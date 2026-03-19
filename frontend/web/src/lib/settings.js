import { getDemoProfile } from './demo-data.js';
import {
  defaultPreferences,
  defaultSettings,
  GUEST_SETTINGS_KEY,
  SETTINGS_CACHE_KEY,
  SIGNED_OUT_SETTINGS_KEY,
  supportedLocales,
  supportedThemes
} from './settings-constants.js';

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readJsonStorage(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function writeJsonStorage(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorage(key) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(key);
}

export function resolveTheme(theme) {
  if (theme === 'dark') {
    return 'dark';
  }

  if (theme === 'light') {
    return 'light';
  }

  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function normalizePreferences(input = {}, fallback = defaultPreferences) {
  const source = isObject(input?.preferences) ? input.preferences : input;

  return {
    theme: supportedThemes.includes(source?.theme) ? source.theme : fallback.theme ?? defaultPreferences.theme,
    language: supportedLocales.includes(source?.language) ? source.language : fallback.language ?? defaultPreferences.language,
    showLocation: typeof source?.showLocation === 'boolean' ? source.showLocation : (fallback.showLocation ?? defaultPreferences.showLocation),
    autoplayVideo:
      typeof source?.autoplayVideo === 'boolean' ? source.autoplayVideo : (fallback.autoplayVideo ?? defaultPreferences.autoplayVideo)
  };
}

export function normalizeSettings(input = {}, fallback = defaultSettings) {
  const baseSettings = isObject(fallback) ? fallback : defaultSettings;
  const avatarUrl = input.avatarUrl ?? input.photoURL ?? baseSettings.avatarUrl ?? baseSettings.photoURL ?? defaultSettings.avatarUrl;
  const visitedProvinceCount =
    input.visitedProvinceCount ??
    input.provincesVisited ??
    baseSettings.visitedProvinceCount ??
    baseSettings.provincesVisited ??
    defaultSettings.visitedProvinceCount;
  const verifiedCheckinCount =
    input.verifiedCheckinCount ?? baseSettings.verifiedCheckinCount ?? defaultSettings.verifiedCheckinCount;

  return {
    ...defaultSettings,
    ...baseSettings,
    ...input,
    displayName: input.displayName ?? baseSettings.displayName ?? defaultSettings.displayName,
    username: input.username ?? baseSettings.username ?? defaultSettings.username,
    bio: input.bio ?? baseSettings.bio ?? defaultSettings.bio,
    avatarUrl: avatarUrl ?? '',
    photoURL: avatarUrl ?? '',
    email: input.email ?? baseSettings.email ?? defaultSettings.email,
    homeProvinceId: input.homeProvinceId ?? baseSettings.homeProvinceId ?? defaultSettings.homeProvinceId,
    levelTitle: input.levelTitle ?? baseSettings.levelTitle ?? defaultSettings.levelTitle,
    visitedProvinceCount: Number(visitedProvinceCount) || 0,
    provincesVisited: Number(visitedProvinceCount) || 0,
    verifiedCheckinCount: Number(verifiedCheckinCount) || 0,
    preferences: normalizePreferences(input.preferences ?? input, normalizePreferences(baseSettings.preferences, defaultPreferences))
  };
}

export function mergeSettings(baseSettings, partialSettings = {}) {
  return normalizeSettings(
    {
      ...baseSettings,
      ...partialSettings,
      preferences: {
        ...(baseSettings?.preferences || {}),
        ...(partialSettings?.preferences || {})
      }
    },
    baseSettings
  );
}

export function readSignedOutSettings() {
  return readJsonStorage(SIGNED_OUT_SETTINGS_KEY, {});
}

export function writeSignedOutSettings(settings) {
  writeJsonStorage(SIGNED_OUT_SETTINGS_KEY, settings);
}

export function clearSignedOutSettings() {
  removeStorage(SIGNED_OUT_SETTINGS_KEY);
}

export function readGuestSettings() {
  return readJsonStorage(GUEST_SETTINGS_KEY, {});
}

export function writeGuestSettings(settings) {
  writeJsonStorage(GUEST_SETTINGS_KEY, settings);
}

export function clearGuestSettings() {
  removeStorage(GUEST_SETTINGS_KEY);
}

export function readSettingsCache() {
  return readJsonStorage(SETTINGS_CACHE_KEY, null);
}

export function writeSettingsCache(payload) {
  writeJsonStorage(SETTINGS_CACHE_KEY, payload);
}

export function clearSettingsCache() {
  removeStorage(SETTINGS_CACHE_KEY);
}

export function createSignedOutSettings(localSettings = {}) {
  return normalizeSettings(
    {
      preferences: normalizePreferences(localSettings.preferences ?? localSettings, defaultPreferences)
    },
    defaultSettings
  );
}

export function createGuestSettings(profile, guestLocalSettings = {}) {
  const baseProfile = normalizeSettings(profile || getDemoProfile(), defaultSettings);
  const nextGuestSettings = {};

  if (typeof guestLocalSettings.displayName === 'string') {
    nextGuestSettings.displayName = guestLocalSettings.displayName;
  }

  if (typeof guestLocalSettings.avatarUrl === 'string') {
    nextGuestSettings.avatarUrl = guestLocalSettings.avatarUrl;
    nextGuestSettings.photoURL = guestLocalSettings.avatarUrl;
  }

  if (isObject(guestLocalSettings.preferences)) {
    nextGuestSettings.preferences = normalizePreferences(guestLocalSettings.preferences, baseProfile.preferences);
  }

  return mergeSettings(baseProfile, nextGuestSettings);
}

export function createFirebaseSettings(profile, localAppearance = {}) {
  const baseProfile = normalizeSettings(profile, defaultSettings);

  if (!profile?.preferences) {
    const appearanceSeed = normalizePreferences(localAppearance.preferences ?? localAppearance, baseProfile.preferences);
    return mergeSettings(baseProfile, {
      preferences: {
        ...baseProfile.preferences,
        theme: appearanceSeed.theme,
        language: appearanceSeed.language
      }
    });
  }

  return baseProfile;
}

export function extractSignedOutSettings(settings) {
  const normalized = normalizeSettings(settings, defaultSettings);
  return {
    preferences: {
      theme: normalized.preferences.theme,
      language: normalized.preferences.language
    }
  };
}

export function extractGuestSettings(settings) {
  const normalized = normalizeSettings(settings, defaultSettings);
  return {
    displayName: normalized.displayName,
    avatarUrl: normalized.avatarUrl,
    preferences: {
      theme: normalized.preferences.theme,
      language: normalized.preferences.language,
      showLocation: normalized.preferences.showLocation,
      autoplayVideo: normalized.preferences.autoplayVideo
    }
  };
}

export function extractUserSettingsPayload(settings) {
  const normalized = normalizeSettings(settings, defaultSettings);
  return {
    displayName: normalized.displayName?.trim() || 'Du khách mới',
    username: normalized.username?.trim() || null,
    bio: normalized.bio?.trim() || '',
    avatarUrl: normalized.avatarUrl?.trim() || null,
    photoURL: normalized.avatarUrl?.trim() || null,
    homeProvinceId: normalized.homeProvinceId || null,
    preferences: normalizePreferences(normalized.preferences, defaultPreferences)
  };
}

export function readAppearanceSeed() {
  const signedOutSettings = readSignedOutSettings();
  const cachePayload = readSettingsCache();
  const cachePreferences = cachePayload?.settings?.preferences || cachePayload?.preferences || {};

  return normalizePreferences(
    {
      theme: signedOutSettings?.preferences?.theme ?? cachePreferences.theme,
      language: signedOutSettings?.preferences?.language ?? cachePreferences.language
    },
    defaultPreferences
  );
}

export function applyDocumentPreferences(preferences = defaultPreferences) {
  if (typeof document === 'undefined') {
    return;
  }

  const normalizedPreferences = normalizePreferences(preferences, defaultPreferences);
  const resolvedTheme = resolveTheme(normalizedPreferences.theme);

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.lang = normalizedPreferences.language;
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function createSettingsCachePayload(settings, authMode = 'signed-out') {
  return {
    authMode,
    settings: normalizeSettings(settings, defaultSettings),
    updatedAt: new Date().toISOString()
  };
}
