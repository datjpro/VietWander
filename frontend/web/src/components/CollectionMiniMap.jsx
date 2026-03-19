import { useMemo } from 'react';
import { VIETNAM_MAP_VIEWBOX, buildItineraryPoints, decorateProvinces, projectLocation } from '../lib/province-map-data.js';
import { useI18n } from '../providers/I18nProvider.jsx';

export function CollectionMiniMap({ provinces = [], visitedProvinceIds = [] }) {
  const { t } = useI18n();
  const decoratedProvinces = useMemo(() => decorateProvinces(provinces), [provinces]);
  const visitedSet = useMemo(() => new Set(visitedProvinceIds), [visitedProvinceIds]);
  const visitedProvinces = useMemo(
    () => decoratedProvinces.filter((province) => visitedSet.has(province.id)),
    [decoratedProvinces, visitedSet]
  );
  const itineraryPoints = useMemo(() => buildItineraryPoints(visitedProvinces), [visitedProvinces]);

  return (
    <section className="collection-map-card">
      <div className="section-heading-row wrap-row">
        <div>
          <p className="eyebrow">{t('collection.mapEyebrow')}</p>
          <h2>{t('collection.mapTitle')}</h2>
          <p className="muted-copy">{t('collection.mapDescription')}</p>
        </div>
        <div className="collection-map-legend">
          <span className="collection-legend-pill is-visited">{t('collection.legendVisited')}</span>
          <span className="collection-legend-pill">{t('collection.legendWishlist')}</span>
        </div>
      </div>

      <div className="collection-map-shell">
        <svg className="collection-mini-map" viewBox={`0 0 ${VIETNAM_MAP_VIEWBOX.width} ${VIETNAM_MAP_VIEWBOX.height}`} role="img" aria-label={t('collection.mapAria')}>
          <defs>
            <linearGradient id="collectionSeaGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#eff8ff" />
              <stop offset="100%" stopColor="#daf1ff" />
            </linearGradient>
            <linearGradient id="collectionLandGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#eef9ef" />
              <stop offset="100%" stopColor="#fff4df" />
            </linearGradient>
          </defs>

          <rect width={VIETNAM_MAP_VIEWBOX.width} height={VIETNAM_MAP_VIEWBOX.height} rx="34" fill="url(#collectionSeaGradient)" />
          <path
            className="collection-mini-map-land"
            d="M248 28C297 44 330 94 326 148C323 193 292 226 307 262C323 300 344 342 332 391C318 450 340 506 323 560C307 610 289 665 272 804C259 777 244 759 220 741C195 722 181 695 183 665C186 621 210 587 193 547C175 506 153 468 160 419C166 369 193 333 188 287C183 237 171 190 189 148C205 111 221 68 248 28Z"
            fill="url(#collectionLandGradient)"
          />
          {visitedProvinces.length > 1 ? <polyline className="collection-mini-route" points={itineraryPoints} /> : null}

          {decoratedProvinces.map((province, index) => {
            const point = projectLocation(province.location, index);
            const visited = visitedSet.has(province.id);

            return (
              <g className={`collection-mini-node${visited ? ' is-visited' : ''}`} key={province.id}>
                <circle className="collection-mini-node-halo" cx={point.x} cy={point.y} r={visited ? 9 : 6} />
                <circle className="collection-mini-node-core" cx={point.x} cy={point.y} r={visited ? 5 : 3.5} />
              </g>
            );
          })}
        </svg>

        <div className="collection-map-stats">
          <article className="collection-map-stat">
            <strong>{visitedProvinces.length}</strong>
            <span>{t('collection.statVisited')}</span>
          </article>
          <article className="collection-map-stat">
            <strong>{Math.max(0, decoratedProvinces.length - visitedProvinces.length)}</strong>
            <span>{t('collection.waitingCount')}</span>
          </article>
          <article className="collection-map-stat">
            <strong>{visitedProvinces.slice(-1)[0]?.name || 'Hà Nội'}</strong>
            <span>{t('collection.latestPoint')}</span>
          </article>
        </div>
      </div>
    </section>
  );
}
