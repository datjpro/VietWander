import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getUser, upsertUser } from '../lib/api.js';
import {
  applyDocumentPreferences,
  clearGuestSettings,
  clearSettingsCache,
  clearSignedOutSettings,
  createFirebaseSettings,
  createGuestSettings,
  createSettingsCachePayload,
  createSignedOutSettings,
  extractGuestSettings,
  extractSignedOutSettings,
  extractUserSettingsPayload,
  mergeSettings,
  normalizeSettings,
  readGuestSettings,
  readSettingsCache,
  readSignedOutSettings,
  writeGuestSettings,
  writeSettingsCache,
  writeSignedOutSettings
} from '../lib/settings.js';
import { defaultSettings } from '../lib/settings-constants.js';
import { useAuth } from './AuthProvider.jsx';

const SettingsContext = createContext(null);

function settingsEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function readInitialSettings() {
  const cachePayload = readSettingsCache();
  if (cachePayload?.settings) {
    return normalizeSettings(cachePayload.settings, defaultSettings);
  }

  return createSignedOutSettings(readSignedOutSettings());
}

export function SettingsProvider({ children }) {
  const { authMode, profile, ready, user } = useAuth();
  const [persistedSettings, setPersistedSettings] = useState(() => readInitialSettings());
  const [settings, setSettings] = useState(() => readInitialSettings());
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState('info');

  useEffect(() => {
    if (!ready) {
      return;
    }

    const signedOutSettings = readSignedOutSettings();
    const guestSettings = readGuestSettings();
    let nextSettings = createSignedOutSettings(signedOutSettings);

    if (authMode === 'guest') {
      nextSettings = createGuestSettings(profile, guestSettings);
    } else if (authMode === 'firebase' && user) {
      nextSettings = createFirebaseSettings(profile, signedOutSettings);
    }

    setPersistedSettings(nextSettings);
    setSettings(nextSettings);
    applyDocumentPreferences(nextSettings.preferences);
  }, [authMode, profile, ready, user]);

  useEffect(() => {
    applyDocumentPreferences(settings.preferences);
  }, [settings]);

  useEffect(() => {
    writeSettingsCache(createSettingsCachePayload(persistedSettings, authMode));
  }, [authMode, persistedSettings]);

  useEffect(() => {
    if (typeof window === 'undefined' || settings.preferences.theme !== 'system') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyDocumentPreferences(settings.preferences);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [settings.preferences]);

  const updateDraft = useCallback((partialSettings) => {
    setStatusMessage('');
    setSettings((currentSettings) => mergeSettings(currentSettings, partialSettings));
  }, []);

  const saveSettings = useCallback(async () => {
    setSaving(true);
    setStatusMessage('');

    try {
      let nextSettings = normalizeSettings(settings, persistedSettings);

      if (authMode === 'firebase' && user) {
        const payload = extractUserSettingsPayload(nextSettings);
        const savedUser = await upsertUser(user.uid, payload);
        nextSettings = createFirebaseSettings(savedUser, readSignedOutSettings());
      } else if (authMode === 'guest') {
        writeGuestSettings(extractGuestSettings(nextSettings));
        nextSettings = createGuestSettings(profile, readGuestSettings());
      } else {
        writeSignedOutSettings(extractSignedOutSettings(nextSettings));
        nextSettings = createSignedOutSettings(readSignedOutSettings());
      }

      setPersistedSettings(nextSettings);
      setSettings(nextSettings);
      setStatusTone('info');
      setStatusMessage(authMode === 'firebase' ? 'settings.saveSuccessCloud' : 'settings.saveSuccessLocal');
      return nextSettings;
    } catch (error) {
      setStatusTone('error');
      setStatusMessage(error instanceof Error && error.message ? error.message : 'settings.saveError');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [authMode, persistedSettings, profile, settings, user]);

  const resetLocalSettings = useCallback(async () => {
    setStatusMessage('');

    try {
      if (authMode === 'guest') {
        clearGuestSettings();
        const nextSettings = createGuestSettings(profile, {});
        setPersistedSettings(nextSettings);
        setSettings(nextSettings);
      } else if (authMode === 'firebase' && user) {
        clearSignedOutSettings();
        clearSettingsCache();
        let remoteProfile = profile;

        try {
          remoteProfile = await getUser(user.uid);
        } catch {
          remoteProfile = profile;
        }

        const nextSettings = createFirebaseSettings(remoteProfile, {});
        setPersistedSettings(nextSettings);
        setSettings(nextSettings);
      } else {
        clearSignedOutSettings();
        clearSettingsCache();
        const nextSettings = createSignedOutSettings({});
        setPersistedSettings(nextSettings);
        setSettings(nextSettings);
      }

      setStatusTone('info');
      setStatusMessage('settings.resetSuccess');
    } catch (error) {
      setStatusTone('error');
      setStatusMessage(error instanceof Error && error.message ? error.message : 'settings.resetError');
    }
  }, [authMode, profile, user]);

  const contextValue = useMemo(
    () => ({
      settings,
      persistedSettings,
      updateDraft,
      saveSettings,
      resetLocalSettings,
      saving,
      dirty: !settingsEqual(settings, persistedSettings),
      statusMessage,
      statusTone
    }),
    [persistedSettings, resetLocalSettings, saveSettings, saving, settings, statusMessage, statusTone, updateDraft]
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings phải được dùng bên trong SettingsProvider.');
  }

  return context;
}
