import { useNavigate } from 'react-router-dom';

const provincePositions = {
  'ha-noi': { x: 120, y: 74 },
  'da-nang': { x: 128, y: 202 },
  'ho-chi-minh': { x: 113, y: 330 }
};

export function ProvinceMap({ provinces = [], activeProvinceId = '' }) {
  const navigate = useNavigate();

  return (
    <div className="map-card">
      <div className="map-card-copy">
        <p className="eyebrow">Bản đồ minh họa</p>
        <h2>Chạm vào một tỉnh để mở chi tiết</h2>
        <p className="muted-copy">
          Bản web dùng SVG minh họa để mô phỏng bản đồ hoạt họa, giữ đúng tinh thần UI trong thư mục `UI` nhưng viết lại bằng React thật.
        </p>
      </div>
      <svg className="vietnam-map" viewBox="0 0 240 420" role="img" aria-label="Bản đồ Việt Nam minh họa">
        <defs>
          <linearGradient id="mapGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#2bee7c" />
            <stop offset="100%" stopColor="#ff8a3d" />
          </linearGradient>
        </defs>
        <path
          className="map-silhouette"
          d="M126 20C160 40 156 80 140 110C168 146 165 184 149 220C167 258 163 314 128 392C114 355 82 326 93 272C76 232 77 190 99 150C90 113 92 74 126 20Z"
        />
        <path className="map-river" d="M127 58C124 117 139 162 132 219C127 266 122 320 128 372" />
        {provinces.map((province, index) => {
          const position = provincePositions[province.id] || { x: 122, y: 140 + index * 40 };
          const isActive = activeProvinceId === province.id;

          return (
            <g
              key={province.id}
              className={`map-node${isActive ? ' is-active' : ''}`}
              onClick={() => navigate(`/province/${province.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  navigate(`/province/${province.id}`);
                }
              }}
            >
              <circle cx={position.x} cy={position.y} r="14" />
              <circle className="map-node-pulse" cx={position.x} cy={position.y} r="20" />
              <text x={position.x + 18} y={position.y + 5}>{province.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
