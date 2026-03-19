const runtimeConfig = globalThis.__VIETWANDER_CONFIG__ || {};

export const googleMapsApiKey = runtimeConfig.VITE_GOOGLE_MAPS_API_KEY || '';
export const googleMapsEnabled = Boolean(googleMapsApiKey);

let googleMapsPromise = null;

export const vietnamGoogleMapBounds = {
  north: 23.7,
  south: 8.2,
  west: 102.0,
  east: 109.9
};

export const cartoonGoogleMapStyles = [
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#d0d7d5' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#eef8ec' }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#f7f1da' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#d8f2d9' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#d9e4de' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#cfeeff' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4f8ba9' }]
  }
];

export function loadGoogleMapsApi() {
  if (!googleMapsEnabled) {
    return Promise.resolve(null);
  }

  if (globalThis.google?.maps) {
    return Promise.resolve(globalThis.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-vietwander-google-maps]');

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(globalThis.google?.maps || null), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Không thể tải Google Maps.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(googleMapsApiKey)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.vietwanderGoogleMaps = 'true';
    script.onload = () => resolve(globalThis.google?.maps || null);
    script.onerror = () => reject(new Error('Không thể tải Google Maps.'));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

export function createStickerMarkerIcon({ color = '#2bee7c', label = '•', active = false } = {}) {
  const size = active ? 72 : 62;
  const halo = active ? '#fff8cf' : '#ffffff';
  const textColor = active ? '#0d2415' : '#102218';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 72 72">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="rgba(16,34,24,0.24)"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <circle cx="36" cy="36" r="26" fill="${halo}"/>
        <circle cx="36" cy="36" r="20" fill="${color}" stroke="#ffffff" stroke-width="4"/>
        <path d="M36 55L29 67L43 67Z" fill="${color}" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>
      </g>
      <text x="36" y="41" text-anchor="middle" font-size="22" font-family="Plus Jakarta Sans, Arial, sans-serif" font-weight="800" fill="${textColor}">${label}</text>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new globalThis.google.maps.Size(size, size),
    anchor: new globalThis.google.maps.Point(size / 2, size - 4)
  };
}
