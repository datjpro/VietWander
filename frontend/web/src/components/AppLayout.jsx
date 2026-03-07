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
        <div className="topbar-actions">
          <span className="status-chip">DB: {health?.databaseMode || 'unknown'}</span>
          {user ? (
            <button className="button ghost-button" onClick={logout} type="button">
              Đăng xuất
            </button>
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
            <div className="avatar-bubble">{(profile?.displayName || user?.displayName || 'V').slice(0, 1).toUpperCase()}</div>
            <div>
              <p className="eyebrow">Traveler profile</p>
              <h2>{profile?.displayName || user?.displayName || 'Khách ghé thăm'}</h2>
              <p className="muted-copy">{profile?.levelTitle || 'Sẵn sàng mở khóa các tỉnh đã đi qua'}</p>
            </div>
          </div>

          <nav className="side-nav">
            <NavigationLinks />
          </nav>

          <div className="sidebar-stats-grid">
            <div className="mini-stat-card">
              <span>Tỉnh đã mở khóa</span>
              <strong>{profile?.visitedProvinceCount || profile?.provincesVisited || 0}</strong>
            </div>
            <div className="mini-stat-card">
              <span>Check-in hợp lệ</span>
              <strong>{profile?.verifiedCheckinCount || 0}</strong>
            </div>
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
