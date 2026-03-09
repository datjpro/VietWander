import { NavLink, Outlet } from 'react-router-dom';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getHealth } from '../lib/api.js';
import { demoHealth } from '../lib/demo-data.js';
import { useAuth } from '../providers/AuthProvider.jsx';

const navItems = [
  { to: '/', label: 'Trang chủ', icon: 'home' },
  { to: '/feed', label: 'Feed', icon: 'photo_library' },
  { to: '/leaderboard', label: 'BXH', icon: 'military_tech' },
  { to: '/collection', label: 'Bộ sưu tập', icon: 'bookmarks' },
  { to: '/checkin', label: 'Check-in', icon: 'photo_camera' }
];

function NavigationLinks() {
  return navItems.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
      end={item.to === '/'}
    >
      <span className="material-symbols-outlined">{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  ));
}

export function AppLayout() {
  const { user, profile, logout } = useAuth();
  const { data: health } = useAsyncData(
    async () => {
      try {
        return await getHealth();
      } catch {
        return demoHealth;
      }
    },
    [],
    demoHealth
  );
  const visitedProvinceCount = profile?.visitedProvinceCount || profile?.provincesVisited || 0;
  const verifiedCheckinCount = profile?.verifiedCheckinCount || 0;
  const provinceGoal = 63;
  const progressPercent = Math.min(100, Math.round((visitedProvinceCount / provinceGoal) * 100));
  const nextMilestone = [10, 20, 35, 50, 63].find((item) => visitedProvinceCount < item) || 63;
  const remainingToMilestone = Math.max(0, nextMilestone - visitedProvinceCount);
  const travelerName = profile?.displayName || user?.displayName || 'Khách ghé thăm';
  const travelerLevel = profile?.levelTitle || 'Sẵn sàng mở khóa các tỉnh đã đi qua';
  const avatarLetter = travelerName.slice(0, 1).toUpperCase();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">V</div>
          <div>
            <p className="brand-script">VietWander</p>
            <h1 className="brand-title">Lang thang Việt Nam</h1>
          </div>
        </div>
        <nav className="topbar-nav" aria-label="Điều hướng chính">
          <NavigationLinks />
        </nav>
        <div className="topbar-actions">
          <span className="status-chip">DB: {health?.databaseMode || 'unknown'}</span>
          {user ? (
            <div className="topbar-profile">
              <div className="topbar-profile-copy">
                <strong>{travelerName}</strong>
                <span>{travelerLevel}</span>
              </div>
              <div className="avatar-bubble compact-avatar">{avatarLetter}</div>
              <button className="button ghost-button compact-button" onClick={logout} type="button">
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="auth-cta-row">
              <NavLink className="button ghost-button" to="/login">
                Đăng nhập
              </NavLink>
              <NavLink className="button primary-button" to="/register">
                Đăng ký
              </NavLink>
            </div>
          )}
        </div>
      </header>

      <div className="layout-grid">
        <aside className="sidebar-card">
          <div className="sidebar-profile">
            <div className="avatar-bubble">{avatarLetter}</div>
            <div>
              <p className="eyebrow">Traveler profile</p>
              <h2>{travelerName}</h2>
              <p className="muted-copy">{travelerLevel}</p>
            </div>
          </div>

          <div className="sidebar-stack">
            <article className="sidebar-insight-card">
              <div className="sidebar-insight-head">
                <span className="material-symbols-outlined">explore</span>
                <span className="eyebrow no-margin">Progress</span>
              </div>
              <p className="muted-copy">Provinces visited</p>
              <h3>
                {visitedProvinceCount}
                <span>/{provinceGoal}</span>
              </h3>
              <div className="progress-track" aria-hidden="true">
                <span className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </article>

            <div className="sidebar-stats-grid">
              <div className="mini-stat-card">
                <span>Check-in hợp lệ</span>
                <strong>{verifiedCheckinCount}</strong>
              </div>
              <div className="mini-stat-card">
                <span>Cấp độ hiện tại</span>
                <strong>{Math.max(1, Math.round(visitedProvinceCount / 3) || 1)}</strong>
              </div>
            </div>

            <article className="sidebar-insight-card quest-card">
              <div className="sidebar-insight-head">
                <span className="material-symbols-outlined">award_star</span>
                <span className="eyebrow no-margin">Active quest</span>
              </div>
              <h3>{nextMilestone >= provinceGoal ? 'Vietnam Master' : `Chạm mốc ${nextMilestone} tỉnh`}</h3>
              <p className="muted-copy">
                {remainingToMilestone > 0
                  ? `Đi thêm ${remainingToMilestone} tỉnh nữa để mở khóa cột mốc tiếp theo.`
                  : 'Bạn đã chạm mốc cuối. Tiếp tục check-in để làm dày bộ sưu tập.'}
              </p>
              <NavLink className="button dark-button full-width" to="/checkin">
                Check-in ngay
              </NavLink>
            </article>
          </div>

          <div className="sidebar-footer">
            <NavLink className="sidebar-utility" to="/collection">
              <span className="material-symbols-outlined">bookmarks</span>
              <span>Bộ sưu tập</span>
            </NavLink>
            {user ? (
              <button className="sidebar-utility danger-utility" onClick={logout} type="button">
                <span className="material-symbols-outlined">logout</span>
                <span>Đăng xuất</span>
              </button>
            ) : (
              <NavLink className="sidebar-utility" to="/login">
                <span className="material-symbols-outlined">login</span>
                <span>Đăng nhập</span>
              </NavLink>
            )}
          </div>
        </aside>

        <main className="page-stack">
          <Outlet />
        </main>
      </div>

      <nav className="mobile-bottom-nav">
        <NavigationLinks />
      </nav>
    </div>
  );
}
