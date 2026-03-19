import { Link } from 'react-router-dom';
import { CollectionMiniMap } from '../components/CollectionMiniMap.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getCheckins, getProvinces } from '../lib/api.js';
import { demoCheckins, demoProvinces } from '../lib/demo-data.js';
import { formatDate, groupLatestByProvince } from '../lib/utils.js';
import { useAuth } from '../providers/AuthProvider.jsx';

export function CollectionPage() {
  const { user, profile, refreshProfile, isGuest } = useAuth();
  const { data, loading, error, reload } = useAsyncData(
    async () => {
      if (!user) {
        return {
          checkins: [],
          provinces: demoProvinces
        };
      }

      const [checkinsResult, provincesResult] = await Promise.allSettled([
        getCheckins({ userId: user.uid, limit: 30 }),
        getProvinces()
      ]);

      if (checkinsResult.status === 'fulfilled') {
        await refreshProfile();
      }

      return {
        checkins: checkinsResult.status === 'fulfilled' ? checkinsResult.value : demoCheckins.filter((item) => item.userId === user.uid),
        provinces: provincesResult.status === 'fulfilled' ? provincesResult.value : demoProvinces
      };
    },
    [user?.uid],
    {
      checkins: [],
      provinces: demoProvinces
    }
  );

  if (!user) {
    return (
      <div className="page-card">
        <EmptyState
          title="Cần đăng nhập để xem bộ sưu tập"
          description="Đăng nhập để xem các tỉnh đã check-in và badge bạn đã mở khóa."
          action={
            <Link className="button primary-button" to="/login">
              Đi đến đăng nhập
            </Link>
          }
        />
      </div>
    );
  }

  const groupedCheckins = groupLatestByProvince(data.checkins);
  const visitedProvinceIds = groupedCheckins.map((item) => item.provinceId);

  return (
    <div className="page-section-stack">
      <section className="page-card">
        <div className="section-heading-row wrap-row">
          <div>
            <p className="eyebrow">Đã đến</p>
            <h1>Bộ sưu tập check-in cá nhân</h1>
            <p className="muted-copy">Mỗi tỉnh hiển thị check-in gần nhất của bạn, kèm mini map tiến độ để pitch demo dễ hơn.</p>
          </div>
          <div className="filter-bar">
            {isGuest ? <span className="status-chip">Guest Demo</span> : null}
            <button className="button ghost-button" onClick={reload} type="button">
              Tải lại
            </button>
          </div>
        </div>

        <div className="stats-grid compact-grid">
          <div className="stat-card">
            <span>Tỉnh đã ghé</span>
            <strong>{profile?.visitedProvinceCount || profile?.provincesVisited || groupedCheckins.length}</strong>
          </div>
          <div className="stat-card">
            <span>Badge</span>
            <strong>{profile?.badges?.length || 0}</strong>
          </div>
          <div className="stat-card">
            <span>Check-in</span>
            <strong>{profile?.verifiedCheckinCount || data.checkins.length}</strong>
          </div>
        </div>

        {error ? <div className="banner warning-banner">{error}</div> : null}
        {loading ? <div className="banner info-banner">Đang tải bộ sưu tập...</div> : null}
      </section>

      <CollectionMiniMap provinces={data.provinces} visitedProvinceIds={visitedProvinceIds} />

      <section className="page-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Latest per province</p>
            <h2>Những chấm đã mở khóa</h2>
          </div>
          <Link className="inline-link" to="/checkin">
            Tạo check-in mới
          </Link>
        </div>

        {groupedCheckins.length ? (
          <div className="province-grid">
            {groupedCheckins.map((item) => (
              <article className="province-card" key={item.id}>
                <img alt={item.provinceName} src={item.photoUrl || item.imageUrl} />
                <div className="province-card-body">
                  <div className="province-card-headline">
                    <div>
                      <p className="eyebrow">{item.provinceId}</p>
                      <h3>{item.provinceName}</h3>
                    </div>
                    <Link className="inline-link" to={`/province/${item.provinceId}`}>
                      Mở tỉnh
                    </Link>
                  </div>
                  <p className="muted-copy">{item.caption || 'Bạn đã check-in tại tỉnh này.'}</p>
                  <p className="muted-copy small-copy">Gần nhất: {formatDate(item.createdAt)}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Bạn chưa có check-in nào"
            description="Hãy tạo check-in đầu tiên để bộ sưu tập tỉnh bắt đầu hiển thị."
            action={
              <Link className="button primary-button" to="/checkin">
                Tạo check-in
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
