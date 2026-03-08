# Hướng dẫn kết nối VietWander với Firebase

File này hướng dẫn bạn kết nối toàn bộ dự án `VietWander` với Firebase, gồm:
- `frontend/web`
- `frontend/mobile`
- `backend`
- deploy lên `Firebase Hosting + Firebase Functions`

## 1. Chuẩn bị trong Firebase Console

Vào Firebase Console và tạo hoặc mở project của bạn.

Bạn cần bật các dịch vụ sau:

1. **Authentication**
   - bật `Email/Password`
2. **Firestore Database**
   - tạo database
3. **Storage**
   - tạo bucket lưu ảnh
4. **Project Settings**
   - lấy thông tin Web App config nếu cần thay đổi project hiện tại

## 2. File cấu hình đã có sẵn trong repo

Repo này đã có sẵn các file hỗ trợ Firebase:

- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `.firebaserc.example`
- `backend/.env.example`
- `frontend/web/.env.example`
- `frontend/mobile/.env.example`
- `backend/index.js`

## 3. Kết nối `frontend/web`

Web đang dùng Firebase Web SDK tại:
- `frontend/web/src/lib/firebase.js`
- `frontend/web/src/lib/api.js`

### Cách cấu hình

Tạo file:

```bash
frontend/web/.env
```

Ví dụ:

```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

### Lưu ý

- Khi chạy local, giữ `VITE_API_BASE_URL=http://localhost:4000`
- Khi deploy lên Firebase Hosting + Functions, bạn có thể để trống `VITE_API_BASE_URL`
- Khi đó frontend sẽ gọi API cùng domain qua rewrite trong `firebase.json`

## 4. Kết nối `frontend/mobile`

Mobile đang dùng Firebase client SDK trong phần app mobile.

Tạo file:

```bash
frontend/mobile/.env
```

Ví dụ:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

Nếu bạn đổi sang một Firebase project khác, hãy cập nhật `.env` này và các file native tương ứng.

### Với Android

Bạn cần file:

```bash
google-services.json
```

### Với iOS

Bạn cần file:

```bash
GoogleService-Info.plist
```

### Lưu ý

- `google-services.json` và `GoogleService-Info.plist` chỉ dùng cho mobile app
- 2 file này **không dùng cho backend**
- không commit các file native này nếu không muốn chia sẻ cấu hình project

## 5. Kết nối `backend`

Backend dùng Firebase Admin SDK.

Các file chính:
- `backend/src/config/env.js`
- `backend/src/config/firebase-admin.js`
- `backend/src/repositories/firestore-repository.js`
- `backend/index.js`

### Chạy local backend với Firestore thật

Tạo file:

```bash
backend/.env
```

Ví dụ:

```bash
PORT=4000
USE_MEMORY_DB=false
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.firebasestorage.app
```

### Nếu dùng file Service Account JSON

Bạn có thể dùng thêm:

```bash
GOOGLE_APPLICATION_CREDENTIALS=D:/path/to/service-account.json
```

Khuyến nghị đặt file JSON này **ngoài repo** để tránh commit nhầm.

### Lưu ý quan trọng

- Backend **không dùng** `google-services.json`
- Backend cần **Firebase Admin credentials**
- Không dán `private_key` hoặc Service Account JSON vào mã nguồn/frontend
- Nếu thiếu config, backend sẽ fallback sang `memory` mode

## 6. Chạy local để kiểm tra kết nối

### Chạy backend

```bash
npm run dev:api
```

### Chạy web

```bash
npm run dev:web
```

### Kiểm tra nhanh backend

Mở:

```bash
http://localhost:4000/health
```

Và:

```bash
http://localhost:4000/api/provinces
```

Nếu backend đang kết nối Firestore thành công, dữ liệu sẽ đọc/ghi từ Firestore thay vì memory.

## 7. Deploy lên Firebase

### Bước 1: đăng nhập Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Bước 2: chọn project

Tạo file `.firebaserc` từ `.firebaserc.example` hoặc chạy:

```bash
firebase use --add
```

Ví dụ `.firebaserc`:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### Bước 3: build web

```bash
npm run build:web
```

### Bước 4: deploy

```bash
firebase deploy
```

Hoặc deploy riêng từng phần:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase deploy --only functions
firebase deploy --only hosting
```

## 8. Sau khi deploy, kiểm tra gì

Kiểm tra các URL sau:

- `https://YOUR_DOMAIN/health`
- `https://YOUR_DOMAIN/api/provinces`
- `https://YOUR_DOMAIN/`

Nếu cả 3 hoạt động, nghĩa là:
- Hosting chạy
- Function backend chạy
- rewrite từ Hosting sang backend chạy

## 9. Khi nào backend sẽ dùng Firestore thật?

Backend sẽ dùng Firestore thật khi:

- `USE_MEMORY_DB=false`
- có đủ Admin credentials
- hoặc đang chạy trong Firebase Functions runtime

Nếu không đủ điều kiện, backend sẽ dùng `memory` mode.

## 10. Checklist ngắn

Trước khi chạy thật, hãy xác nhận:

- [ ] Firebase project đã tạo
- [ ] Authentication đã bật
- [ ] Firestore đã tạo
- [ ] Storage đã tạo
- [ ] `frontend/web/.env` đã cấu hình
- [ ] `frontend/mobile/.env` đã cấu hình nếu mobile dùng Firebase project này
- [ ] `backend/.env` đã cấu hình nếu chạy local
- [ ] `npm run build:web` chạy thành công
- [ ] `firebase deploy` chạy thành công

## 11. File nên đọc thêm

- `FIREBASE_SETUP.md`
- `backend/README.md`
- `firebase.json`

## 12. Gợi ý production

Nếu đưa lên production, nên làm thêm:

- xác thực Firebase ID token cho các route ghi dữ liệu
- giới hạn CORS theo domain thật
- tắt hoặc bảo vệ route seed/demo
- thêm logging và monitoring cho Functions
