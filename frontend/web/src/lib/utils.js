export function formatCompactNumber(value) {
  const numericValue = Number(value || 0);

  if (numericValue >= 1000) {
    return `${(numericValue / 1000).toFixed(numericValue >= 10000 ? 0 : 1).replace('.0', '')}k`;
  }

  return String(numericValue);
}

export function formatDate(value) {
  if (!value) {
    return 'Mới cập nhật';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Mới cập nhật';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function getLevelTitle(visitedProvinceCount = 0) {
  if (visitedProvinceCount >= 45) return 'Huyền thoại xuyên Việt';
  if (visitedProvinceCount >= 20) return 'Nhà thám hiểm';
  if (visitedProvinceCount >= 8) return 'Người săn hành trình';
  return 'Du khách';
}

export function slugify(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function groupLatestByProvince(items = []) {
  const grouped = new Map();

  [...items]
    .sort((left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime())
    .forEach((item) => {
      if (!grouped.has(item.provinceId)) {
        grouped.set(item.provinceId, item);
      }
    });

  return [...grouped.values()];
}
