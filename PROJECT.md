# VietWander - Lang thang Việt Nam

## 1. Định vị sản phẩm

**VietWander** là ứng dụng mobile du lịch tập trung vào 3 trục giá trị chính:

- **Khám phá Việt Nam qua bản đồ hoạt họa**: trực quan, vui, dễ tương tác.
- **Check-in có bằng chứng**: ảnh thật, vị trí thật, sưu tầm thật.
- **Cộng đồng theo địa điểm**: feed và nội dung gắn chặt với tỉnh/thành, địa danh.

### Vì sao ý tưởng này có tiềm năng

- Tâm lý người dùng Việt rất hợp với hành vi `đi - chụp - đăng - khoe - sưu tầm`.
- Bản đồ tỉnh/thành tạo cảm giác tiến độ rõ ràng, dễ gamify hơn feed du lịch thông thường.
- Có thể phát triển từ content app sang community app, sau đó mới mở rộng commerce.

### Điểm khác biệt nên giữ

- Không chỉ là app xem địa điểm, mà là **travel collecting app**.
- Feed theo địa danh/tỉnh giúp nội dung có ngữ cảnh, ít loãng hơn social feed tổng hợp.
- Mini-map cá nhân và badge tỉnh là hook giữ chân rất tốt.

## 2. Gợi ý cải tiến để MVP mạnh hơn

### 2.1. Chốt rõ Core Loop

Core loop nên là:

1. Mở app -> thấy bản đồ và tiến độ đã đi.
2. Chọn tỉnh -> xem landmark nổi bật.
3. Tới nơi -> check-in bằng ảnh + GPS.
4. Nhận badge/xp -> đăng feed -> tương tác cộng đồng.
5. Quay lại app để săn tỉnh tiếp theo.

Nếu giữ loop này rõ, app sẽ ít bị "ôm đồm" quá sớm.

### 2.2. Nên bổ sung 3 lớp check-in

Thay vì chỉ có 1 loại check-in, nên có 3 mức:

- **Verified check-in**: GPS trong bán kính cho phép + ảnh tải lên.
- **Photo-only check-in**: có ảnh nhưng không đủ GPS.
- **Manual save**: người dùng đánh dấu muốn đi hoặc đã đi nhưng chưa xác minh.

Lợi ích:

- Không làm rớt conversion khi GPS lỗi.
- Vẫn giữ được hệ thống phần thưởng minh bạch.
- Sau này dễ tách quyền lợi badge/leaderboard theo mức xác thực.

### 2.3. Nên thêm Wishlist và Trip Plan ngay từ đầu

Ngoài `Đã đến`, nên có:

- `Muốn đi`
- `Lịch trình sắp đi`

Vì phần lớn người dùng mới chưa có nhiều check-in, wishlist giúp app vẫn hữu ích từ ngày đầu.

### 2.4. Tách 2 loại content

Nên tách rõ:

- **Curated content**: địa danh, mô tả, tips, ảnh bìa.
- **UGC content**: ảnh/video check-in, caption, comment.

Không trộn 2 nhóm này trong cùng một document schema vì vòng đời dữ liệu khác nhau hoàn toàn.

### 2.5. Moderation là bắt buộc từ MVP

Với app có ảnh/video người dùng, cần tối thiểu:

- report post/comment
- ẩn nội dung vi phạm
- chặn spam hashtag/caption
- rate limit like/comment/check-in

Nếu bỏ qua moderation sớm, feed địa phương rất dễ thành spam board.

### 2.6. Offline nên giới hạn thông minh

Không nên làm offline toàn app ở MVP. Chỉ cần:

- tải trước dữ liệu tỉnh
- cache landmark và ảnh thumbnail
- lưu bản đồ mini cá nhân và badge

Feed realtime và video có thể để online-only ở MVP.

## 3. Phạm vi MVP khuyến nghị

Để 1-2 dev làm khả thi, MVP nên giới hạn:

- 8-12 tỉnh/thành nổi bật
- 50-120 landmark được biên tập tay
- check-in ảnh + GPS
- feed ảnh trước, chưa cần video ngắn ngay
- like/comment cơ bản
- badge tỉnh + level user
- mini-map bộ sưu tập cá nhân

### Không nên đưa ngay vào MVP

- AR/360 độ thật sự tương tác
- video editor phức tạp
- chatbot tư vấn du lịch
- itinerary AI tự động hoàn chỉnh
- Mapbox vector tile phức tạp nếu đội còn mỏng

## 4. Kiến trúc sản phẩm đề xuất

### Frontend

- `React Native + Expo` (managed workflow)
- `Expo Router` cho navigation
- `react-native-svg` cho cartoon map MVP
- `react-native-reanimated` + `react-native-gesture-handler` cho pan/zoom
- `Zustand` cho local UI state
- `TanStack Query` hoặc custom Firestore hooks cho cache dữ liệu đọc nhiều

### Backend / Infra

- `Firebase Auth`
- `Cloud Firestore`
- `Firebase Storage`
- `Cloud Functions` cho counter, feed fan-out nhẹ, moderation pipeline, leaderboard sync
- `Firebase Remote Config` cho feature flag
- `Firebase Analytics` + `Crashlytics`

### Dịch vụ ngoài nên tích hợp sau cùng

- `Google Maps deep link` để dẫn đường
- thời tiết qua API ngoài
- push notification qua `Expo Notifications`

## 5. Firestore schema chi tiết

Thiết kế dưới đây ưu tiên:

- đọc nhanh ở mobile
- realtime cho feed/comment
- dễ scale tới vài trăm nghìn user
- giảm truy vấn join nhiều tầng

---

### 5.1. `users`

Document ID: `uid`

```json
{
  "displayName": "To Dat",
  "username": "todat.travel",
  "photoURL": "https://...",
  "bio": "Lang thang săn hoàng hôn Việt Nam",
  "homeProvinceId": "dnang",
  "visitedProvinceCount": 12,
  "verifiedCheckinCount": 34,
  "photoCheckinCount": 41,
  "level": 5,
  "levelTitle": "Nhà thám hiểm",
  "xp": 2480,
  "badges": ["province_hanoi", "province_danang"],
  "roles": ["user"],
  "preferences": {
    "language": "vi",
    "showLocation": true,
    "autoplayVideo": false,
    "offlineProvinceIds": ["danang", "hanoi"]
  },
  "stats": {
    "postCount": 15,
    "followerCount": 120,
    "followingCount": 98,
    "likeReceivedCount": 840
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "lastActiveAt": "timestamp"
}
```

Subcollections:

- `users/{uid}/visited_provinces/{provinceId}`
- `users/{uid}/saved_landmarks/{landmarkId}`
- `users/{uid}/wishlist_landmarks/{landmarkId}`
- `users/{uid}/notifications/{notificationId}`
- `users/{uid}/followers/{followerUid}`
- `users/{uid}/following/{followingUid}`

Ví dụ `visited_provinces`:

```json
{
  "provinceId": "danang",
  "firstCheckinAt": "timestamp",
  "lastCheckinAt": "timestamp",
  "verifiedCheckinCount": 3,
  "collectedLandmarkCount": 5,
  "badgeUnlocked": true,
  "coverImageUrl": "https://..."
}
```

---

### 5.2. `provinces`

Document ID nên dùng slug ổn định, ví dụ `hanoi`, `danang`, `lamdong`.

```json
{
  "name": "Đà Nẵng",
  "slug": "da-nang",
  "code": "DN",
  "region": "mien-trung",
  "countryCode": "VN",
  "map": {
    "svgId": "province_danang",
    "centroid": { "lat": 16.0471, "lng": 108.2068 },
    "bounds": {
      "north": 16.194,
      "south": 15.95,
      "east": 108.31,
      "west": 108.05
    }
  },
  "hero": {
    "title": "Thành phố đáng sống bên bờ biển",
    "shortDescription": "Biển đẹp, cầu biểu tượng, ẩm thực dễ mê.",
    "coverImageUrl": "https://...",
    "gradient": ["#5BC0EB", "#FDE74C"]
  },
  "stats": {
    "landmarkCount": 18,
    "postCount": 4200,
    "verifiedCheckinCount": 980
  },
  "tags": ["bien", "am-thuc", "thanh-pho", "gia-dinh"],
  "featuredLandmarkIds": ["dragon-bridge", "my-khe-beach"],
  "isPublished": true,
  "updatedAt": "timestamp"
}
```

Subcollections:

- `provinces/{provinceId}/daily_stats/{yyyyMMdd}`
- `provinces/{provinceId}/leaderboard/{uid}`
- `provinces/{provinceId}/feed_cache/{postId}`

`feed_cache` là optional nếu muốn tối ưu đọc feed theo tỉnh mà không query toàn bộ `posts`.

---

### 5.3. `landmarks`

Document ID: slug landmark, ví dụ `dragon-bridge`.

```json
{
  "provinceId": "danang",
  "name": "Cầu Rồng",
  "slug": "cau-rong",
  "type": "landmark",
  "categories": ["cau", "city-icon", "night-view"],
  "shortDescription": "Biểu tượng nổi bật của Đà Nẵng, đẹp nhất về đêm.",
  "fullDescription": "...",
  "address": "Đường Nguyễn Văn Linh, Đà Nẵng",
  "location": {
    "lat": 16.0613,
    "lng": 108.2272,
    "geohash": "..."
  },
  "geofence": {
    "radiusMeters": 250,
    "strictRadiusMeters": 120
  },
  "media": {
    "coverImageUrl": "https://...",
    "gallery": ["https://...", "https://..."],
    "preview360Url": null,
    "arAssetUrl": null
  },
  "practicalInfo": {
    "openHours": "all-day",
    "ticketPrice": 0,
    "bestTime": "19:00-22:00",
    "visitDurationMinutes": 45
  },
  "ugcStats": {
    "postCount": 860,
    "checkinCount": 320,
    "averageRating": 4.7
  },
  "hashtags": ["#CauRongCheckin", "#DanangCheckin"],
  "isPublished": true,
  "updatedAt": "timestamp"
}
```

Subcollections:

- `landmarks/{landmarkId}/tips/{tipId}`
- `landmarks/{landmarkId}/featured_posts/{postId}`

---

### 5.4. `checkins`

Document ID: auto-id

```json
{
  "userId": "uid_123",
  "provinceId": "danang",
  "landmarkId": "dragon-bridge",
  "postId": "post_123",
  "type": "verified",
  "status": "published",
  "imageUrl": "https://...",
  "thumbnailUrl": "https://...",
  "caption": "Lần đầu ngắm Cầu Rồng phun lửa",
  "hashtags": ["#DanangCheckin", "#CauRongCheckin"],
  "location": {
    "lat": 16.0612,
    "lng": 108.2274,
    "geohash": "...",
    "accuracyMeters": 18
  },
  "verification": {
    "gpsMatched": true,
    "distanceToLandmarkMeters": 42,
    "photoAttached": true,
    "verifiedAt": "timestamp"
  },
  "visibility": "public",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Index nên có:

- `userId + createdAt desc`
- `provinceId + createdAt desc`
- `landmarkId + createdAt desc`
- `provinceId + type + createdAt desc`

---

### 5.5. `posts`

`posts` là collection trung tâm cho social feed.

```json
{
  "userId": "uid_123",
  "provinceId": "danang",
  "landmarkId": "dragon-bridge",
  "checkinId": "checkin_123",
  "type": "image",
  "media": {
    "imageUrl": "https://...",
    "videoUrl": null,
    "thumbnailUrl": "https://...",
    "width": 1080,
    "height": 1350
  },
  "caption": "Đà Nẵng tối nay đẹp quá",
  "hashtags": ["#DanangCheckin", "#CauRongCheckin"],
  "autoHashtags": ["#DanangCheckin"],
  "stats": {
    "likeCount": 132,
    "commentCount": 11,
    "saveCount": 8,
    "viewCount": 1040
  },
  "author": {
    "displayName": "To Dat",
    "username": "todat.travel",
    "photoURL": "https://...",
    "levelTitle": "Nhà thám hiểm"
  },
  "place": {
    "provinceName": "Đà Nẵng",
    "landmarkName": "Cầu Rồng"
  },
  "ranking": {
    "hotScore": 98.2,
    "recentScore": 0.88
  },
  "status": "published",
  "visibility": "public",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Subcollections:

- `posts/{postId}/comments/{commentId}`
- `posts/{postId}/likes/{uid}`

Ví dụ `comments`:

```json
{
  "userId": "uid_456",
  "displayName": "Minh Anh",
  "photoURL": "https://...",
  "content": "Góc này đẹp quá luôn",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "status": "published"
}
```

Index quan trọng cho `posts`:

- `provinceId + createdAt desc`
- `landmarkId + createdAt desc`
- `userId + createdAt desc`
- `provinceId + ranking.hotScore desc`
- `provinceId + type + createdAt desc`
- `status + visibility + createdAt desc`

---

### 5.6. `leaderboards`

Nếu muốn đơn giản, có thể lưu theo province hoặc period.

Document ID ví dụ: `province_danang_week_2026w10`

```json
{
  "scope": "province",
  "provinceId": "danang",
  "period": "weekly",
  "periodKey": "2026w10",
  "updatedAt": "timestamp",
  "entries": [
    {
      "userId": "uid_123",
      "displayName": "To Dat",
      "photoURL": "https://...",
      "score": 120,
      "verifiedCheckinCount": 8,
      "rank": 1
    }
  ]
}
```

Với MVP, lưu snapshot leaderboard như trên là đủ. Khi scale mới tách thành collection con.

---

### 5.7. `notifications`

Có thể đặt dưới user hoặc collection riêng. Với mobile app, đặt dưới user thường tiện hơn.

```json
{
  "type": "like",
  "actorUserId": "uid_456",
  "postId": "post_123",
  "provinceId": "danang",
  "title": "Minh Anh đã thích bài check-in của bạn",
  "isRead": false,
  "createdAt": "timestamp"
}
```

---

### 5.8. `reports`

Rất nên có từ đầu.

```json
{
  "targetType": "post",
  "targetId": "post_123",
  "reporterUserId": "uid_777",
  "reason": "spam",
  "description": "Nội dung quảng cáo lặp lại",
  "status": "open",
  "createdAt": "timestamp"
}
```

---

### 5.9. `app_config`

Document ví dụ `app_config/public`

```json
{
  "featuredProvinceIds": ["hanoi", "danang", "hochiminh"],
  "mvpProvinceIds": ["hanoi", "danang", "quangnam", "lamdong", "khanhhoa"],
  "gamification": {
    "xpPerVerifiedCheckin": 30,
    "xpPerComment": 2,
    "xpPerProvinceBadge": 100
  }
}
```

## 6. Quy ước dữ liệu và best practices Firestore

### Nên denormalize có kiểm soát

Ví dụ trong `posts` nên lưu sẵn:

- `author.displayName`
- `author.photoURL`
- `place.provinceName`
- `place.landmarkName`

Mục tiêu là giảm round-trip ở mobile feed.

### Counter không nên cập nhật trực tiếp từ client

`likeCount`, `commentCount`, `verifiedCheckinCount`, `leaderboard score` nên cập nhật qua:

- Cloud Functions trigger
- transaction/callable function

### Tách quyền ghi curated data và UGC

- Client chỉ được ghi `posts`, `checkins`, `comments`, `likes` trong phạm vi an toàn.
- `provinces`, `landmarks`, `app_config` chỉ admin/CMS mới sửa.

## 7. Gợi ý Firestore Security Rules

Mức tối thiểu cho MVP:

- User chỉ sửa document `users/{uid}` của chính họ.
- Chỉ user đăng nhập mới tạo post/check-in/comment/like.
- Không cho client tự sửa counter aggregate.
- Không cho client sửa `provinceId`, `landmarkId`, `userId` của post sau khi đã tạo.
- Curated collections chỉ read công khai, write bởi admin.

## 8. UI/UX flow chính

### 8.1. Luồng tổng thể

```text
Splash
-> Onboarding
-> Chọn sở thích / tỉnh muốn khám phá
-> Đăng nhập
-> Home
   -> Bản đồ Việt Nam
   -> Feed theo tỉnh
   -> Bộ sưu tập của tôi
   -> Hồ sơ / Huy hiệu
```

### 8.2. Navigation đề xuất

Bottom tabs:

- `Home`
- `Map`
- `Check-in`
- `Feed`
- `Profile`

### `Home`

Hiển thị:

- progress card: `Bạn đã đi 8/63 tỉnh`
- tỉnh đang hot
- landmark đề xuất gần đây
- hành trình sắp tới / wishlist
- CTA `Khám phá trên bản đồ`

### `Map`

Hiển thị:

- bản đồ Việt Nam hoạt họa full screen
- màu khác nhau cho: chưa đi / đã lưu / đã đi / đã verified
- thanh tìm kiếm tỉnh hoặc landmark
- chip lọc theo vùng: Bắc / Trung / Nam / Biển / Núi

Tương tác:

- tap tỉnh -> highlight + bottom sheet preview
- tap lần 2 hoặc kéo bottom sheet -> vào trang chi tiết tỉnh
- pinch zoom + pan

### `Province Detail`

Sections nên có:

- hero banner + số landmark + số người đang check-in
- top landmarks
- feed mới nhất tại tỉnh
- badge progress của tỉnh
- CTA `Dẫn đường`, `Lưu để đi`, `Xem feed`, `Check-in`

### `Landmark Detail`

Hiển thị:

- ảnh đẹp, mô tả ngắn, practical info
- bản đồ mini + khoảng cách tới bạn
- community gallery
- CTA `Check-in ngay`

### `Check-in`

Luồng nên gọn như sau:

1. Xác định tỉnh/landmark gần bạn.
2. Chụp hoặc upload ảnh.
3. Auto gợi ý caption và hashtag.
4. Xác minh GPS.
5. Publish post hoặc lưu private vào bộ sưu tập.

Màn hình này nên hiển thị rõ:

- mức xác thực: Verified / Photo-only
- điểm XP nhận được
- badge sắp mở khóa

### `Feed`

Nên có 3 tab con:

- `Gần đây`
- `Hot tại tỉnh`
- `Đang ở đây`

Mặc định feed nên ưu tiên tỉnh user đang xem hoặc đang ở gần, thay vì global feed toàn quốc.

### `Profile`

Hiển thị:

- avatar, level, xp
- mini-map bộ sưu tập tỉnh
- badge grid
- thống kê tỉnh đã đi, landmark đã check-in
- post grid

## 9. Nguyên tắc UI/UX quan trọng

### 9.1. Thiết kế mang cảm giác sưu tầm

Nên dùng:

- màu sáng, tươi, giàu cảm xúc du lịch
- badge dạng sticker/postcard
- hiệu ứng mở khóa tỉnh thật "đã"

### 9.2. Tối ưu thao tác 1 tay

Vì người dùng thường check app khi đang di chuyển, các CTA chính nên nằm trong tầm ngón tay cái:

- bottom sheet actions
- floating `Check-in`
- quick action `Dẫn đường`

### 9.3. Tránh overload thông tin

Trang tỉnh không nên nhồi hết mọi thứ. Ưu tiên thứ tự:

1. cảm hứng
2. hành động
3. chi tiết

## 10. Code mẫu React Native Expo cho bản đồ hoạt họa clickable

UI hiện được triển khai trong `frontend/` với các màn hình chính tại:

- `frontend/app/(tabs)/index.tsx`
- `frontend/app/province/[provinceId].tsx`
- `frontend/src/components/HomeMapCard.tsx`

Phiên bản hiện tại ưu tiên web/mobile UI trước. Nếu muốn quay lại hướng bản đồ SVG tương tác đầy đủ theo tỉnh, có thể tiếp tục mở rộng từ component FE hiện có bằng `react-native-svg` + `react-native-reanimated` + `react-native-gesture-handler`.

Điểm phù hợp cho MVP:

- không cần dựng vector tile phức tạp
- bám sát asset SVG từ designer
- dễ highlight từng tỉnh
- dễ gắn trạng thái `visited`, `selected`, `locked`

Khi mở rộng:

- vẫn giữ SVG nếu trọng tâm là illustrated map
- chỉ chuyển sang `@rnmapbox/maps` nếu cần geospatial layer phức tạp, route overlay, cluster lớn hoặc bản đồ thật nhiều trạng thái động

## 11. Kế hoạch phát triển MVP cho team 1-2 dev

### 11.1. Phạm vi giả định

- 1 designer part-time hoặc founder tự chốt UI
- 1 full-stack mobile dev chính
- 1 dev phụ part-time hoặc backend/mobile hybrid
- 8-12 tỉnh trong phase đầu

### 11.2. Timeline thực tế

#### Phương án gọn: 10-12 tuần

**Tuần 1-2**

- chốt product scope
- wireflow + design system nhẹ
- setup Expo, Firebase, auth, CI cơ bản

**Tuần 3-4**

- dựng cartoon map tương tác
- provinces, landmarks, data seed
- province detail + landmark detail

**Tuần 5-6**

- check-in flow
- upload ảnh, GPS verify, storage
- mini-map bộ sưu tập cá nhân

**Tuần 7-8**

- social feed theo tỉnh
- like, comment, hashtag auto
- profile + badge + level

**Tuần 9-10**

- leaderboard cơ bản
- analytics, crash logging
- polish UX, cache, offline lite

**Tuần 11-12**

- QA
- closed beta
- store assets và release prep

#### Phương án an toàn hơn: 14-16 tuần

Nên dùng nếu:

- muốn chất lượng animation tốt
- muốn moderation ổn từ đầu
- cần cả iOS và Android beta chỉn chu

### 11.3. Ước tính chi phí

Tùy chất lượng team ở Việt Nam, có thể ước tính như sau:

#### Team 1 dev full-stack mạnh + founder hỗ trợ

- `120 - 220 triệu VND` cho MVP khá gọn

#### Team 2 dev

- 1 mobile dev
- 1 full-stack/firebase dev part-time hoặc full-time
- `220 - 450 triệu VND`

#### Nếu có thêm designer chuyên sản phẩm

- cộng thêm khoảng `40 - 120 triệu VND` tùy phạm vi và số vòng refine

#### Chi phí vận hành hàng tháng ban đầu

- Firebase: có thể rất thấp lúc đầu, khoảng `1 - 8 triệu VND/tháng`
- Storage tăng theo ảnh/video UGC
- công cụ thiết kế, domain, store account, analytics: `1 - 3 triệu VND/tháng`

## 12. Monetization phù hợp thị trường Việt Nam

Không nên monetize quá sớm bằng paywall nặng. Giai đoạn đầu nên ưu tiên tăng retention và UGC.

### 12.1. Hướng 1: Freemium

Miễn phí phần cốt lõi, thu phí cho:

- album không giới hạn
- map theme hiếm
- badge frame đặc biệt
- thống kê hành trình nâng cao
- backup ảnh chất lượng cao

### 12.2. Hướng 2: Affiliate du lịch

Rất hợp với app du lịch Việt Nam:

- vé tham quan
- khách sạn
- tour local
- thuê xe
- eSIM

Nên chỉ hiện affiliate sau khi user xem landmark hoặc hoàn tất check-in, tránh phá trải nghiệm.

### 12.3. Hướng 3: Sponsored province / local campaign

Ví dụ:

- chiến dịch `Mùa hoa Đà Lạt`
- `Săn biển đẹp Phú Yên`
- `Lễ hội pháo hoa Đà Nẵng`

Đây là nguồn doanh thu B2B tiềm năng nếu app có community đúng địa phương.

### 12.4. Hướng 4: Brand collaboration

- hãng máy ảnh/điện thoại
- local coffee chain
- homestay chain
- hãng xe khách/airline

## 13. Marketing ban đầu tại Việt Nam

### 13.1. Positioning message

Thông điệp nên rõ:

**"Check-in, sưu tầm và khám phá trọn bản đồ Việt Nam."**

Đừng chỉ nói "app du lịch" vì quá rộng và khó nhớ.

### 13.2. Kênh tăng trưởng sớm

#### TikTok / Reels / Shorts

Nội dung rất hợp để lan truyền:

- `1 tỉnh - 3 điểm check-in đẹp`
- `Bản đồ của tôi đã sáng lên 12 tỉnh`
- `Đi Đà Nẵng thì phải mở khóa những badge nào?`

#### Cộng đồng Facebook

- nhóm review du lịch Việt Nam
- nhóm camping/trekking/phượt
- cộng đồng nhiếp ảnh và săn ảnh đẹp

#### KOL/KOC micro creator

Nên ưu tiên creator `5k - 50k followers` theo từng niche:

- du lịch bụi
- cắm trại
- food review địa phương
- nhiếp ảnh di động

#### Campus ambassador

Sinh viên rất hợp game sưu tầm và check-in. Có thể làm mini campaign:

- `Trường nào mở khóa nhiều tỉnh nhất`
- `30 ngày check-in hè`

### 13.3. Growth loop nên thiết kế ngay trong sản phẩm

Mỗi check-in nên tạo được 1 nội dung dễ chia sẻ:

- card `Tôi đã mở khóa Đà Nẵng`
- mini-map cá nhân tháng này
- badge mới nhận

Đây là viral loop rẻ nhất cho giai đoạn đầu.

## 14. Rủi ro chính và cách giảm thiểu

### Rủi ro 1: Thiếu nội dung ban đầu

Giải pháp:

- curate tay 8-12 tỉnh đầu thật chất lượng
- dùng ảnh bìa đẹp, mô tả ngắn gọn, có tips thực tế

### Rủi ro 2: Feed trống khi mới launch

Giải pháp:

- seeding bằng creator địa phương
- hiển thị gallery curated xen kẽ UGC
- dùng community highlights thay vì chỉ feed thời gian thực

### Rủi ro 3: Check-in giả

Giải pháp:

- 3 lớp xác thực
- reward khác nhau theo verified/photo/manual
- không để leaderboard dựa hoàn toàn vào self-report

### Rủi ro 4: Quá nhiều feature cho team nhỏ

Giải pháp:

- bám chặt MVP
- chậm mà đúng loop còn hơn nhiều tính năng rời rạc

## 15. Roadmap sau MVP

### Phase 2

- mở đủ 63 tỉnh/thành
- video feed
- follow user
- trip plan và recommendation tốt hơn

### Phase 3

- collab với local business
- in-app challenges theo mùa
- AR preview chọn lọc ở landmark nổi bật
- AI itinerary theo ngân sách và thời gian

## 16. Kết luận

VietWander có cơ hội tốt nếu định vị là:

- **ứng dụng sưu tầm hành trình Việt Nam**
- không chỉ là app xem địa điểm
- không chỉ là mạng xã hội ảnh

Đối với MVP, nên tập trung cực mạnh vào 4 thứ:

1. cartoon map tương tác đẹp và mượt
2. check-in ảnh + GPS thật đơn giản
3. feed theo tỉnh có cảm giác sống động
4. bộ sưu tập badge tạo động lực quay lại

Nếu 4 trụ này làm tốt, app có thể tạo được retention và bản sắc rất riêng tại thị trường Việt Nam.
