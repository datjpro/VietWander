import { useMemo, useState } from 'react';
import { PostCard } from '../components/PostCard.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getFeed, getProvinces } from '../lib/api.js';
import { demoPosts, demoProvinces } from '../lib/demo-data.js';

export function FeedPage() {
  const [provinceId, setProvinceId] = useState('');
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

  const selectedProvince = useMemo(() => provinces.find((item) => item.id === provinceId), [provinceId, provinces]);

  return (
    <div className="page-section-stack">
      <section className="page-card">
        <div className="section-heading-row wrap-row">
          <div>
            <p className="eyebrow">Feed ảnh/video</p>
            <h1>{selectedProvince ? `Feed của ${selectedProvince.name}` : 'Feed toàn quốc'}</h1>
            <p className="muted-copy">Lọc theo tỉnh để chỉ xem nội dung liên quan đến địa danh đó.</p>
          </div>
          <div className="filter-bar">
            <select className="input-field" value={provinceId} onChange={(event) => setProvinceId(event.target.value)}>
              <option value="">Tất cả tỉnh</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            <button className="button ghost-button" onClick={reload} type="button">
              Làm mới
            </button>
          </div>
        </div>
        {error ? <div className="banner warning-banner">{error}</div> : null}
        {loading ? <div className="banner info-banner">Đang tải feed...</div> : null}
        <div className="post-grid two-column-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
