import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getCheckins } from '../lib/api.js';
import { demoCheckins } from '../lib/demo-data.js';
import { formatDate, groupLatestByProvince } from '../lib/utils.js';
import { useAuth } from '../providers/AuthProvider.jsx';

export function CollectionPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { data, loading, error, reload } = useAsyncData(
    async () => {
      if (!user) {
        return [];
      }

      try {
        const checkins = await getCheckins({ userId: user.uid, limit: 30 });
        await refreshProfile();
        return checkins;
      } catch {
        return demoCheckins.filter((item) => item.userId === user.uid);
      }
    },
    [user?.uid],
    []
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

  const groupedCheckins = groupLatestByProvince(data);

  return (
    <div className="page-section-stack">
      <section className="page-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Đã đến</p>
            <h1>Bộ sưu tập check-in cá nhân</h1>
            <p className="muted-copy">Mỗi tỉnh sẽ hiển thị check-in gần nhất của bạn.</p>
          </div>
          <button className="button ghost-button" onClick={reload} type="button">
            Tải lại
          </button>
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
            <strong>{profile?.verifiedCheckinCount || data.length}</strong>
          </div>
        </div>

        {error ? <div className="banner warning-banner">{error}</div> : null}
        {loading ? <div className="banner info-banner">Đang tải bộ sưu tập...</div> : null}

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
