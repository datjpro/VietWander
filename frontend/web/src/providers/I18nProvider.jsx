import { createContext, useCallback, useContext, useMemo } from 'react';
import { messages } from '../lib/messages.js';
import { useSettings } from './SettingsProvider.jsx';

const I18nContext = createContext(null);

function readPathValue(source, path) {
  return path.split('.').reduce((currentValue, segment) => currentValue?.[segment], source);
}

function interpolate(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}

export function I18nProvider({ children }) {
  const { settings, updateDraft } = useSettings();
  const locale = settings.preferences.language || 'vi';

  const t = useCallback(
    (key, values) => {
      const localizedValue = readPathValue(messages[locale], key) ?? readPathValue(messages.vi, key) ?? key;
      return typeof localizedValue === 'string' ? interpolate(localizedValue, values) : key;
    },
    [locale]
  );

  const setLocale = useCallback(
    (nextLocale) => {
      updateDraft({
        preferences: {
          language: nextLocale
        }
      });
    },
    [updateDraft]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t
    }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n phải được dùng bên trong I18nProvider.');
  }

  return context;
}
