import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';
import { useI18n } from '../providers/I18nProvider.jsx';
import { useSettings } from '../providers/SettingsProvider.jsx';

function TopNavigation() {
  const { t } = useI18n();
  const topNavItems = [
    { to: '/', label: t('nav.explore') },
    { to: '/leaderboard', label: t('nav.leaderboard') },
    { to: '/collection', label: t('nav.collection') }
  ];

  return topNavItems.map((item) => (
    <NavLink key={item.to} to={item.to} className={({ isActive }) => `demo-top-link${isActive ? ' is-active' : ''}`} end={item.to === '/'}>
      {item.label}
    </NavLink>
  ));
}

function MobileNavigation() {
  const { t } = useI18n();
  const mobileNavItems = [
    { to: '/', label: t('nav.explore'), icon: 'explore' },
    { to: '/feed', label: t('nav.feed'), icon: 'photo_library' },
    { to: '/leaderboard', label: t('nav.top'), icon: 'military_tech' },
    { to: '/collection', label: t('nav.saved'), icon: 'bookmarks' },
    { to: '/checkin', label: t('nav.checkin'), icon: 'add_location_alt' }
  ];

  return mobileNavItems.map((item) => (
    <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} end={item.to === '/'}>
      <span className="material-symbols-outlined">{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  ));
}

export function AppLayout() {
  const { user, logout, isGuest, demoModeEnabled, resetDemoData } = useAuth();
  const { settings } = useSettings();
  const { t } = useI18n();
  const [resettingDemo, setResettingDemo] = useState(false);
  const visitedProvinceCount = settings.visitedProvinceCount || settings.provincesVisited || 42;
  const verifiedCheckinCount = settings.verifiedCheckinCount || 12;
  const provinceGoal = 63;
  const progressPercent = Math.min(100, Math.round((visitedProvinceCount / provinceGoal) * 100));
  const travelerName = settings.displayName || user?.displayName || t('common.travelerFallback');
  const travelerLevel = settings.levelTitle || t('common.travelerLevelFallback');
  const travelerAvatar = settings.avatarUrl || user?.photoURL || '';
  const avatarLetter = travelerName.slice(0, 1).toUpperCase();
  const showResetDemo = demoModeEnabled && isGuest;

  async function handleResetDemo() {
    setResettingDemo(true);

    try {
      await resetDemoData();
      window.location.assign('/');
    } finally {
      setResettingDemo(false);
    }
  }

  return (
    <div className="app-shell demo-layout">
      <header className="topbar demo-topbar">
        <div className="demo-brand-block">
          <div className="brand-mark demo-brand-mark">
            <span className="material-symbols-outlined">map</span>
          </div>
          <div>
            <h1 className="demo-brand-title">{t('app.brand')}</h1>
            <p className="demo-brand-subtitle">{t('app.subtitle')}</p>
          </div>
        </div>

        <nav className="demo-topnav" aria-label="Primary">
          <TopNavigation />
        </nav>

        <div className="demo-topbar-actions">
          {isGuest ? <span className="status-chip demo-mode-pill">{t('app.demoMode')}</span> : null}
          {showResetDemo ? (
            <button className="button ghost-button compact-button" disabled={resettingDemo} onClick={handleResetDemo} type="button">
              {resettingDemo ? t('shell.resettingDemo') : t('shell.resetDemo')}
            </button>
          ) : null}
          <NavLink className="demo-icon-button" to="/settings" aria-label={t('app.settings')}>
            <span className="material-symbols-outlined">settings</span>
          </NavLink>

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
                <span className="demo-panel-kicker">{t('shell.progress')}</span>
              </div>
              <p className="demo-panel-label">{t('shell.provincesVisited')}</p>
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
                <span className="demo-panel-kicker">{t('shell.rewards')}</span>
              </div>
              <p className="demo-panel-label">{t('shell.rareBadges')}</p>
              <h2>{verifiedCheckinCount}</h2>
              <div className="demo-badge-row">
                <span>??</span>
                <span>??</span>
                <span>??</span>
                <span>+8</span>
              </div>
            </article>

            <article className="demo-quest-panel">
              <p className="demo-panel-kicker">{t('shell.activeQuest')}</p>
              <h3>{t('shell.questTitle')}</h3>
              <p>{t('shell.questDescription')}</p>
              <NavLink className="demo-quest-button" to="/checkin">
                {t('common.continue')}
              </NavLink>
            </article>

            {isGuest ? (
              <article className="demo-insight-panel">
                <p className="demo-panel-kicker">{t('app.guestDemo')}</p>
                <h3>{t('shell.guestReadyTitle')}</h3>
                <p>{t('shell.guestReadyDescription')}</p>
              </article>
            ) : null}
          </div>

          <div className="demo-sidebar-footer">
            {showResetDemo ? (
              <button className="demo-side-link" disabled={resettingDemo} onClick={handleResetDemo} type="button">
                <span className="material-symbols-outlined">restart_alt</span>
                <span>{resettingDemo ? t('shell.resetDemoDataLoading') : t('shell.resetDemoData')}</span>
              </button>
            ) : null}
            <NavLink className="demo-side-link" to="/settings">
              <span className="material-symbols-outlined">settings</span>
              <span>{t('app.settings')}</span>
            </NavLink>
            {user ? (
              <button className="demo-side-link danger-link" onClick={logout} type="button">
                <span className="material-symbols-outlined">logout</span>
                <span>{isGuest ? t('common.exitDemo') : t('common.logout')}</span>
              </button>
            ) : (
              <NavLink className="demo-side-link" to="/login">
                <span className="material-symbols-outlined">login</span>
                <span>{t('common.login')}</span>
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
