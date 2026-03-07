# VietWander Backend

Backend này là lớp API tách riêng khỏi `frontend/web` và `frontend/mobile`, dùng cho:

- dữ liệu tỉnh/thành, địa danh và feed theo tỉnh
- check-in, leaderboard và bộ sưu tập “Đã đến”
- seed dữ liệu demo cho Firestore hoặc chạy local bằng memory DB

## Kiến trúc nhanh

- `backend/src/app.js`: khởi tạo Express app và mount API routes
- `backend/src/services/travel-service.js`: business logic theo schema Firestore
- `backend/src/repositories/firestore-repository.js`: đọc/ghi Firestore bằng Firebase Admin SDK
- `backend/src/repositories/memory-repository.js`: fallback local khi chưa có Admin credentials
- `backend/src/data/seed.js`: demo provinces, users, posts, checkins

## Cần gì để chạy với Firestore thật?

Backend **không dùng** `google-services.json` của Android.

Bạn cần **một trong hai cách** sau cho Firebase Admin:

1. Tạo **Service Account** trong Firebase / Google Cloud và lấy JSON key.
2. Hoặc set trực tiếp các biến:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

Nếu chưa có Service Account, backend sẽ tự fallback sang `memory` mode khi thiếu cấu hình hoặc khi bật `USE_MEMORY_DB=true`.

## Cấu hình env

Tạo file `backend/.env` từ `backend/.env.example`.

Ví dụ:

```bash
PORT=4000
USE_MEMORY_DB=false
FIREBASE_PROJECT_ID=vietwander-fdf99
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=vietwander-fdf99.firebasestorage.app
```

Nếu bạn dùng file JSON service account, có thể set thêm:

```bash
GOOGLE_APPLICATION_CREDENTIALS=D:/Demo/VietWander/backend/service-account.json
```

## Chạy local

Từ root workspace:

```bash
npm run dev:api
```

Hoặc chỉ chạy backend:

```bash
npm --workspace @vietwander/backend run dev
```

## Seed dữ liệu demo

Seed trực tiếp từ backend service:

```bash
npm --workspace @vietwander/backend run seed:demo
```

Script này sẽ:

- ghi vào Firestore nếu backend đang ở `firestore` mode
- reset lại dữ liệu demo trong `memory` mode

## API hiện có

- `GET /`
- `GET /health`
- `GET /api`
- `POST /api/bootstrap/demo-data`
- `GET /api/users/:userId`
- `PUT /api/users/:userId`
- `PATCH /api/users/:userId`
- `GET /api/provinces`
- `POST /api/provinces/seed`
- `GET /api/provinces/:provinceId`
- `PUT /api/provinces/:provinceId`
- `GET /api/provinces/:provinceId/posts`
- `GET /api/checkins`
- `POST /api/checkins`
- `GET /api/posts`
- `POST /api/posts`
- `GET /api/leaderboard`
- `GET /api/feed`

## Schema backend đang bám theo

- `users`
- `provinces`
- `checkins`
- `posts`
- `provinces/{provinceId}/posts`

Ngoài schema gốc, backend còn mirror thêm vài field để tương thích UI hiện tại:

- `photoURL`
- `visitedProvinceCount`
- `verifiedCheckinCount`
- `levelTitle`

## Gợi ý bước tiếp theo

- thêm middleware verify Firebase ID token cho các route ghi dữ liệu
- nối `frontend/web` và `frontend/mobile` sang backend API thay vì gọi dữ liệu rời rạc
- thêm Cloud Functions / scheduled jobs cho leaderboard tổng hợp
