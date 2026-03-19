import { useMemo, useState } from 'react';
import { PostCard } from '../components/PostCard.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { getFeed, getProvinces } from '../lib/api.js';
import { demoPosts, demoProvinces } from '../lib/demo-data.js';
import { useI18n } from '../providers/I18nProvider.jsx';

export function FeedPage() {
  const [provinceId, setProvinceId] = useState('');
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

  const { data: posts, loading, error, reload } = useAsyncData(
    async () => {
      try {
        return await getFeed({ provinceId, limit: 12 });
      } catch {
        return provinceId ? demoPosts.filter((post) => post.provinceId === provinceId) : demoPosts;
      }
    },
    [provinceId],
    demoPosts
  );

  useDocumentTitle(t('seo.feed'));

  const selectedProvince = useMemo(() => provinces.find((item) => item.id === provinceId), [provinceId, provinces]);

  return (
    <div className="page-section-stack">
      <section className="page-card">
        <div className="section-heading-row wrap-row">
          <div>
            <p className="eyebrow">{t('feed.eyebrow')}</p>
            <h1>{selectedProvince ? t('feed.titleProvince', { name: selectedProvince.name }) : t('feed.titleAll')}</h1>
            <p className="muted-copy">{t('feed.description')}</p>
          </div>
          <div className="filter-bar">
            <select className="input-field" value={provinceId} onChange={(event) => setProvinceId(event.target.value)}>
              <option value="">{t('common.allProvinces')}</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            <button className="button ghost-button" onClick={reload} type="button">
              {t('common.refresh')}
            </button>
          </div>
        </div>
        {error ? <div className="banner warning-banner">{error}</div> : null}
        {loading ? <div className="banner info-banner">{t('feed.loading')}</div> : null}
        <div className="post-grid two-column-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
