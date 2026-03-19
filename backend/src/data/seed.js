import { vietnamProvinces } from '../../../frontend/web/src/lib/vietnam-provinces.js';

const baseTime = new Date('2026-03-18T14:00:00.000Z').getTime();
const provinceById = new Map(vietnamProvinces.map((province) => [province.id, province]));

export const seedProvinces = vietnamProvinces;

const demoTravelerJourney = [
  {
    id: 'checkin-demo-traveler-1',
    provinceId: 'ha-noi',
    caption: 'Săn bình minh quanh Hồ Hoàn Kiếm, đủ chất mở màn cho hành trình xuyên Việt.',
    photoUrl: 'https://images.unsplash.com/photo-1507952006320-7f61cf0e0d8d?auto=format&fit=crop&w=1200&q=80',
    location: { lat: 21.0287, lng: 105.852 },
    likesCount: 24,
    commentsCount: 6,
    hoursAgo: 216
  },
  {
    id: 'checkin-demo-traveler-2',
    provinceId: 'quang-ninh',
    caption: 'Đi thuyền trên vịnh Hạ Long lúc trời hửng nắng, khung hình nào cũng đẹp.',
    photoUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    location: { lat: 20.9101, lng: 107.1839 },
    likesCount: 31,
    commentsCount: 8,
    hoursAgo: 188
  },
  {
    id: 'checkin-demo-traveler-3',
    provinceId: 'ninh-binh',
    caption: 'Tam Cốc mùa xanh nhìn như một lớp màu nước trên bản đồ minh họa.',
    photoUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    location: { lat: 20.215, lng: 105.92299 },
    likesCount: 28,
    commentsCount: 7,
    hoursAgo: 164
  },
  {
    id: 'checkin-demo-traveler-4',
    provinceId: 'hue',
    caption: 'Một chiều mưa nhẹ ở Đại Nội, đúng kiểu bưu thiếp cổ điển của miền Trung.',
    photoUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    location: { lat: 16.4637, lng: 107.5909 },
    likesCount: 21,
    commentsCount: 5,
    hoursAgo: 136
  },
  {
    id: 'checkin-demo-traveler-5',
    provinceId: 'da-nang',
    caption: 'Cầu Rồng lên đèn rồi, đây chắc chắn là một trong những điểm dừng nổi bật nhất của demo.',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    location: { lat: 16.0613, lng: 108.227 },
    likesCount: 39,
    commentsCount: 10,
    hoursAgo: 110
  },
  {
    id: 'checkin-demo-traveler-6',
    provinceId: 'khanh-hoa',
    caption: 'Biển Nha Trang hôm nay trong và sáng, rất hợp để đưa lên thẻ nổi ở trang chủ.',
    photoUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    location: { lat: 12.2388, lng: 109.1967 },
    likesCount: 26,
    commentsCount: 4,
    hoursAgo: 82
  },
  {
    id: 'checkin-demo-traveler-7',
    provinceId: 'lam-dong',
    caption: 'Đà Lạt sáng lạnh và có nắng xiên qua rừng thông, bầu không khí rất khác các tỉnh biển.',
    photoUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    location: { lat: 11.9404, lng: 108.4583 },
    likesCount: 18,
    commentsCount: 4,
    hoursAgo: 58
  },
  {
    id: 'checkin-demo-traveler-8',
    provinceId: 'can-tho',
    caption: 'Đổi nhịp sang miền Tây với chợ nổi, đúng tinh thần nhiệm vụ đang mở của demo.',
    photoUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    location: { lat: 10.0452, lng: 105.7469 },
    likesCount: 22,
    commentsCount: 6,
    hoursAgo: 26
  },
  {
    id: 'checkin-demo-traveler-9',
    provinceId: 'ho-chi-minh',
    caption: 'Kết thúc vòng demo ở Sài Gòn với năng lượng phố xá và hành trình ăn đêm.',
    photoUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    location: { lat: 10.7769, lng: 106.7009 },
    likesCount: 33,
    commentsCount: 9,
    hoursAgo: 8
  }
];

const travelerBadges = demoTravelerJourney
  .map((item) => provinceById.get(item.provinceId)?.code)
  .filter(Boolean);

export const seedUsers = [
  {
    id: 'demo-traveler',
    uid: 'demo-traveler',
    displayName: 'Du khách demo',
    username: 'demo.traveler',
    bio: 'Nhân vật demo mặc định của VietWander, chuyên mở đường cho những vòng pitch bản đồ hoạt họa.',
    avatarUrl: 'https://images.unsplash.com/photo-1542204625-de293a2f8ff0?auto=format&fit=crop&w=400&q=80',
    photoURL: 'https://images.unsplash.com/photo-1542204625-de293a2f8ff0?auto=format&fit=crop&w=400&q=80',
    email: 'demo@vietwander.app',
    homeProvinceId: 'da-nang',
    preferences: {
      theme: 'system',
      language: 'vi',
      showLocation: true,
      autoplayVideo: false
    },
    level: 12,
    levelTitle: 'Người săn hành trình',
    provincesVisited: travelerBadges.length,
    visitedProvinceCount: travelerBadges.length,
    verifiedCheckinCount: demoTravelerJourney.length,
    badges: travelerBadges,
    createdAt: new Date(baseTime - 3600 * 1000 * 720).toISOString(),
    lastActive: new Date(baseTime - 3600 * 1000 * 2).toISOString(),
    updatedAt: new Date(baseTime - 3600 * 1000 * 2).toISOString()
  },
  {
    id: 'demo-alex',
    uid: 'demo-alex',
    displayName: 'Alex Nguyen',
    username: 'alex.langthang',
    bio: 'Thích các lịch trình biển - núi và luôn muốn leo hạng trên bảng xếp hạng.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    email: 'alex@example.com',
    homeProvinceId: 'da-nang',
    preferences: {
      theme: 'light',
      language: 'en',
      showLocation: true,
      autoplayVideo: true
    },
    level: 17,
    levelTitle: 'Nhà thám hiểm',
    provincesVisited: 18,
    visitedProvinceCount: 18,
    verifiedCheckinCount: 34,
    badges: ['HN', 'DN', 'HCM', 'KH'],
    createdAt: new Date(baseTime - 3600 * 1000 * 840).toISOString(),
    lastActive: new Date(baseTime - 3600 * 1000 * 5).toISOString(),
    updatedAt: new Date(baseTime - 3600 * 1000 * 5).toISOString()
  },
  {
    id: 'demo-linh',
    uid: 'demo-linh',
    displayName: 'Linh Cao',
    username: 'linh.travels',
    bio: 'Ưa những hành trình dài ngày với bộ ảnh dày và nhịp check-in đều tay.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    email: 'linh@example.com',
    homeProvinceId: 'ha-noi',
    preferences: {
      theme: 'dark',
      language: 'vi',
      showLocation: true,
      autoplayVideo: false
    },
    level: 22,
    levelTitle: 'Nhà thám hiểm',
    provincesVisited: 24,
    visitedProvinceCount: 24,
    verifiedCheckinCount: 52,
    badges: ['HN', 'DN', 'HCM', 'QN', 'LD'],
    createdAt: new Date(baseTime - 3600 * 1000 * 920).toISOString(),
    lastActive: new Date(baseTime - 3600 * 1000 * 4).toISOString(),
    updatedAt: new Date(baseTime - 3600 * 1000 * 4).toISOString()
  }
];

const userById = new Map(seedUsers.map((user) => [user.id, user]));

function requireProvince(provinceId) {
  const province = provinceById.get(provinceId);

  if (!province) {
    throw new Error(`Unknown province seed: ${provinceId}`);
  }

  return province;
}

function createTimestamp(hoursAgo = 0) {
  return new Date(baseTime - hoursAgo * 3600 * 1000).toISOString();
}

function buildProvinceHashtag(province) {
  return `#${province.code || province.name.replace(/\s+/g, '')}Checkin`;
}

function createCheckin(input) {
  const province = requireProvince(input.provinceId);

  return {
    id: input.id,
    userId: input.userId,
    provinceId: province.id,
    provinceName: province.name,
    landmarkId: input.landmarkId || province.landmarks?.[0]?.id || null,
    landmarkName: input.landmarkName || province.landmarks?.[0]?.name || null,
    photoUrl: input.photoUrl || province.imageUrl,
    imageUrl: input.photoUrl || province.imageUrl,
    caption: input.caption,
    location: input.location || province.location || null,
    createdAt: createTimestamp(input.hoursAgo),
    likesCount: input.likesCount ?? 0,
    commentsCount: input.commentsCount ?? 0
  };
}

function createPost(input) {
  const province = requireProvince(input.provinceId);
  const user = userById.get(input.userId);

  return {
    id: input.id,
    userId: input.userId,
    userUid: input.userId,
    authorName: input.authorName || user?.displayName || 'Du khách',
    provinceId: province.id,
    provinceName: province.name,
    landmarkId: input.landmarkId || province.landmarks?.[0]?.id || null,
    landmarkName: input.landmarkName || province.landmarks?.[0]?.name || null,
    photoUrl: input.photoUrl || province.imageUrl,
    imageUrl: input.photoUrl || province.imageUrl,
    caption: input.caption,
    hashtag: input.hashtag || buildProvinceHashtag(province),
    isPublic: true,
    likesCount: input.likesCount ?? 0,
    commentsCount: input.commentsCount ?? 0,
    createdAt: createTimestamp(input.hoursAgo)
  };
}

export const seedCheckins = demoTravelerJourney.map((item) =>
  createCheckin({
    ...item,
    userId: 'demo-traveler'
  })
);

export const seedPosts = [
  ...demoTravelerJourney.map((item) =>
    createPost({
      ...item,
      id: `post-${item.id}`,
      userId: 'demo-traveler'
    })
  ),
  createPost({
    id: 'post-demo-alex-1',
    userId: 'demo-alex',
    provinceId: 'da-nang',
    caption: 'Cầu Rồng cuối tuần vẫn là điểm chụp khiến mình quay lại Đà Nẵng mỗi năm.',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    likesCount: 44,
    commentsCount: 12,
    hoursAgo: 20
  }),
  createPost({
    id: 'post-demo-linh-1',
    userId: 'demo-linh',
    provinceId: 'ha-noi',
    caption: 'Một vòng Hà Nội bằng máy ảnh film và cà phê sáng, quá hợp để mở feed demo.',
    photoUrl: 'https://images.unsplash.com/photo-1507952006320-7f61cf0e0d8d?auto=format&fit=crop&w=1200&q=80',
    likesCount: 51,
    commentsCount: 15,
    hoursAgo: 12
  }),
  createPost({
    id: 'post-demo-linh-2',
    userId: 'demo-linh',
    provinceId: 'khanh-hoa',
    caption: 'Nha Trang đúng kiểu bản đồ pastel ngoài đời thật: biển xanh, nắng vàng, nhịp sống nhẹ tênh.',
    photoUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    likesCount: 47,
    commentsCount: 11,
    hoursAgo: 6
  })
];
