# VietWander Backend

Backend này là API Node/Express cho `frontend/web` và `frontend/mobile`.

## Backend hiện hỗ trợ gì

- chạy local bằng Express server ở `backend/src/server.js`
- chạy production trên Firebase Functions qua `backend/index.js`
- dùng Firestore thật khi có Firebase Admin credentials
- tự dùng credentials mặc định khi chạy trong Firebase Functions
- tự fallback sang `memory` mode khi thiếu cấu hình

## Kiến trúc nhanh

- `backend/src/app.js`: tạo Express app và mount route
- `backend/index.js`: export Firebase Function `api`
- `backend/src/repositories/firestore-repository.js`: đọc/ghi Firestore
- `backend/src/repositories/memory-repository.js`: fallback local
- `backend/src/services/travel-service.js`: business logic

## Env cần cho Firestore thật

Tạo `backend/.env` từ `backend/.env.example`.

Ví dụ cho local hoặc server riêng:

```bash
PORT=4000
USE_MEMORY_DB=false
FIREBASE_PROJECT_ID=vietwander-fdf99
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=vietwander-fdf99.firebasestorage.app
```

Lưu ý:
- backend **không dùng** `google-services.json`
- không commit file Service Account JSON hoặc private key vào repo
- nếu chạy trên **Firebase Functions**, bạn có thể dùng credentials mặc định của môi trường
- nếu chạy local hoặc VPS riêng, bạn nên dùng **Service Account** hoặc ưu tiên `GOOGLE_APPLICATION_CREDENTIALS` trỏ tới file JSON nằm ngoài repo

## Chạy local

Từ root workspace:

```bash
npm run dev:api
```

## Seed dữ liệu demo

```bash
npm --workspace @vietwander/backend run seed:demo
```

Script sẽ:
- ghi vào Firestore nếu backend đang ở `firestore` mode
- reset dữ liệu demo nếu backend đang ở `memory` mode

## API hiện có

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

## Deploy lên Firebase

Repo đã cấu hình để Firebase Hosting rewrite:
- `/api/**` -> function `api`
- `/health` -> function `api`

Quy trình cơ bản:

```bash
npm run build:web
firebase deploy
```

Chi tiết đầy đủ xem tại `FIREBASE_SETUP.md`.
