import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { createCheckin, getProvinces } from '../lib/api.js';
import { demoProvinces } from '../lib/demo-data.js';
import { canUploadCheckinImages, uploadCheckinImage } from '../lib/firebase.js';
import { slugify } from '../lib/utils.js';
import { useI18n } from '../providers/I18nProvider.jsx';
import { useSettings } from '../providers/SettingsProvider.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Không thể đọc ảnh local để tạo demo check-in.'));
    reader.readAsDataURL(file);
  });
}

export function CheckinPage() {
  const navigate = useNavigate();
  const { user, refreshProfile, isGuest } = useAuth();
  const { settings } = useSettings();
  const { t } = useI18n();
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

  useDocumentTitle(t('seo.checkin'));

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState({
    provinceId: demoProvinces[0]?.id || 'ha-noi',
    landmarkName: '',
    caption: '',
    photoUrl: '',
    lat: '',
    lng: ''
  });

  const selectedProvince = useMemo(
    () => provinces.find((province) => province.id === formState.provinceId),
    [formState.provinceId, provinces]
  );

  function updateField(fieldName) {
    return (event) => {
      setFormState((currentValue) => ({
        ...currentValue,
        [fieldName]: event.target.value
      }));
    };
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user) {
      setMessage(t('checkin.needAuth'));
      return;
    }

    setSubmitting(true);
    setMessage(t('checkin.creating'));

    try {
      let photoUrl = formState.photoUrl.trim();

      if (selectedFile) {
        if (isGuest || !canUploadCheckinImages) {
          photoUrl = await readFileAsDataUrl(selectedFile);
        } else {
          photoUrl = await uploadCheckinImage(selectedFile, user.uid);
        }
      }

      if (!photoUrl) {
        throw new Error(t('checkin.pickImageOrUrl'));
      }

      await createCheckin({
        userId: user.uid,
        provinceId: formState.provinceId,
        landmarkId: slugify(formState.landmarkName) || null,
        landmarkName: formState.landmarkName || selectedProvince?.landmarks?.[0]?.name || null,
        photoUrl,
        caption: formState.caption,
        location:
          settings.preferences.showLocation && formState.lat && formState.lng
            ? {
                lat: Number(formState.lat),
                lng: Number(formState.lng)
              }
            : undefined
      });

      await refreshProfile();
      setMessage(t('checkin.success'));
      navigate(`/province/${formState.provinceId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t('checkin.submitError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-section-stack">
      <section className="page-card">
        <div className="section-heading-row wrap-row">
          <div>
            <p className="eyebrow">{t('checkin.eyebrow')}</p>
            <h1>{t('checkin.title')}</h1>
            <p className="muted-copy">{t('checkin.description')}</p>
          </div>
          <div className="filter-bar">
            {isGuest ? <span className="status-chip">{t('app.guestDemo')}</span> : null}
            <span className="pill">{user?.email || t('common.guestAccount')}</span>
          </div>
        </div>

        <form className="checkin-layout" onSubmit={handleSubmit}>
          <div className="form-stack">
            <label>
              {t('common.province')}
              <select className="input-field" value={formState.provinceId} onChange={updateField('provinceId')}>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.fullName || province.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('common.landmark')}
              <input className="input-field" value={formState.landmarkName} onChange={updateField('landmarkName')} placeholder={t('checkin.landmarkPlaceholder')} />
            </label>
            <label>
              {t('common.caption')}
              <textarea className="input-field textarea-field" value={formState.caption} onChange={updateField('caption')} placeholder={t('checkin.captionPlaceholder')} />
            </label>
            <label>
              {t('checkin.photoInput')}
              <input accept="image/*" capture="environment" className="input-field" onChange={handleFileChange} type="file" />
            </label>
            <label>
              {t('checkin.imageUrlLabel')}
              <input className="input-field" value={formState.photoUrl} onChange={updateField('photoUrl')} placeholder="https://..." />
            </label>
            <div className="location-grid">
              <label>
                {t('common.latitude')}
                <input
                  className="input-field"
                  disabled={!settings.preferences.showLocation}
                  value={formState.lat}
                  onChange={updateField('lat')}
                  placeholder={t('checkin.latitudePlaceholder')}
                />
              </label>
              <label>
                {t('common.longitude')}
                <input
                  className="input-field"
                  disabled={!settings.preferences.showLocation}
                  value={formState.lng}
                  onChange={updateField('lng')}
                  placeholder={t('checkin.longitudePlaceholder')}
                />
              </label>
            </div>
            <button className="button primary-button full-width" disabled={submitting} type="submit">
              {submitting ? t('checkin.submitting') : t('checkin.submit')}
            </button>
            {message ? <div className="banner info-banner">{message}</div> : null}
            {isGuest ? <p className="muted-copy small-copy">{t('checkin.guestHint')}</p> : null}
          </div>

          <div className="preview-card">
            <p className="eyebrow">{t('common.preview')}</p>
            <h2>{selectedProvince?.fullName || selectedProvince?.name}</h2>
            <p className="muted-copy">{selectedProvince?.description}</p>
            <img alt={selectedProvince?.name || t('common.preview')} className="preview-image" src={previewUrl || formState.photoUrl || selectedProvince?.imageUrl} />
            <div className="hero-actions wrap-row">
              <Link className="button ghost-button" to={`/province/${formState.provinceId}`}>
                {t('checkin.viewProvince')}
              </Link>
              <Link className="button ghost-button" to="/collection">
                {t('checkin.openCollection')}
              </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
