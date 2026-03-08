const runtimeConfig = globalThis.__VIETWANDER_CONFIG__ || {};

function resolveDefaultApiBaseUrl() {
  if (runtimeConfig.VITE_API_BASE_URL) {
    return runtimeConfig.VITE_API_BASE_URL;
  }

  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://localhost:4000';
  }

  return '';
}

export const apiBaseUrl = resolveDefaultApiBaseUrl().replace(/\/$/, '');

async function readJson(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

export function getHealth() {
  return request('/health');
}

export async function getProvinces() {
  const payload = await request('/api/provinces');
  return payload.items || [];
}

export function getProvince(provinceId) {
  return request(`/api/provinces/${provinceId}`);
}

export async function getProvincePosts(provinceId, limit = 10) {
  const payload = await request(`/api/provinces/${provinceId}/posts?limit=${limit}`);
  return payload.items || [];
}

export async function getFeed({ provinceId = '', userId = '', limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (provinceId) params.set('provinceId', provinceId);
  if (userId) params.set('userId', userId);
  if (limit) params.set('limit', String(limit));
  const payload = await request(`/api/feed?${params.toString()}`);
  return payload.items || [];
}

export async function getLeaderboard(limit = 10) {
  const payload = await request(`/api/leaderboard?limit=${limit}`);
  return payload.items || [];
}

export function getUser(userId) {
  return request(`/api/users/${userId}`);
}

export function upsertUser(userId, input) {
  return request(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(input)
  });
}

export async function getCheckins({ userId = '', provinceId = '', limit = 20 } = {}) {
  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  if (provinceId) params.set('provinceId', provinceId);
  if (limit) params.set('limit', String(limit));
  const payload = await request(`/api/checkins?${params.toString()}`);
  return payload.items || [];
}

export function createCheckin(input) {
  return request('/api/checkins', {
    method: 'POST',
    body: JSON.stringify(input)
  });
}

export function bootstrapDemoData() {
  return request('/api/bootstrap/demo-data', {
    method: 'POST'
  });
}
