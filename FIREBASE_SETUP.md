# Khởi tạo và deploy Firebase cho VietWander

Repo này đã sẵn sàng cho:
- `frontend/web` deploy bằng Firebase Hosting
- `backend` deploy bằng Firebase Functions
- Firestore + Storage + Rules + Indexes

## 1) Những gì bạn cần tạo trong Firebase Console

Trong project Firebase của bạn, hãy bật các dịch vụ sau:

1. **Authentication**
   - bật `Email/Password`
2. **Firestore Database**
   - tạo database ở `Production` hoặc `Test`
3. **Storage**
   - tạo bucket lưu ảnh check-in / avatar
4. **Authorized domains**
   - thêm `localhost`
   - thêm domain thật sau khi deploy nếu có custom domain

## 2) Backend đã được chuẩn bị như thế nào

Backend hiện là Express app trong `backend/src/app.js` và đã được bọc thành Firebase Function tại `backend/index.js`.

Khi deploy:
- `frontend/web/dist` lên Firebase Hosting
- `backend` lên Firebase Functions
- route `/api/**` và `/health` sẽ tự rewrite sang function `api`

Nghĩa là khi web đã lên Hosting, frontend sẽ gọi API cùng domain, ví dụ:
- `/api/provinces`
- `/api/feed`
- `/health`

## 3) File cấu hình đã có sẵn

- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `.firebaserc.example`
- `backend/.env.example`
- `frontend/web/.env.example`

## 4) Cấu hình project Firebase CLI

Nếu chưa có CLI:

```bash
npm install -g firebase-tools
firebase login
```

Tạo `.firebaserc` từ `.firebaserc.example`, hoặc chạy:

```bash
firebase use --add
```

Ví dụ `.firebaserc`:

```json
{
  "projects": {
    "default": "vietwander-fdf99"
  }
}
```

## 5) Env cần chuẩn bị cho backend

### Nếu deploy lên Firebase Functions

Bạn **không bắt buộc** phải nhét Service Account JSON vào code deploy.

Function có thể dùng credentials mặc định của Firebase runtime. Tuy vậy bạn vẫn nên có:

```bash
USE_MEMORY_DB=false
FIREBASE_STORAGE_BUCKET=vietwander-fdf99.firebasestorage.app
```

### Nếu chạy local hoặc server riêng

Tạo `backend/.env` từ `backend/.env.example` và thêm:

```bash
PORT=4000
USE_MEMORY_DB=false
FIREBASE_PROJECT_ID=vietwander-fdf99
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=vietwander-fdf99.firebasestorage.app
```

Lưu ý:
- `google-services.json` của Android **không dùng cho backend**
- local backend cần **Service Account** hoặc `GOOGLE_APPLICATION_CREDENTIALS`

## 6) Env cho web

Tạo `frontend/web/.env` nếu bạn muốn override cấu hình mặc định.

Local development:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

Khi deploy Firebase Hosting + Functions:
- có thể bỏ trống `VITE_API_BASE_URL`
- frontend sẽ tự gọi cùng domain qua các rewrite của Firebase

## 7) Build trước khi deploy

Build web:

```bash
npm run build:web
```

Nếu muốn test backend local:

```bash
npm run dev:api
```

## 8) Deploy lên Firebase

Deploy toàn bộ:

```bash
firebase deploy
```

Hoặc deploy từng phần:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase deploy --only functions
firebase deploy --only hosting
```

## 9) Sau khi deploy xong, bạn cần làm gì

Checklist ngắn:

- mở URL Hosting và kiểm tra web render bình thường
- mở `/health` để xác nhận function hoạt động
- mở `/api/provinces` để xác nhận backend trả dữ liệu
- nếu cần dữ liệu mẫu, chạy local:

```bash
npm --workspace @vietwander/backend run seed:demo
```

## 10) Nếu deploy Functions mà backend vẫn vào memory mode

Kiểm tra lần lượt:

- `USE_MEMORY_DB` không được là `true`
- function đã deploy từ source `backend`
- project Firebase có Firestore thật
- runtime có nhận được project id hoặc biến `FIREBASE_PROJECT_ID`

Nếu bạn chạy **ngoài Firebase Functions**, hãy bổ sung thêm:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## 11) Bước tiếp theo nên làm

Để production tốt hơn, bạn nên bổ sung tiếp:
- verify Firebase ID token cho các route ghi dữ liệu
- hạn chế CORS theo domain thật
- tách seed/demo route khỏi production hoặc bảo vệ bằng admin auth
