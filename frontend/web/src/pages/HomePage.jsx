import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { PostCard } from '../components/PostCard.jsx';
import { ProvinceMap } from '../components/ProvinceMap.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getFeed, getHealth, getLeaderboard, getProvinces } from '../lib/api.js';
import { demoHealth, demoLeaderboard, demoPosts, demoProvinces } from '../lib/demo-data.js';
import { useAuth } from '../providers/AuthProvider.jsx';

const spotlightProvinceIds = ['ha-noi', 'hai-phong', 'hue', 'da-nang', 'khanh-hoa', 'dak-lak', 'ho-chi-minh', 'can-tho'];

export function HomePage() {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error, reload } = useAsyncData(
    async () => {
      const [provincesResult, feedResult, leaderboardResult, healthResult] = await Promise.allSettled([
        getProvinces(),
        getFeed({ limit: 4 }),
        getLeaderboard(5),
        getHealth()
      ]);

      return {
        provinces: provincesResult.status === 'fulfilled' ? provincesResult.value : demoProvinces,
        posts: feedResult.status === 'fulfilled' ? feedResult.value : demoPosts,
        leaderboard: leaderboardResult.status === 'fulfilled' ? leaderboardResult.value : demoLeaderboard,
        health: healthResult.status === 'fulfilled' ? healthResult.value : demoHealth
      };
    },
    [],
    {
      provinces: demoProvinces,
      posts: demoPosts,
      leaderboard: demoLeaderboard,
      health: demoHealth
    }
  );

  const provinceCount = data.provinces.length || demoProvinces.length;
  const visitedCount = profile?.visitedProvinceCount || profile?.provincesVisited || 0;
  const featuredProvinces = useMemo(() => {
    const provinceMap = new Map(data.provinces.map((province) => [province.id, province]));
    const spotlight = spotlightProvinceIds.map((id) => provinceMap.get(id)).filter(Boolean);
    const remaining = data.provinces.filter((province) => !spotlightProvinceIds.includes(province.id));
    return [...spotlight, ...remaining].slice(0, 8);
  }, [data.provinces]);
  const filteredFeaturedProvinces = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return featuredProvinces;
    }

    return featuredProvinces.filter((province) => {
      const haystack = [province.name, province.fullName, province.code, province.region, province.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [featuredProvinces, searchTerm]);
  const heroProvince = filteredFeaturedProvinces[0] || featuredProvinces[0] || demoProvinces[0];
  const completionPercent = provinceCount ? Math.min(100, Math.round((visitedCount / provinceCount) * 100)) : 0;

  return (
    <div className="page-section-stack">
      <section className="page-card hero-card hero-card--split">
        <div className="hero-copy">
          <p className="eyebrow">Interactive atlas · social travel</p>
          <h1>Thiết kế lại hành trình khám phá Việt Nam theo kiểu bản đồ sống</h1>
          <p className="muted-copy">
            Giao diện mới ưu tiên cảm giác khám phá: header gọn, sidebar progress, bản đồ trung tâm và các điểm đến nổi bật để
            người dùng đi từ overview sang từng tỉnh chỉ với một vài thao tác.
          </p>
          <div className="hero-badge-row">
            <span className="pill">{provinceCount} tỉnh/thành hoạt động</span>
            <span className="pill">{completionPercent}% hành trình của bạn</span>
            <span className="pill">Realtime community feed</span>
          </div>
          <div className="hero-actions">
            <Link className="button primary-button" to="/checkin">
              Tạo check-in
            </Link>
            <Link className="button ghost-button" to="/feed">
              Xem feed toàn quốc
            </Link>
            <button className="button ghost-button" onClick={reload} type="button">
              Tải lại dữ liệu
            </button>
          </div>

          <div className="stats-grid compact-grid">
            <StatCard label="DB mode" value={data.health.databaseMode} hint="backend status" />
            <StatCard label="Bản đồ hiện hành" value={provinceCount} hint="tỉnh / thành" />
            <StatCard label="Tỉnh đã mở khóa" value={visitedCount} hint={profile?.levelTitle || 'Chưa đăng nhập'} />
            <StatCard label="Check-in xác thực" value={profile?.verifiedCheckinCount || 0} hint="bộ sưu tập cá nhân" />
          </div>
        </div>

        <article className="hero-spotlight-card">
          <div className="hero-spotlight-media">
            <img alt={heroProvince.name} src={heroProvince.imageUrl} />
          </div>
          <div className="hero-spotlight-body">
            <div className="section-heading-row wrap-row">
              <div>
                <p className="eyebrow">Spotlight province</p>
                <h2>{heroProvince.fullName || heroProvince.name}</h2>
              </div>
              <span className="pill">{heroProvince.code}</span>
            </div>
            <p className="muted-copy">{heroProvince.description}</p>
            <div className="hero-badge-row">
              <span className="pill">{heroProvince.region || 'Việt Nam'}</span>
              <span className="pill">{heroProvince.landmarks?.[0]?.name || 'Landmark nổi bật'}</span>
              <span className="pill">{heroProvince.popularTags?.[0] || '#VietWander'}</span>
            </div>
            <div className="hero-actions">
              <Link className="button primary-button" to={`/province/${heroProvince.id}`}>
                Khám phá tỉnh này
              </Link>
              <Link className="button ghost-button" to="/leaderboard">
                Xem bảng xếp hạng
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="page-card discovery-card">
        <div className="section-heading-row wrap-row">
          <div>
            <p className="eyebrow">Explore map</p>
            <h2>Tìm nhanh điểm đến trên bản đồ</h2>
            <p className="muted-copy">Lọc nhanh tỉnh nổi bật rồi mở chi tiết ngay từ giao diện mới.</p>
          </div>
          <div className="filter-bar">
            <label className="search-shell" htmlFor="home-province-search">
              <span className="material-symbols-outlined">search</span>
              <input
                className="search-input"
                id="home-province-search"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm tỉnh, vùng, mã..."
                type="search"
                value={searchTerm}
              />
            </label>
            <button className="button ghost-button" onClick={reload} type="button">
              Làm mới map
            </button>
          </div>
        </div>
      </section>

      {error ? <div className="banner warning-banner">{error}</div> : null}
      {loading ? <div className="banner info-banner">Đang tải dữ liệu trang chủ...</div> : null}

      <ProvinceMap provinces={data.provinces} />

      <section className="content-grid two-column-grid">
        <div className="page-card">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Điểm sáng theo vùng</p>
              <h2>Các tỉnh nổi bật trên bản đồ</h2>
            </div>
            <span className="pill">{filteredFeaturedProvinces.length} kết quả hiển thị</span>
          </div>
          {filteredFeaturedProvinces.length ? (
            <div className="province-grid">
              {filteredFeaturedProvinces.map((province) => (
                <Link className="province-card" key={province.id} to={`/province/${province.id}`}>
                  <img alt={province.name} src={province.imageUrl} />
                  <div className="province-card-body">
                    <div className="province-card-headline">
                      <div>
                        <p className="eyebrow">{province.code}</p>
                        <h3>{province.fullName || province.name}</h3>
                      </div>
                      <span className="material-symbols-outlined">arrow_outward</span>
                    </div>
                    <p className="muted-copy">{province.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không tìm thấy tỉnh phù hợp"
              description="Hãy thử từ khóa khác hoặc bấm làm mới để xem lại danh sách nổi bật."
            />
          )}
        </div>

        <div className="page-card">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Top traveler</p>
              <h2>Bảng xếp hạng nhanh</h2>
            </div>
            <Link className="inline-link" to="/leaderboard">
              Xem đầy đủ
            </Link>
          </div>
          <div className="leaderboard-list">
            {data.leaderboard.map((entry, index) => (
              <article className="leaderboard-row" key={entry.id || entry.uid}>
                <div className="leaderboard-rank">#{index + 1}</div>
                <div>
                  <h3>{entry.displayName}</h3>
                  <p className="muted-copy">{entry.levelTitle || 'Du khách'}</p>
                </div>
                <strong>
                  {entry.visitedProvinceCount || entry.provincesVisited || 0}/{provinceCount}
                </strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Realtime feed</p>
            <h2>Check-in mới nhất</h2>
          </div>
          <Link className="inline-link" to="/feed">
            Xem toàn bộ feed
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
            title="Feed đang trống"
            description="Hãy seed backend hoặc tạo check-in đầu tiên để feed bắt đầu sống động."
          />
        )}
      </section>
    </div>
  );
}
