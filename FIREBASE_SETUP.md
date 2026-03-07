# Khởi tạo Firebase cho VietWander

Repo này đã sẵn sàng cho Firebase client-side ở:
- `frontend/mobile`
- `frontend/web`

## 1) Bạn còn cần gì để khởi tạo DB?

Bạn **không cần thêm Android hay iOS config để tạo Firestore**.
Hiện tại, để app chạy được DB thật, bạn cần đúng 4 thứ trong Firebase Console:

1. **Authentication > Sign-in method**
   - Bật `Email/Password`
2. **Firestore Database**
   - Tạo database ở chế độ `Production` hoặc `Test`
3. **Storage**
   - Tạo bucket để lưu ảnh check-in/avatar
4. **Authorized domains**
   - Thêm `localhost`

## 2) File cấu hình đã chuẩn bị sẵn trong repo

- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `.firebaserc.example`
- `backend/.env.example`

## 3) Deploy rules/indexes

```bash
npm install -g firebase-tools
firebase login
firebase use vietwander-fdf99
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Nếu chưa có `.firebaserc`, copy từ `.firebaserc.example` thành `.firebaserc`.

## 4) Collections được app tự tạo

Khi bạn đăng ký / check-in lần đầu, app sẽ tự tạo các collection này:

- `users`
- `posts`
- `checkins`

## 5) Khi nào cần service account?

Chỉ cần khi bạn muốn:
- seed dữ liệu bằng backend
- chạy cron / moderation server-side
- upload file qua backend
- dùng Firebase Admin SDK

Lúc đó bạn cần tạo **Service Account JSON** hoặc điền biến trong `backend/.env.example`.

## 6) Web / Android / iOS cần gì?

- **Web app config**: đã có và đang dùng cho `frontend/web` + `frontend/mobile`
- **Android `google-services.json`**: đã có, đủ để build Android
- **iOS `GoogleService-Info.plist`**: chỉ cần khi bạn bắt đầu build iOS
