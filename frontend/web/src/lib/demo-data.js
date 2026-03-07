export const demoProvinces = [
  {
    id: 'ha-noi',
    name: 'Hà Nội',
    fullName: 'Thành phố Hà Nội',
    code: 'HN',
    description: 'Thủ đô nghìn năm văn hiến với phố cổ, hồ và ẩm thực đặc sắc.',
    imageUrl: 'https://images.unsplash.com/photo-1507952006320-7f61cf0e0d8d?auto=format&fit=crop&w=1200&q=80',
    popularTags: ['pho-co', 'bun-cha', 'ho-guom'],
    landmarks: [
      { id: 'hoan-kiem', name: 'Hồ Hoàn Kiếm', desc: 'Trái tim của Hà Nội.', lat: 21.0287, lng: 105.852 },
      { id: 'train-street', name: 'Phố Đường Tàu', desc: 'Không gian check-in rất riêng.', lat: 21.0245, lng: 105.8412 }
    ]
  },
  {
    id: 'da-nang',
    name: 'Đà Nẵng',
    fullName: 'Thành phố Đà Nẵng',
    code: 'DN',
    description: 'Thành phố biển trẻ trung với roadtrip đẹp, cầu Rồng và Mỹ Khê.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    popularTags: ['beach', 'dragon-bridge', 'roadtrip'],
    landmarks: [
      { id: 'dragon-bridge', name: 'Cầu Rồng', desc: 'Biểu tượng check-in nổi bật nhất.', lat: 16.0613, lng: 108.227 },
      { id: 'my-khe', name: 'Biển Mỹ Khê', desc: 'Điểm chill ngắm bình minh.', lat: 16.0644, lng: 108.2463 }
    ]
  },
  {
    id: 'ho-chi-minh',
    name: 'Hồ Chí Minh',
    fullName: 'Thành phố Hồ Chí Minh',
    code: 'SG',
    description: 'Trung tâm năng động với skyline hiện đại, cà phê và nhịp sống về đêm.',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    popularTags: ['coffee', 'nightlife', 'citywalk'],
    landmarks: [
      { id: 'bitexco', name: 'Bitexco Tower', desc: 'Điểm nhìn skyline trung tâm.', lat: 10.7717, lng: 106.7041 },
      { id: 'ben-thanh', name: 'Chợ Bến Thành', desc: 'Biểu tượng Sài Gòn.', lat: 10.7726, lng: 106.6981 }
    ]
  }
];

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
    badges: ['HN', 'DN', 'SG']
  },
  {
    id: 'demo-alex',
    uid: 'demo-alex',
    displayName: 'Alex Nguyen',
    visitedProvinceCount: 18,
    verifiedCheckinCount: 34,
    levelTitle: 'Nhà thám hiểm',
    badges: ['HN', 'DN', 'SG']
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
