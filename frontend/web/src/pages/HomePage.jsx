import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { PostCard } from '../components/PostCard.jsx';
import { ProvinceMap } from '../components/ProvinceMap.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getFeed, getHealth, getLeaderboard, getProvinces } from '../lib/api.js';
import { demoHealth, demoLeaderboard, demoPosts, demoProvinces } from '../lib/demo-data.js';
import { useAuth } from '../providers/AuthProvider.jsx';

export function HomePage() {
  const { profile } = useAuth();
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

  return (
    <div className="page-section-stack">
      <section className="page-card hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Cartoon map + social travel</p>
          <h1>Khám phá Việt Nam bằng bản đồ hoạt họa và feed check-in realtime</h1>
          <p className="muted-copy">
            Web được viết lại bằng React JS chuẩn, giữ đúng tinh thần thiết kế từ thư mục `UI` và sẵn sàng kết nối backend / Firebase thật.
          </p>
          <div className="hero-actions">
            <Link className="button primary-button" to="/checkin">
              Tạo check-in
            </Link>
            <button className="button ghost-button" onClick={reload} type="button">
              Tải lại dữ liệu
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard label="DB mode" value={data.health.databaseMode} hint="backend status" />
          <StatCard
            label="Tỉnh đã mở khóa"
            value={profile?.visitedProvinceCount || profile?.provincesVisited || 0}
            hint={profile?.levelTitle || 'Chưa đăng nhập'}
          />
          <StatCard label="Check-in xác thực" value={profile?.verifiedCheckinCount || 0} hint="bộ sưu tập cá nhân" />
        </div>
      </section>

      <ProvinceMap provinces={data.provinces} />

      {error ? <div className="banner warning-banner">{error}</div> : null}
      {loading ? <div className="banner info-banner">Đang tải dữ liệu trang chủ...</div> : null}

      <section className="content-grid two-column-grid">
        <div className="page-card">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Tỉnh nổi bật</p>
              <h2>Chọn tỉnh để xem chi tiết</h2>
            </div>
            <span className="pill">{data.provinces.length} tỉnh demo</span>
          </div>
          <div className="province-grid">
            {data.provinces.map((province) => (
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
                <strong>{entry.visitedProvinceCount || entry.provincesVisited || 0}/63</strong>
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
