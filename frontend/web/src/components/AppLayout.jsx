import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';

const topNavItems = [
  { to: '/', label: 'Explore' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/collection', label: 'My Collection' }
];

const mobileNavItems = [
  { to: '/', label: 'Explore', icon: 'explore' },
  { to: '/feed', label: 'Feed', icon: 'photo_library' },
  { to: '/leaderboard', label: 'Top', icon: 'military_tech' },
  { to: '/collection', label: 'Saved', icon: 'bookmarks' },
  { to: '/checkin', label: 'Check-in', icon: 'add_location_alt' }
];

function TopNavigation() {
  return topNavItems.map((item) => (
    <NavLink key={item.to} to={item.to} className={({ isActive }) => `demo-top-link${isActive ? ' is-active' : ''}`} end={item.to === '/'}>
      {item.label}
    </NavLink>
  ));
}

function MobileNavigation() {
  return mobileNavItems.map((item) => (
    <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} end={item.to === '/'}>
      <span className="material-symbols-outlined">{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  ));
}

export function AppLayout() {
  const { user, profile, logout } = useAuth();
  const visitedProvinceCount = profile?.visitedProvinceCount || profile?.provincesVisited || 42;
  const verifiedCheckinCount = profile?.verifiedCheckinCount || 12;
  const provinceGoal = 63;
  const progressPercent = Math.min(100, Math.round((visitedProvinceCount / provinceGoal) * 100));
  const travelerName = profile?.displayName || user?.displayName || 'Alex Nguyen';
  const travelerLevel = profile?.levelTitle || 'Lvl 24 Legend';
  const travelerAvatar = profile?.avatarUrl || user?.photoURL || '';
  const avatarLetter = travelerName.slice(0, 1).toUpperCase();

  return (
    <div className="app-shell demo-layout">
      <header className="topbar demo-topbar">
        <div className="demo-brand-block">
          <div className="brand-mark demo-brand-mark">
            <span className="material-symbols-outlined">map</span>
          </div>
          <h1 className="demo-brand-title">CheckViet</h1>
        </div>

        <nav className="demo-topnav" aria-label="Primary">
          <TopNavigation />
        </nav>

        <div className="demo-topbar-actions">
          <button className="demo-icon-button" type="button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="demo-icon-dot" />
          </button>

          <div className="demo-user-block">
            <div className="demo-user-copy">
              <strong>{travelerName}</strong>
              <span>{travelerLevel}</span>
            </div>
            <div className="demo-avatar-frame">
              {travelerAvatar ? <img alt={travelerName} src={travelerAvatar} /> : <span>{avatarLetter}</span>}
            </div>
          </div>
        </div>
      </header>

      <div className="layout-grid demo-main-grid">
        <aside className="sidebar-card demo-sidebar">
          <div className="demo-sidebar-stack">
            <article className="demo-stat-panel">
              <div className="demo-panel-head">
                <span className="demo-panel-icon material-symbols-outlined">explore</span>
                <span className="demo-panel-kicker">Progress</span>
              </div>
              <p className="demo-panel-label">Provinces Visited</p>
              <h2>
                {visitedProvinceCount}
                <span>/{provinceGoal}</span>
              </h2>
              <div className="demo-progress-track" aria-hidden="true">
                <span className="demo-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </article>

            <article className="demo-stat-panel">
              <div className="demo-panel-head">
                <span className="demo-panel-icon material-symbols-outlined">workspace_premium</span>
                <span className="demo-panel-kicker">Rewards</span>
              </div>
              <p className="demo-panel-label">Rare Badges</p>
              <h2>{verifiedCheckinCount}</h2>
              <div className="demo-badge-row">
                <span>🏅</span>
                <span>🌊</span>
                <span>🌿</span>
                <span>+8</span>
              </div>
            </article>

            <article className="demo-quest-panel">
              <p className="demo-panel-kicker">Active Quest</p>
              <h3>Mekong Delta Explorer</h3>
              <p>Visit 3 more floating markets to earn the “River Master” badge.</p>
              <NavLink className="demo-quest-button" to="/checkin">
                Continue
              </NavLink>
            </article>
          </div>

          <div className="demo-sidebar-footer">
            <button className="demo-side-link" type="button">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </button>
            {user ? (
              <button className="demo-side-link danger-link" onClick={logout} type="button">
                <span className="material-symbols-outlined">logout</span>
                <span>Logout</span>
              </button>
            ) : (
              <NavLink className="demo-side-link" to="/login">
                <span className="material-symbols-outlined">login</span>
                <span>Login</span>
              </NavLink>
            )}
          </div>
        </aside>

        <main className="page-stack demo-page-stack">
          <Outlet />
        </main>
      </div>

      <nav className="mobile-bottom-nav">
        <MobileNavigation />
      </nav>
    </div>
  );
}
