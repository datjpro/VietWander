import { vietnamProvinces } from '../../../frontend/web/src/lib/vietnam-provinces.js';

const now = '2026-03-08T00:00:00.000Z';

export const seedProvinces = vietnamProvinces;

export const seedUsers = [
  {
    id: 'demo-alex',
    uid: 'demo-alex',
    displayName: 'Alex Nguyen',
    username: 'alex.langthang',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    email: 'alex@example.com',
    level: 5,
    levelTitle: 'Nhà thám hiểm',
    provincesVisited: 18,
    visitedProvinceCount: 18,
    verifiedCheckinCount: 34,
    badges: ['HN', 'DN', 'HCM'],
    createdAt: now,
    lastActive: now,
    updatedAt: now
  },
  {
    id: 'demo-linh',
    uid: 'demo-linh',
    displayName: 'Linh Cao',
    username: 'linh.travels',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    email: 'linh@example.com',
    level: 7,
    levelTitle: 'Nhà thám hiểm',
    provincesVisited: 24,
    visitedProvinceCount: 24,
    verifiedCheckinCount: 52,
    badges: ['HN', 'DN', 'HCM'],
    createdAt: now,
    lastActive: now,
    updatedAt: now
  }
];

export const seedPosts = [
  {
    id: 'post-demo-1',
    userId: 'demo-alex',
    userUid: 'demo-alex',
    authorName: 'Alex Nguyen',
    provinceId: 'da-nang',
    provinceName: 'Đà Nẵng',
    landmarkId: 'dragon-bridge',
    landmarkName: 'Cầu Rồng',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cầu Rồng lên đèn siêu đẹp, đúng chất VietWander.',
    hashtag: '#DaNangCheckin',
    isPublic: true,
    likesCount: 12,
    commentsCount: 3,
    createdAt: now
  },
  {
    id: 'post-demo-2',
    userId: 'demo-linh',
    userUid: 'demo-linh',
    authorName: 'Linh Cao',
    provinceId: 'ha-noi',
    provinceName: 'Hà Nội',
    landmarkId: 'hoan-kiem',
    landmarkName: 'Hồ Hoàn Kiếm',
    photoUrl: 'https://images.unsplash.com/photo-1507952006320-7f61cf0e0d8d?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1507952006320-7f61cf0e0d8d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sáng sớm quanh hồ là lúc Hà Nội đẹp nhất.',
    hashtag: '#HaNoiCheckin',
    isPublic: true,
    likesCount: 19,
    commentsCount: 5,
    createdAt: now
  }
];

export const seedCheckins = [
  {
    id: 'checkin-demo-1',
    userId: 'demo-alex',
    provinceId: 'da-nang',
    provinceName: 'Đà Nẵng',
    landmarkId: 'dragon-bridge',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Check-in Cầu Rồng siêu đẹp!',
    location: { lat: 16.0613, lng: 108.227 },
    createdAt: now,
    likesCount: 12,
    commentsCount: 3
  }
];
