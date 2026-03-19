import { Link } from 'react-router-dom';
import { CollectionMiniMap } from '../components/CollectionMiniMap.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { getCheckins, getProvinces } from '../lib/api.js';
import { demoCheckins, demoProvinces } from '../lib/demo-data.js';
import { formatDate, groupLatestByProvince } from '../lib/utils.js';
import { useI18n } from '../providers/I18nProvider.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

export function CollectionPage() {
  const { user, profile, refreshProfile, isGuest } = useAuth();
  const { t } = useI18n();
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

  useDocumentTitle(t('seo.collection'));

  if (!user) {
    return (
      <div className="page-card">
        <EmptyState
          title={t('collection.authTitle')}
          description={t('collection.authDescription')}
          action={
            <Link className="button primary-button" to="/login">
              {t('collection.authAction')}
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
            <p className="eyebrow">{t('collection.eyebrow')}</p>
            <h1>{t('collection.title')}</h1>
            <p className="muted-copy">{t('collection.description')}</p>
          </div>
          <div className="filter-bar">
            {isGuest ? <span className="status-chip">{t('app.guestDemo')}</span> : null}
            <button className="button ghost-button" onClick={reload} type="button">
              {t('common.reload')}
            </button>
          </div>
        </div>

        <div className="stats-grid compact-grid">
          <div className="stat-card">
            <span>{t('collection.statVisited')}</span>
            <strong>{profile?.visitedProvinceCount || profile?.provincesVisited || groupedCheckins.length}</strong>
          </div>
          <div className="stat-card">
            <span>{t('collection.statBadges')}</span>
            <strong>{profile?.badges?.length || 0}</strong>
          </div>
          <div className="stat-card">
            <span>{t('collection.statCheckins')}</span>
            <strong>{profile?.verifiedCheckinCount || data.checkins.length}</strong>
          </div>
        </div>

        {error ? <div className="banner warning-banner">{error}</div> : null}
        {loading ? <div className="banner info-banner">{t('collection.loading')}</div> : null}
      </section>

      <CollectionMiniMap provinces={data.provinces} visitedProvinceIds={visitedProvinceIds} />

      <section className="page-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">{t('collection.latestEyebrow')}</p>
            <h2>{t('collection.latestTitle')}</h2>
          </div>
          <Link className="inline-link" to="/checkin">
            {t('common.createNewCheckin')}
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
                      {t('common.openProvince')}
                    </Link>
                  </div>
                  <p className="muted-copy">{item.caption || t('collection.fallbackCaption')}</p>
                  <p className="muted-copy small-copy">{t('collection.latestAt', { date: formatDate(item.createdAt) })}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('collection.emptyTitle')}
            description={t('collection.emptyDescription')}
            action={
              <Link className="button primary-button" to="/checkin">
                {t('common.createCheckin')}
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
