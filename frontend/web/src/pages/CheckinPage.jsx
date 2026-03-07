import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { createCheckin, getProvinces } from '../lib/api.js';
import { demoProvinces } from '../lib/demo-data.js';
import { uploadCheckinImage } from '../lib/firebase.js';
import { slugify } from '../lib/utils.js';
import { useAuth } from '../providers/AuthProvider.jsx';

export function CheckinPage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
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
    setSubmitting(true);
    setMessage('Đang tạo check-in...');

    try {
      let photoUrl = formState.photoUrl.trim();

      if (selectedFile) {
        photoUrl = await uploadCheckinImage(selectedFile, user.uid);
      }

      if (!photoUrl) {
        throw new Error('Hãy chọn ảnh hoặc nhập URL ảnh để check-in.');
      }

      await createCheckin({
        userId: user.uid,
        provinceId: formState.provinceId,
        landmarkId: slugify(formState.landmarkName) || null,
        landmarkName: formState.landmarkName || selectedProvince?.landmarks?.[0]?.name || null,
        photoUrl,
        caption: formState.caption,
        location:
          formState.lat && formState.lng
            ? {
                lat: Number(formState.lat),
                lng: Number(formState.lng)
              }
            : undefined
      });

      await refreshProfile();
      setMessage('Tạo check-in thành công. Đang chuyển tới trang tỉnh...');
      navigate(`/province/${formState.provinceId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Tạo check-in thất bại.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-section-stack">
      <section className="page-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Check-in camera / upload</p>
            <h1>Tạo check-in mới</h1>
            <p className="muted-copy">Web có thể dùng camera/file input và upload lên Firebase Storage trước khi gọi backend.</p>
          </div>
          <span className="pill">{user?.email}</span>
        </div>

        <form className="checkin-layout" onSubmit={handleSubmit}>
          <div className="form-stack">
            <label>
              Tỉnh / thành
              <select className="input-field" value={formState.provinceId} onChange={updateField('provinceId')}>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.fullName || province.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Địa danh
              <input className="input-field" value={formState.landmarkName} onChange={updateField('landmarkName')} placeholder="Ví dụ: Cầu Rồng" />
            </label>
            <label>
              Caption
              <textarea className="input-field textarea-field" value={formState.caption} onChange={updateField('caption')} placeholder="Check-in buổi chiều cực đẹp..." />
            </label>
            <label>
              Chọn ảnh từ thiết bị
              <input accept="image/*" capture="environment" className="input-field" onChange={handleFileChange} type="file" />
            </label>
            <label>
              Hoặc URL ảnh
              <input className="input-field" value={formState.photoUrl} onChange={updateField('photoUrl')} placeholder="https://..." />
            </label>
            <div className="location-grid">
              <label>
                Latitude
                <input className="input-field" value={formState.lat} onChange={updateField('lat')} placeholder="16.0613" />
              </label>
              <label>
                Longitude
                <input className="input-field" value={formState.lng} onChange={updateField('lng')} placeholder="108.227" />
              </label>
            </div>
            <button className="button primary-button full-width" disabled={submitting} type="submit">
              {submitting ? 'Đang gửi...' : 'Xác nhận check-in'}
            </button>
            {message ? <div className="banner info-banner">{message}</div> : null}
          </div>

          <div className="preview-card">
            <p className="eyebrow">Preview</p>
            <h2>{selectedProvince?.fullName || selectedProvince?.name}</h2>
            <p className="muted-copy">{selectedProvince?.description}</p>
            <img alt={selectedProvince?.name || 'Preview'} className="preview-image" src={previewUrl || formState.photoUrl || selectedProvince?.imageUrl} />
          </div>
        </form>
      </section>
    </div>
  );
}
