import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VIETNAM_MAP_VIEWBOX,
  buildGoogleMapsSearchUrl,
  buildItineraryPoints,
  decorateProvinces,
  getMarkerIcon,
  getShowcaseProvinces,
  projectLocation,
  vietnamMapRegionOrder
} from '../lib/province-map-data.js';

export function ProvinceMap({ provinces = [], activeProvinceId = '', posts = [], variant = 'default' }) {
  const navigate = useNavigate();
  const decoratedProvinces = useMemo(() => decorateProvinces(provinces), [provinces]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(activeProvinceId || 'da-nang');

  useEffect(() => {
    if (activeProvinceId) {
      setSelectedProvinceId(activeProvinceId);
      return;
    }

    if (!decoratedProvinces.some((province) => province.id === selectedProvinceId)) {
      setSelectedProvinceId(decoratedProvinces.find((province) => province.id === 'da-nang')?.id || decoratedProvinces[0]?.id || 'ha-noi');
    }
  }, [activeProvinceId, decoratedProvinces, selectedProvinceId]);

  const focusedProvince = useMemo(
    () => decoratedProvinces.find((province) => province.id === (activeProvinceId || selectedProvinceId)) || decoratedProvinces[0],
    [activeProvinceId, decoratedProvinces, selectedProvinceId]
  );
  const regionStats = useMemo(() => {
    const summary = new Map();

    decoratedProvinces.forEach((province) => {
      const current = summary.get(province.region) || { label: province.region, count: 0, color: province.themeColor };
      current.count += 1;
      current.color = province.themeColor;
      summary.set(province.region, current);
    });

    return vietnamMapRegionOrder.map((region) => summary.get(region)).filter(Boolean);
  }, [decoratedProvinces]);
  const itineraryPoints = useMemo(() => buildItineraryPoints(decoratedProvinces), [decoratedProvinces]);
  const landmarkCount = useMemo(
    () => decoratedProvinces.reduce((total, province) => total + (province.landmarks?.length || 0), 0),
    [decoratedProvinces]
  );
  const showcaseMarkers = useMemo(() => getShowcaseProvinces(decoratedProvinces, focusedProvince), [decoratedProvinces, focusedProvince]);
  const previewImage = focusedProvince?.imageUrl || posts[0]?.photoUrl || posts[0]?.imageUrl;
  const mediaCount = Math.max(posts.length, focusedProvince?.landmarks?.length || 4) * 32;
  const mapsUrl = useMemo(
    () => buildGoogleMapsSearchUrl(focusedProvince?.location, focusedProvince?.fullName || focusedProvince?.name),
    [focusedProvince]
  );

  const mapSvg = (
    <svg
      className={`vietnam-map${variant === 'showcase' ? ' showcase-map-svg' : ''}`}
      viewBox={`0 0 ${VIETNAM_MAP_VIEWBOX.width} ${VIETNAM_MAP_VIEWBOX.height}`}
      role="img"
      aria-label="Bản đồ Việt Nam hoạt họa đầy đủ"
    >
      <defs>
        <linearGradient id="mapSeaGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#eef8ff" />
          <stop offset="100%" stopColor="#dff4ff" />
        </linearGradient>
        <linearGradient id="mapLandGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#dff9e7" />
          <stop offset="100%" stopColor="#fff1d9" />
        </linearGradient>
        <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor="rgba(16,34,24,0.16)" />
        </filter>
      </defs>

      <rect className="map-sea" width={VIETNAM_MAP_VIEWBOX.width} height={VIETNAM_MAP_VIEWBOX.height} rx="36" />
      <ellipse className="map-cloud" cx="108" cy="118" rx="64" ry="28" />
      <ellipse className="map-cloud" cx="402" cy="176" rx="52" ry="24" />
      <ellipse className="map-cloud" cx="396" cy="732" rx="72" ry="30" />

      <path
        className="map-silhouette"
        d="M248 28C297 44 330 94 326 148C323 193 292 226 307 262C323 300 344 342 332 391C318 450 340 506 323 560C307 610 289 665 272 804C259 777 244 759 220 741C195 722 181 695 183 665C186 621 210 587 193 547C175 506 153 468 160 419C166 369 193 333 188 287C183 237 171 190 189 148C205 111 221 68 248 28Z"
        filter="url(#mapShadow)"
      />
      <path className="map-coastline" d="M269 52C296 112 305 168 299 216C294 254 319 303 310 347C301 392 316 442 307 493C300 536 282 606 256 765" />
      <polyline className="map-itinerary" points={itineraryPoints} />

      <g className="map-archipelago">
        <circle cx="410" cy="460" r="8" />
        <circle cx="430" cy="492" r="5" />
        <text x="394" y="446">Hoàng Sa</text>
        <circle cx="426" cy="596" r="9" />
        <circle cx="446" cy="624" r="6" />
        <text x="404" y="580">Trường Sa</text>
      </g>

      {decoratedProvinces.map((province, index) => {
        const point = projectLocation(province.location, index);
        const isFocused = focusedProvince?.id === province.id;
        const isActive = activeProvinceId === province.id;
        const labelOnLeft = point.x > 286;

        return (
          <g
            className={`map-node${isFocused ? ' is-focused' : ''}${isActive ? ' is-active' : ''}`}
            key={province.id}
            onClick={() => navigate(`/province/${province.id}`)}
            onFocus={() => setSelectedProvinceId(province.id)}
            onMouseEnter={() => setSelectedProvinceId(province.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                navigate(`/province/${province.id}`);
              }
            }}
            style={{ '--province-color': province.themeColor }}
          >
            <circle className="map-node-halo" cx={point.x} cy={point.y} r={isFocused ? 15 : 10} />
            <circle className="map-node-core" cx={point.x} cy={point.y} r={isFocused ? 7 : 5} />
            {variant === 'default' ? (
              <text
                className="map-node-label"
                x={labelOnLeft ? point.x - 12 : point.x + 12}
                y={point.y + (index % 2 === 0 ? -10 : 18)}
                textAnchor={labelOnLeft ? 'end' : 'start'}
              >
                {province.code}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );

  if (variant === 'showcase') {
    return (
      <div className="showcase-map-shell">
        <div className="showcase-map-stage">
          <div className="showcase-map-frame">{mapSvg}</div>

          {showcaseMarkers.map((province, index) => {
            const point = projectLocation(province.location, index);
            return (
              <button
                className={`showcase-marker${focusedProvince?.id === province.id ? ' is-active' : ''}`}
                key={province.id}
                onClick={() => setSelectedProvinceId(province.id)}
                style={{ left: `${(point.x / VIETNAM_MAP_VIEWBOX.width) * 100}%`, top: `${(point.y / VIETNAM_MAP_VIEWBOX.height) * 100}%` }}
                type="button"
              >
                <span className="material-symbols-outlined">{getMarkerIcon(province, index)}</span>
              </button>
            );
          })}

          <article className="showcase-floating-card">
            <div className="showcase-floating-head">
              <div>
                <h3>{focusedProvince?.fullName || focusedProvince?.name}</h3>
                <p>{focusedProvince?.region || 'Vietnam'}</p>
              </div>
              <span className="showcase-status-pill">CHECKED IN</span>
            </div>

            {previewImage ? <img alt={focusedProvince?.name} className="showcase-floating-image" src={previewImage} /> : null}

            <div className="showcase-floating-footer">
              <div className="showcase-media-count">
                <span className="material-symbols-outlined">photo_camera</span>
                <span>{mediaCount}</span>
              </div>
              <button className="showcase-card-button" onClick={() => navigate(`/province/${focusedProvince?.id}`)} type="button">
                View Collection
              </button>
            </div>
          </article>

          <button className="showcase-checkin-button" onClick={() => navigate('/checkin')} type="button">
            <span className="material-symbols-outlined">add_location_alt</span>
            <span>CHECK-IN NOW</span>
          </button>

          <div className="showcase-zoom-controls">
            <button className="demo-icon-button soft-button" type="button" aria-label="Zoom in">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="demo-icon-button soft-button" type="button" aria-label="Zoom out">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-card">
      <div className="map-story-panel">
        <div className="map-card-copy">
          <p className="eyebrow">Cartoon atlas · live province data</p>
          <h2>Bản đồ Việt Nam hoạt họa đầy đủ theo bộ dữ liệu hiện hành</h2>
          <p className="muted-copy">
            Component lấy danh sách từ <code>/api/provinces</code>, tự bù metadata còn thiếu và dựng lại thành bản đồ Việt Nam theo
            phong cách minh họa với cụm vùng, đường hành trình và điểm nhấn từng tỉnh.
          </p>
        </div>

        <div className="map-stat-grid">
          <article className="map-stat-card">
            <strong>{decoratedProvinces.length}</strong>
            <span>Tỉnh/thành hiển thị</span>
          </article>
          <article className="map-stat-card">
            <strong>{regionStats.length}</strong>
            <span>Vùng du lịch</span>
          </article>
          <article className="map-stat-card">
            <strong>{landmarkCount}</strong>
            <span>Điểm landmark</span>
          </article>
        </div>

        <div className="map-legend">
          {regionStats.map((region) => (
            <button className={`map-region-pill${focusedProvince?.region === region.label ? ' is-active' : ''}`} key={region.label} type="button">
              {region.label} · {region.count}
            </button>
          ))}
        </div>

        {focusedProvince ? (
          <article className="map-focus-card" style={{ '--province-accent': focusedProvince.themeColor }}>
            <div className="map-focus-header">
              <div className="map-focus-icon" aria-hidden="true">
                {focusedProvince.cartoonIcon}
              </div>
              <div>
                <p className="eyebrow">{focusedProvince.region}</p>
                <h3>{focusedProvince.fullName || focusedProvince.name}</h3>
              </div>
            </div>
            <p className="muted-copy">{focusedProvince.description}</p>
            <div className="map-focus-meta">
              <span className="pill">{focusedProvince.code}</span>
              <span className="pill">{focusedProvince.landmarks?.[0]?.name || 'Đang cập nhật landmark'}</span>
            </div>
            <div className="map-tag-list">
              {(focusedProvince.popularTags || []).slice(0, 3).map((tag) => (
                <span className="map-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="hero-actions wrap-row">
              <button className="button primary-button" onClick={() => navigate(`/province/${focusedProvince.id}`)} type="button">
                Xem chi tiết tỉnh
              </button>
              {mapsUrl ? (
                <a className="button ghost-button" href={mapsUrl} rel="noreferrer" target="_blank">
                  Mở trên Google Maps
                </a>
              ) : null}
            </div>
          </article>
        ) : null}
      </div>

      <div className="map-visual-shell">
        <div className="map-visual">{mapSvg}</div>

        <div className="map-chip-grid">
          {decoratedProvinces.map((province) => (
            <button
              className={`map-chip${focusedProvince?.id === province.id ? ' is-active' : ''}`}
              key={province.id}
              onClick={() => setSelectedProvinceId(province.id)}
              type="button"
            >
              <span aria-hidden="true">{province.cartoonIcon || '📍'}</span>
              <span>{province.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
