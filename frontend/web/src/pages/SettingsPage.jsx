import { useMemo } from 'react';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { getProvinces } from '../lib/api.js';
import { demoProvinces } from '../lib/demo-data.js';
import { useI18n } from '../providers/I18nProvider.jsx';
import { useSettings } from '../providers/SettingsProvider.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

function SegmentedOptions({ options, onChange, value }) {
  return (
    <div className="settings-option-grid" role="radiogroup">
      {options.map((option) => (
        <button
          aria-checked={value === option.value}
          className={`settings-option${value === option.value ? ' is-active' : ''}`}
          key={option.value}
          onClick={() => onChange(option.value)}
          role="radio"
          type="button"
        >
          <strong>{option.label}</strong>
          {option.description ? <span>{option.description}</span> : null}
        </button>
      ))}
    </div>
  );
}

function ToggleCard({ checked, description, disabled, label, onChange, t }) {
  return (
    <button
      aria-pressed={checked}
      className={`settings-toggle-card${checked ? ' is-active' : ''}${disabled ? ' is-disabled' : ''}`}
      disabled={disabled}
      onClick={onChange}
      type="button"
    >
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>
      <span className="settings-toggle-pill">{checked ? t('common.yes') : t('common.no')}</span>
    </button>
  );
}

export function SettingsPage() {
  const { authMode, isGuest } = useAuth();
  const { settings, updateDraft, saveSettings, resetLocalSettings, saving, dirty, statusMessage, statusTone } = useSettings();
  const { locale, setLocale, t } = useI18n();
  const { data: provinces } = useAsyncData(
    async () => {
      try {
        return await getProvinces();
      } catch {
        return demoProvinces;
      }
    },
    [],
    demoProvinces
  );

  useDocumentTitle(t('seo.settings'));

  const canEditProfile = authMode === 'firebase' || isGuest;
  const canEditAdvancedProfile = authMode === 'firebase';
  const canEditExperience = authMode !== 'signed-out';
  const statusKey = authMode === 'firebase' ? 'settings.cloudStatus' : isGuest ? 'settings.guestStatus' : 'settings.localStatus';
  const descriptionKey =
    authMode === 'firebase' ? 'settings.descriptionLoggedIn' : isGuest ? 'settings.descriptionGuest' : 'settings.descriptionSignedOut';
  const saveHintKey = authMode === 'firebase' ? 'settings.saveHintCloud' : 'settings.saveHintLocal';
  const themeOptions = useMemo(
    () => [
      { value: 'system', label: t('settings.themeSystem') },
      { value: 'light', label: t('settings.themeLight') },
      { value: 'dark', label: t('settings.themeDark') }
    ],
    [t]
  );
  const languageOptions = useMemo(
    () => [
      { value: 'vi', label: t('settings.languageVi') },
      { value: 'en', label: t('settings.languageEn') }
    ],
    [t]
  );

  async function handleSave() {
    try {
      await saveSettings();
    } catch {
      return;
    }
  }

  return (
    <div className="page-section-stack">
      <section className="page-card">
        <div className="section-heading-row wrap-row">
          <div>
            <p className="eyebrow">{t('settings.eyebrow')}</p>
            <h1>{t('settings.title')}</h1>
            <p className="muted-copy">{t(descriptionKey)}</p>
          </div>
          <div className="filter-bar settings-toolbar">
            <span className="status-chip">{t(statusKey)}</span>
            <button className="button ghost-button" onClick={resetLocalSettings} type="button">
              {t('common.resetLocal')}
            </button>
            <button className="button primary-button" disabled={saving || !dirty} onClick={handleSave} type="button">
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </div>

        <p className="muted-copy settings-toolbar-note">{t(saveHintKey)}</p>
        {statusMessage ? (
          <div className={`banner ${statusTone === 'error' ? 'warning-banner' : 'info-banner'}`}>
            {statusMessage.startsWith('settings.') || statusMessage.startsWith('common.') ? t(statusMessage) : statusMessage}
          </div>
        ) : null}
      </section>

      <div className="content-grid two-column-grid settings-grid">
        <section className="page-card settings-section">
          <div className="settings-section-header">
            <div>
              <p className="eyebrow">{t('settings.profileSection')}</p>
              <h2>{t('settings.profileSection')}</h2>
            </div>
            <p className="muted-copy">
              {t(
                authMode === 'firebase'
                  ? 'settings.profileHintLoggedIn'
                  : isGuest
                    ? 'settings.profileHintGuest'
                    : 'settings.profileHintSignedOut'
              )}
            </p>
          </div>

          <div className="form-stack">
            <label>
              {t('common.displayName')}
              <input
                className="input-field"
                disabled={!canEditProfile}
                onChange={(event) => updateDraft({ displayName: event.target.value })}
                value={settings.displayName}
              />
            </label>

            <label>
              {t('common.username')}
              <input
                className="input-field"
                disabled={!canEditAdvancedProfile}
                onChange={(event) => updateDraft({ username: event.target.value })}
                placeholder={t('settings.usernamePlaceholder')}
                value={settings.username || ''}
              />
            </label>

            <label>
              {t('common.bio')}
              <textarea
                className="input-field textarea-field"
                disabled={!canEditAdvancedProfile}
                onChange={(event) => updateDraft({ bio: event.target.value })}
                placeholder={t('settings.bioPlaceholder')}
                value={settings.bio || ''}
              />
            </label>

            <label>
              {t('common.avatarUrl')}
              <input
                className="input-field"
                disabled={!canEditProfile}
                onChange={(event) => updateDraft({ avatarUrl: event.target.value, photoURL: event.target.value })}
                placeholder={t('settings.avatarPlaceholder')}
                value={settings.avatarUrl || ''}
              />
            </label>

            <label>
              {t('common.homeProvince')}
              <select
                className="input-field"
                disabled={!canEditAdvancedProfile}
                onChange={(event) => updateDraft({ homeProvinceId: event.target.value })}
                value={settings.homeProvinceId || ''}
              >
                <option value="">{t('settings.homeProvincePlaceholder')}</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.fullName || province.name}
                  </option>
                ))}
              </select>
            </label>

            {!canEditAdvancedProfile && (isGuest || authMode === 'signed-out') ? (
              <p className="muted-copy small-copy">
                {t(authMode === 'signed-out' ? 'settings.signedOutNotice' : 'settings.guestLockedField')}
              </p>
            ) : null}
          </div>
        </section>

        <section className="page-card settings-section">
          <div className="settings-section-header">
            <div>
              <p className="eyebrow">{t('settings.readOnlySection')}</p>
              <h2>{t('settings.readOnlySection')}</h2>
            </div>
          </div>

          <div className="settings-readonly-grid">
            <article className="settings-readonly-card">
              <span>{t('settings.emailReadonly')}</span>
              <strong>{settings.email || t('common.signedOut')}</strong>
            </article>
            <article className="settings-readonly-card">
              <span>{t('settings.levelReadonly')}</span>
              <strong>{settings.levelTitle || t('common.travelerLevelFallback')}</strong>
            </article>
            <article className="settings-readonly-card">
              <span>{t('settings.visitedReadonly')}</span>
              <strong>{settings.visitedProvinceCount || 0}</strong>
            </article>
            <article className="settings-readonly-card">
              <span>{t('settings.verifiedReadonly')}</span>
              <strong>{settings.verifiedCheckinCount || 0}</strong>
            </article>
          </div>
        </section>

        <section className="page-card settings-section">
          <div className="settings-section-header">
            <div>
              <p className="eyebrow">{t('settings.appearanceSection')}</p>
              <h2>{t('settings.appearanceSection')}</h2>
            </div>
          </div>

          <SegmentedOptions
            onChange={(theme) =>
              updateDraft({
                preferences: {
                  theme
                }
              })
            }
            options={themeOptions}
            value={settings.preferences.theme}
          />
        </section>

        <section className="page-card settings-section">
          <div className="settings-section-header">
            <div>
              <p className="eyebrow">{t('settings.languageSection')}</p>
              <h2>{t('settings.languageSection')}</h2>
            </div>
          </div>

          <SegmentedOptions onChange={setLocale} options={languageOptions} value={locale} />
        </section>

        <section className="page-card settings-section settings-section-full">
          <div className="settings-section-header">
            <div>
              <p className="eyebrow">{t('settings.experienceSection')}</p>
              <h2>{t('settings.experienceSection')}</h2>
            </div>
          </div>

          <div className="settings-toggle-grid">
            <ToggleCard
              checked={settings.preferences.showLocation}
              description={t('settings.showLocationDescription')}
              disabled={!canEditExperience}
              label={t('settings.showLocationLabel')}
              onChange={() =>
                updateDraft({
                  preferences: {
                    showLocation: !settings.preferences.showLocation
                  }
                })
              }
              t={t}
            />
            <ToggleCard
              checked={settings.preferences.autoplayVideo}
              description={t('settings.autoplayDescription')}
              disabled={!canEditExperience}
              label={t('settings.autoplayLabel')}
              onChange={() =>
                updateDraft({
                  preferences: {
                    autoplayVideo: !settings.preferences.autoplayVideo
                  }
                })
              }
              t={t}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

