import { useAsyncData } from '../hooks/useAsyncData.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { getLeaderboard, getProvinces } from '../lib/api.js';
import { demoLeaderboard, demoProvinces } from '../lib/demo-data.js';
import { formatCompactNumber } from '../lib/utils.js';
import { useI18n } from '../providers/I18nProvider.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

export function LeaderboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { data, loading, error, reload } = useAsyncData(
    async () => {
      const [leaderboardResult, provincesResult] = await Promise.allSettled([getLeaderboard(20), getProvinces()]);

      return {
        entries: leaderboardResult.status === 'fulfilled' ? leaderboardResult.value : demoLeaderboard,
        provinceCount: provincesResult.status === 'fulfilled' ? provincesResult.value.length : demoProvinces.length
      };
    },
    [],
    {
      entries: demoLeaderboard,
      provinceCount: demoProvinces.length
    }
  );

  useDocumentTitle(t('seo.leaderboard'));

  return (
    <div className="page-section-stack">
      <section className="page-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">{t('leaderboard.eyebrow')}</p>
            <h1>{t('leaderboard.title')}</h1>
            <p className="muted-copy">{t('leaderboard.description')}</p>
          </div>
          <button className="button ghost-button" onClick={reload} type="button">
            {t('common.reload')}
          </button>
        </div>
        {error ? <div className="banner warning-banner">{error}</div> : null}
        {loading ? <div className="banner info-banner">{t('leaderboard.loading')}</div> : null}
        <div className="leaderboard-list">
          {data.entries.map((entry, index) => {
            const isCurrentUser = user?.uid && (entry.uid === user.uid || entry.id === user.uid);
            return (
              <article className={`leaderboard-row${isCurrentUser ? ' highlight-row' : ''}`} key={entry.id || entry.uid}>
                <div className="leaderboard-rank">#{index + 1}</div>
                <div className="leaderboard-main">
                  <div>
                    <h3>{entry.displayName}</h3>
                    <p className="muted-copy">{entry.levelTitle || t('leaderboard.defaultLevel')}</p>
                  </div>
                  <div className="leaderboard-metrics">
                    <span>
                      {t('leaderboard.provinceProgress', {
                        visited: entry.visitedProvinceCount || entry.provincesVisited || 0,
                        total: data.provinceCount
                      })}
                    </span>
                    <span>
                      {t('leaderboard.verifiedCheckins', { count: formatCompactNumber(entry.verifiedCheckinCount || 0) })}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
