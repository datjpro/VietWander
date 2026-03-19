import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProvinceMap } from './ProvinceMap.jsx';
import { buildGoogleMapsSearchUrl, decorateProvinces, getShowcaseProvinces } from '../lib/province-map-data.js';
import {
  cartoonGoogleMapStyles,
  createStickerMarkerIcon,
  googleMapsEnabled,
  loadGoogleMapsApi,
  vietnamGoogleMapBounds
} from '../lib/google-maps.js';
import { useI18n } from '../providers/I18nProvider.jsx';
import { useSettings } from '../providers/SettingsProvider.jsx';

function getMarkerLabel(province) {
  return province?.code?.slice(0, 2) || province?.name?.slice(0, 1)?.toUpperCase() || '•';
}

export function HomeHeroMap({ provinces = [], posts = [], activeProvinceId = '', onProvinceSelect }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { settings } = useSettings();
  const mapCanvasRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const routeRef = useRef(null);
  const haloRef = useRef(null);
  const onProvinceSelectRef = useRef(onProvinceSelect);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapError, setMapError] = useState('');

  const decoratedProvinces = useMemo(() => decorateProvinces(provinces), [provinces]);
  const activeProvince = useMemo(
    () => decoratedProvinces.find((province) => province.id === activeProvinceId) || decoratedProvinces[0] || null,
    [activeProvinceId, decoratedProvinces]
  );
  const showcaseProvinces = useMemo(
    () => getShowcaseProvinces(decoratedProvinces, activeProvince),
    [activeProvince, decoratedProvinces]
  );
  const previewImage = activeProvince?.imageUrl || posts[0]?.photoUrl || posts[0]?.imageUrl;
  const mapsUrl = useMemo(
    () => buildGoogleMapsSearchUrl(activeProvince?.location, activeProvince?.fullName || activeProvince?.name),
    [activeProvince]
  );
  const mediaCount = Math.max(posts.length, activeProvince?.landmarks?.length || 4) * 32;

  useEffect(() => {
    onProvinceSelectRef.current = onProvinceSelect;
  }, [onProvinceSelect]);

  useEffect(() => {
    let disposed = false;

    if (!googleMapsEnabled) {
      setMapsReady(false);
      return undefined;
    }

    loadGoogleMapsApi()
      .then((maps) => {
        if (disposed || !maps || !mapCanvasRef.current) {
          return;
        }

        if (!mapRef.current) {
          const map = new maps.Map(mapCanvasRef.current, {
            center: { lat: 15.9031, lng: 106.8067 },
            zoom: 5.6,
            minZoom: 4.9,
            maxZoom: 9,
            disableDefaultUI: true,
            zoomControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            clickableIcons: false,
            gestureHandling: 'greedy',
            styles: cartoonGoogleMapStyles,
            restriction: {
              latLngBounds: vietnamGoogleMapBounds,
              strictBounds: false
            },
            backgroundColor: '#eef8ec'
          });

          map.fitBounds(vietnamGoogleMapBounds, 60);
          mapRef.current = map;
        }

        setMapsReady(true);
      })
      .catch((error) => {
        if (!disposed) {
          setMapError(error instanceof Error ? error.message : 'Không thể tải Google Maps.');
          setMapsReady(false);
        }
      });

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    if (!mapsReady || !mapRef.current || !globalThis.google?.maps) {
      return;
    }

    const map = mapRef.current;
    const googleMaps = globalThis.google.maps;
    const markerEntries = markersRef.current;

    decoratedProvinces.forEach((province) => {
      if (!province.location?.lat || !province.location?.lng) {
        return;
      }

      let marker = markerEntries.get(province.id);

      if (!marker) {
        marker = new googleMaps.Marker({
          map,
          position: province.location,
          title: province.fullName || province.name,
          optimized: true
        });

        marker.addListener('click', () => {
          onProvinceSelectRef.current?.(province.id);
        });

        markerEntries.set(province.id, marker);
      }

      marker.setPosition(province.location);
      marker.setZIndex(province.id === activeProvince?.id ? 300 : 120);
      marker.setIcon(
        createStickerMarkerIcon({
          color: province.themeColor,
          label: getMarkerLabel(province),
          active: province.id === activeProvince?.id
        })
      );
    });

    Array.from(markerEntries.keys()).forEach((provinceId) => {
      if (!decoratedProvinces.some((province) => province.id === provinceId)) {
        markerEntries.get(provinceId)?.setMap(null);
        markerEntries.delete(provinceId);
      }
    });

    const routePath = showcaseProvinces
      .filter((province) => province.location?.lat && province.location?.lng)
      .map((province) => province.location);

    if (!routeRef.current) {
      routeRef.current = new googleMaps.Polyline({
        map,
        strokeColor: '#ff9d5c',
        strokeOpacity: 0.88,
        strokeWeight: 4,
        geodesic: true,
        icons: [
          {
            icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 0.65,
              scale: 3
            },
            offset: '0',
            repeat: '18px'
          }
        ]
      });
    }

    routeRef.current.setPath(routePath);

    if (!haloRef.current) {
      haloRef.current = new googleMaps.Circle({
        map,
        radius: 34000,
        strokeOpacity: 0.9,
        strokeWeight: 3,
        fillOpacity: 0.15
      });
    }

    if (activeProvince?.location) {
      haloRef.current.setCenter(activeProvince.location);
      haloRef.current.setOptions({
        strokeColor: activeProvince.themeColor,
        fillColor: activeProvince.themeColor
      });
      map.panTo(activeProvince.location);
      map.setZoom(Math.max(map.getZoom() || 5.8, 6));
    }
  }, [activeProvince, decoratedProvinces, mapsReady, showcaseProvinces]);

  function handleZoom(delta) {
    if (!mapRef.current) {
      return;
    }

    const currentZoom = mapRef.current.getZoom() || 5.6;
    mapRef.current.setZoom(currentZoom + delta);
  }

  if (!googleMapsEnabled || mapError) {
    return (
      <div className="home-hero-map-fallback">
        <div className="home-map-status-row">
          <span className="status-chip">{t('home.fallbackBadge')}</span>
          <span className="muted-copy">{mapError || t('home.fallbackDescription')}</span>
        </div>
        <ProvinceMap activeProvinceId={activeProvinceId} posts={posts} provinces={decoratedProvinces} variant="showcase" />
      </div>
    );
  }

  return (
    <div className="showcase-map-shell google-showcase-shell">
      <div className="showcase-map-stage google-showcase-stage">
        <div className="showcase-google-frame">
          <div className="showcase-google-canvas" ref={mapCanvasRef} />
          <div className="showcase-map-decor showcase-cloud decor-cloud-a" aria-hidden="true" />
          <div className="showcase-map-decor showcase-cloud decor-cloud-b" aria-hidden="true" />
          <div className="showcase-map-decor showcase-wave-ribbon" aria-hidden="true" />
          <div className="showcase-map-decor showcase-doodle-loop" aria-hidden="true" />
          <div className="showcase-map-mode-pill">{t('home.mapMode')}</div>
          {!mapsReady ? <div className="showcase-map-loading">{t('home.mapLoading')}</div> : null}
        </div>

        <article className="showcase-floating-card showcase-floating-card--google">
          <div className="showcase-floating-head">
            <div>
              <h3>{activeProvince?.fullName || activeProvince?.name}</h3>
              <p>{activeProvince?.region || t('home.liveRegionFallback')}</p>
            </div>
            <span className="showcase-status-pill">{t('home.regionBadge')}</span>
          </div>

          {previewImage ? <img alt={activeProvince?.name} className="showcase-floating-image" src={previewImage} /> : null}

          <p className="muted-copy showcase-floating-copy">{activeProvince?.description}</p>

          <div className="showcase-floating-tags">
            {(activeProvince?.popularTags || []).slice(0, 3).map((tag) => (
              <span className="map-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="showcase-floating-footer">
            <div className="showcase-media-count">
              <span className="material-symbols-outlined">photo_camera</span>
              <span>{mediaCount}</span>
            </div>
            <div className="showcase-inline-actions">
              {settings.preferences.showLocation && mapsUrl ? (
                <a className="showcase-link-button" href={mapsUrl} rel="noreferrer" target="_blank">
                  {t('common.openGoogleMaps')}
                </a>
              ) : null}
              <button className="showcase-card-button" onClick={() => navigate(`/province/${activeProvince?.id}`)} type="button">
                {t('common.viewCollection')}
              </button>
            </div>
          </div>
        </article>

        <button className="showcase-checkin-button" onClick={() => navigate('/checkin')} type="button">
          <span className="material-symbols-outlined">add_location_alt</span>
          <span>{t('home.checkinNow')}</span>
        </button>

        <div className="showcase-zoom-controls">
          <button className="demo-icon-button soft-button" onClick={() => handleZoom(1)} type="button" aria-label={t('common.zoomIn')}>
            <span className="material-symbols-outlined">add</span>
          </button>
          <button className="demo-icon-button soft-button" onClick={() => handleZoom(-1)} type="button" aria-label={t('common.zoomOut')}>
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>

        <div className="showcase-chip-row" role="list" aria-label={t('home.featuredProvinces')}>
          {decoratedProvinces.map((province) => (
            <button
              className={`showcase-chip${province.id === activeProvince?.id ? ' is-active' : ''}`}
              key={province.id}
              onClick={() => onProvinceSelect?.(province.id)}
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
