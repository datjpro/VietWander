import { useMemo, useState } from 'react';
import { HomeHeroMap } from '../components/HomeHeroMap.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getFeed, getProvinces } from '../lib/api.js';
import { demoPosts, demoProvinces } from '../lib/demo-data.js';
import { useAuth } from '../providers/AuthProvider.jsx';

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState('da-nang');
  const { isGuest } = useAuth();
  const { data, loading, error } = useAsyncData(
    async () => {
      const [provincesResult, postsResult] = await Promise.allSettled([getProvinces(), getFeed({ limit: 24 })]);

      return {
        provinces: provincesResult.status === 'fulfilled' ? provincesResult.value : demoProvinces,
        posts: postsResult.status === 'fulfilled' ? postsResult.value : demoPosts
      };
    },
    [],
    {
      provinces: demoProvinces,
      posts: demoPosts
    }
  );

  const activeProvince = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (normalized) {
      return (
        data.provinces.find((province) => {
          const haystack = [province.name, province.fullName, province.code, province.region, province.description]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return haystack.includes(normalized);
        }) || data.provinces[0] || demoProvinces[0]
      );
    }

    return (
      data.provinces.find((province) => province.id === selectedProvinceId) ||
      data.provinces.find((province) => province.id === 'da-nang') ||
      data.provinces[0] ||
      demoProvinces[0]
    );
  }, [data.provinces, searchTerm, selectedProvinceId]);

  const provincePosts = useMemo(
    () => data.posts.filter((post) => post.provinceId === activeProvince?.id),
    [activeProvince?.id, data.posts]
  );

  function handleProvinceSelect(provinceId) {
    setSelectedProvinceId(provinceId);
    setSearchTerm('');
  }

  return (
    <div className="page-section-stack demo-homepage">
      {error ? <div className="banner warning-banner">{error}</div> : null}
      {loading ? <div className="banner info-banner">Đang tải bản đồ khám phá...</div> : null}

      <section className="page-card home-showcase-card">
        <div className="home-showcase-toolbar">
          <div className="home-toolbar-stack">
            <label className="home-searchbar" htmlFor="demo-home-search">
              <span className="material-symbols-outlined">search</span>
              <input
                id="demo-home-search"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search cities, landmarks..."
                type="search"
                value={searchTerm}
              />
            </label>
            <div className="home-toolbar-summary">
              <strong>{activeProvince?.fullName || activeProvince?.name}</strong>
              <span>{isGuest ? 'Demo guest đang điều hướng bản đồ live' : 'Bản đồ live đồng bộ theo tỉnh đang chọn'}</span>
            </div>
          </div>

          <div className="home-toolbar-actions">
            <button className="demo-icon-button soft-button" type="button" aria-label="Layers">
              <span className="material-symbols-outlined">layers</span>
            </button>
            <button className="demo-icon-button soft-button" type="button" aria-label="Send">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>

        <HomeHeroMap
          activeProvinceId={activeProvince?.id}
          onProvinceSelect={handleProvinceSelect}
          posts={provincePosts}
          provinces={data.provinces}
        />
      </section>
    </div>
  );
}
