export const SETTINGS_CACHE_KEY = 'vietwander.settings-cache';
export const SIGNED_OUT_SETTINGS_KEY = 'vietwander.settings.signed-out';
export const GUEST_SETTINGS_KEY = 'vietwander.settings.guest';

export const supportedThemes = ['system', 'light', 'dark'];
export const supportedLocales = ['vi', 'en'];

export const defaultPreferences = {
  theme: 'system',
  language: 'vi',
  showLocation: true,
  autoplayVideo: false
};

export const defaultSettings = {
  displayName: '',
  username: '',
  bio: '',
  avatarUrl: '',
  photoURL: '',
  email: '',
  homeProvinceId: '',
  levelTitle: '',
  visitedProvinceCount: 0,
  provincesVisited: 0,
  verifiedCheckinCount: 0,
  preferences: { ...defaultPreferences }
};
