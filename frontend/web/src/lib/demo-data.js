import { vietnamProvinces } from './vietnam-provinces.js';

export const demoProvinces = vietnamProvinces;

export const demoPosts = [
  {
    id: 'post-demo-1',
    userId: 'demo-alex',
    authorName: 'Alex Nguyen',
    provinceId: 'da-nang',
    provinceName: 'Đà Nẵng',
    landmarkName: 'Cầu Rồng',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cầu Rồng lên đèn siêu đẹp, đúng chất lang thang miền Trung.',
    hashtag: '#DaNangCheckin',
    likesCount: 12,
    commentsCount: 3,
    createdAt: '2026-03-08T00:00:00.000Z'
  },
  {
    id: 'post-demo-2',
    userId: 'demo-linh',
    authorName: 'Linh Cao',
    provinceId: 'ha-noi',
    provinceName: 'Hà Nội',
    landmarkName: 'Hồ Hoàn Kiếm',
    photoUrl: 'https://images.unsplash.com/photo-1507952006320-7f61cf0e0d8d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sáng sớm quanh hồ là lúc Hà Nội đẹp nhất.',
    hashtag: '#HaNoiCheckin',
    likesCount: 19,
    commentsCount: 5,
    createdAt: '2026-03-08T00:00:00.000Z'
  }
];

export const demoLeaderboard = [
  {
    id: 'demo-linh',
    uid: 'demo-linh',
    displayName: 'Linh Cao',
    visitedProvinceCount: 24,
    verifiedCheckinCount: 52,
    levelTitle: 'Nhà thám hiểm',
    badges: ['HN', 'DN', 'HCM']
  },
  {
    id: 'demo-alex',
    uid: 'demo-alex',
    displayName: 'Alex Nguyen',
    visitedProvinceCount: 18,
    verifiedCheckinCount: 34,
    levelTitle: 'Nhà thám hiểm',
    badges: ['HN', 'DN', 'HCM']
  }
];

export const demoCheckins = [
  {
    id: 'checkin-demo-1',
    userId: 'demo-alex',
    provinceId: 'da-nang',
    provinceName: 'Đà Nẵng',
    landmarkName: 'Cầu Rồng',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Check-in demo tại Cầu Rồng.',
    createdAt: '2026-03-08T00:00:00.000Z'
  }
];

export const demoHealth = {
  service: 'vietwander-backend',
  status: 'demo',
  databaseMode: 'offline-demo'
};
