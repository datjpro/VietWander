# VietWander

VietWander - Lang thang Việt Nam.

## Cấu trúc repo

- `frontend/mobile`: ứng dụng Expo React Native cho Android/iOS.
- `frontend/web`: dashboard web tách riêng, dùng Firebase Web SDK.
- `backend`: API Node/Express cho service layer backend.
- `UI`: mock giao diện và ảnh tham chiếu.
- `PROJECT.md`: blueprint sản phẩm và kỹ thuật.
- `FIREBASE_SETUP.md`: checklist khởi tạo Firestore/Storage/Auth.

## Chạy dự án

```bash
npm install --cache .npm-cache
npm run dev:web
npm run dev:mobile
npm run dev:api
```

## Lệnh chính

- `npm run dev:web`: chạy frontend web riêng tại `frontend/web`.
- `npm run start:web`: chạy bản build web tĩnh.
- `npm run build:web`: build frontend web ra `frontend/web/dist`.
- `npm run dev:mobile`: chạy Expo mobile.
- `npm run android`: mở Expo Android.
- `npm run ios`: mở Expo iOS.
- `npm run dev:api`: chạy backend local tại `http://localhost:4000`.
- `npm run typecheck`: kiểm tra workspace có TypeScript.
