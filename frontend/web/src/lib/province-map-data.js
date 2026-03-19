import { vietnamProvinces } from './vietnam-provinces.js';

export const VIETNAM_MAP_VIEWBOX = { width: 520, height: 860 };

export const vietnamMapBounds = {
  minLat: 8.5,
  maxLat: 23.4,
  minLng: 102.1,
  maxLng: 109.5
};

export const vietnamMapRegionOrder = [
  'Bắc Bộ',
  'Đồng bằng Bắc Bộ',
  'Bắc Trung Bộ',
  'Nam Trung Bộ',
  'Tây Nguyên',
  'Đông Nam Bộ',
  'Tây Nam Bộ'
];

const provinceReference = new Map(vietnamProvinces.map((province) => [province.id, province]));

export function mergeProvince(sourceProvince = {}) {
  const fallback = provinceReference.get(sourceProvince.id) || {};

  return {
    ...fallback,
    ...sourceProvince,
    location:
      sourceProvince.location ||
      fallback.location ||
      sourceProvince.landmarks?.[0] ||
      fallback.landmarks?.[0] ||
      null,
    landmarks: sourceProvince.landmarks?.length ? sourceProvince.landmarks : fallback.landmarks || [],
    popularTags: sourceProvince.popularTags?.length ? sourceProvince.popularTags : fallback.popularTags || [],
    region: sourceProvince.region || fallback.region || 'Bắc Bộ',
    themeColor: sourceProvince.themeColor || fallback.themeColor || '#2bee7c',
    cartoonIcon: sourceProvince.cartoonIcon || fallback.cartoonIcon || '📍'
  };
}

export function decorateProvinces(provinces = []) {
  const merged = provinces.map(mergeProvince);
  const missing = vietnamProvinces.filter((province) => !merged.some((item) => item.id === province.id));
  const nextItems = provinces.length >= 20 ? merged : [...merged, ...missing];

  return nextItems
    .map(mergeProvince)
    .sort((left, right) => {
      const leftLat = left.location?.lat ?? 0;
      const rightLat = right.location?.lat ?? 0;

      if (rightLat !== leftLat) {
        return rightLat - leftLat;
      }

      return (left.location?.lng ?? 0) - (right.location?.lng ?? 0);
    });
}

export function projectLocation(point, index = 0) {
  if (!point) {
    return { x: 230 + (index % 2) * 24, y: 110 + index * 18 };
  }

  const lngRatio = (point.lng - vietnamMapBounds.minLng) / (vietnamMapBounds.maxLng - vietnamMapBounds.minLng);
  const latRatio = (vietnamMapBounds.maxLat - point.lat) / (vietnamMapBounds.maxLat - vietnamMapBounds.minLat);
  const coastalWave = Math.sin(latRatio * Math.PI * 1.25) * 14;

  return {
    x: 156 + lngRatio * 186 + coastalWave,
    y: 72 + latRatio * 700
  };
}

export function buildItineraryPoints(provinces = []) {
  return provinces
    .map((province, index) => projectLocation(province.location, index))
    .map((point) => `${point.x},${point.y}`)
    .join(' ');
}

export function getMarkerIcon(province, index) {
  if (province?.region?.includes('Trung')) return 'temple_buddhist';
  if (province?.region?.includes('Nam')) return 'restaurant';
  return index % 2 === 0 ? 'landscape' : 'castle';
}

export function buildGoogleMapsSearchUrl(location, label = '') {
  if (!location?.lat || !location?.lng) {
    return '';
  }

  const query = encodeURIComponent(label ? `${label} ${location.lat},${location.lng}` : `${location.lat},${location.lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getShowcaseProvinces(provinces = [], focusedProvince = null) {
  const picks = [provinces[2], focusedProvince, provinces[Math.max(0, provinces.length - 3)]].filter(Boolean);
  return picks.filter((province, index, items) => items.findIndex((item) => item.id === province.id) === index);
}
