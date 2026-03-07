import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { PostCard } from '../components/PostCard.jsx';
import { ProvinceMap } from '../components/ProvinceMap.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getProvince, getProvincePosts, getProvinces } from '../lib/api.js';
import { demoPosts, demoProvinces } from '../lib/demo-data.js';

export function ProvincePage() {
  const { provinceId = '' } = useParams();

  const { data, loading, error } = useAsyncData(
    async () => {
      const provinceFallback = demoProvinces.find((item) => item.id === provinceId) || demoProvinces[0];
      const [provinceResult, postsResult, provincesResult] = await Promise.allSettled([
        getProvince(provinceId),
        getProvincePosts(provinceId, 6),
        getProvinces()
      ]);

      return {
        province: provinceResult.status === 'fulfilled' ? provinceResult.value : provinceFallback,
        posts: postsResult.status === 'fulfilled' ? postsResult.value : demoPosts.filter((post) => post.provinceId === provinceId),
        provinces: provincesResult.status === 'fulfilled' ? provincesResult.value : demoProvinces
      };
    },
    [provinceId],
    {
      province: demoProvinces.find((item) => item.id === provinceId) || demoProvinces[0],
      posts: demoPosts.filter((post) => post.provinceId === provinceId),
      provinces: demoProvinces
    }
  );

  const province = data.province;

  return (
    <div className="page-section-stack">
      <section className="page-card province-hero-card">
        <img alt={province.name} className="province-hero-image" src={province.imageUrl} />
        <div className="province-hero-overlay">
          <span className="pill dark-pill">{province.code}</span>
          <h1>{province.fullName || province.name}</h1>
          <p>{province.description}</p>
          <div className="hero-actions">
            <Link className="button primary-button" to="/checkin">
              Check-in tại đây
            </Link>
            <Link className="button ghost-button" to="/feed">
              Xem feed chung
            </Link>
          </div>
        </div>
      </section>

      {error ? <div className="banner warning-banner">{error}</div> : null}
      {loading ? <div className="banner info-banner">Đang tải chi tiết tỉnh...</div> : null}

      <section className="content-grid two-column-grid">
        <ProvinceMap provinces={data.provinces} activeProvinceId={provinceId} />

        <section className="page-card">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Landmarks</p>
              <h2>Địa danh nổi bật</h2>
            </div>
            <span className="pill">{province.landmarks?.length || 0} địa danh</span>
          </div>
          <div className="landmark-list">
            {(province.landmarks || []).map((landmark) => (
              <article className="landmark-card" key={landmark.id}>
                <div className="landmark-icon">
                  <span className="material-symbols-outlined">landscape</span>
                </div>
                <div>
                  <h3>{landmark.name}</h3>
                  <p className="muted-copy">{landmark.desc || 'Địa danh đáng ghé thăm.'}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="page-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Realtime by province</p>
            <h2>Feed của {province.name}</h2>
          </div>
          <Link className="inline-link" to="/checkin">
            Tạo check-in mới
          </Link>
        </div>
        {data.posts.length ? (
          <div className="post-grid two-column-grid">
            {data.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chưa có bài đăng cho tỉnh này"
            description="Tạo check-in đầu tiên để làm đầy feed địa phương."
            action={
              <Link className="button primary-button" to="/checkin">
                Check-in ngay
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
