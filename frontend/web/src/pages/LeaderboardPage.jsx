import { useAsyncData } from '../hooks/useAsyncData.js';
import { getLeaderboard, getProvinces } from '../lib/api.js';
import { demoLeaderboard, demoProvinces } from '../lib/demo-data.js';
import { formatCompactNumber } from '../lib/utils.js';
import { useAuth } from '../providers/AuthProvider.jsx';

export function LeaderboardPage() {
  const { user } = useAuth();
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

  return (
    <div className="page-section-stack">
      <section className="page-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Gamification</p>
            <h1>Leaderboard check-in tỉnh</h1>
            <p className="muted-copy">Xếp hạng dựa trên số tỉnh đã ghé và số check-in xác thực.</p>
          </div>
          <button className="button ghost-button" onClick={reload} type="button">
            Tải lại
          </button>
        </div>
        {error ? <div className="banner warning-banner">{error}</div> : null}
        {loading ? <div className="banner info-banner">Đang tải bảng xếp hạng...</div> : null}
        <div className="leaderboard-list">
          {data.entries.map((entry, index) => {
            const isCurrentUser = user?.uid && (entry.uid === user.uid || entry.id === user.uid);
            return (
              <article className={`leaderboard-row${isCurrentUser ? ' highlight-row' : ''}`} key={entry.id || entry.uid}>
                <div className="leaderboard-rank">#{index + 1}</div>
                <div className="leaderboard-main">
                  <div>
                    <h3>{entry.displayName}</h3>
                    <p className="muted-copy">{entry.levelTitle || 'Du khách'}</p>
                  </div>
                  <div className="leaderboard-metrics">
                    <span>
                      {entry.visitedProvinceCount || entry.provincesVisited || 0}/{data.provinceCount} tỉnh
                    </span>
                    <span>{formatCompactNumber(entry.verifiedCheckinCount || 0)} check-in</span>
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
